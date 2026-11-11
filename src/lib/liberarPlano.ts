import type { ClienteAdmin } from "@/lib/supabase/admin";
import { conferirPagamentoInfinitePay } from "@/lib/infinitepay";
import type { PagamentoMP } from "@/lib/mercadopago";

/**
 * O que acontece quando o Mercado Pago avisa que um pagamento mudou:
 *
 * 1. Cria a conta da aluna (se for a primeira compra) e o Supabase manda
 *    o e-mail de boas-vindas com o botão "Criar minha senha".
 * 2. Libera o plano no app (assinatura ativa, com data de vencimento).
 * 3. Marca a compra como paga, para aparecer no painel da Jaque.
 *
 * O Mercado Pago pode mandar o mesmo aviso mais de uma vez. Cada passo
 * pode ser repetido sem duplicar nada.
 */
export async function processarPagamento(admin: ClienteAdmin, pagamento: PagamentoMP, siteUrl: string) {
  const { data: compra, error: erroCompra } = await admin
    .from("compras")
    .select("*")
    .eq("id", pagamento.external_reference)
    .maybeSingle();
  if (erroCompra) throw erroCompra;
  if (!compra) return;

  // Estorno ou contestação (chargeback) depois de pago: bloqueia o acesso no app.
  if (pagamento.status === "refunded" || pagamento.status === "charged_back") {
    await admin.from("assinaturas").update({ status: "bloqueada" }).eq("pagamento_ref", String(pagamento.id));
    await admin.from("compras").update({ status: "cancelada" }).eq("id", compra.id);
    return;
  }
  if (compra.status === "paga") return;

  if (pagamento.status === "rejected" || pagamento.status === "cancelled") {
    await admin
      .from("compras")
      .update({ status: "recusada", pagamento_ref: String(pagamento.id) })
      .eq("id", compra.id);
    return;
  }
  // Pix gerado e ainda não pago, cartão em análise etc.: espera o próximo aviso.
  if (pagamento.status !== "approved") return;

  if (Number(pagamento.transaction_amount) + 0.01 < Number(compra.valor)) {
    throw new Error(`Compra ${compra.id}: valor pago menor que o valor do plano`);
  }

  const { data: plano, error: erroPlano } = await admin
    .from("planos")
    .select("id, meses")
    .eq("id", compra.plano_id)
    .single();
  if (erroPlano) throw erroPlano;

  // 1. Conta da aluna
  const alunaId = await garantirConta(admin, compra, siteUrl);

  // 2. Plano liberado no app
  const hoje = hojeEmSaoPaulo();
  let venceEm: string | null = null;
  if (plano.meses) {
    // Se ela renovar antes de vencer, os dias que faltavam não se perdem.
    const { data: atual } = await admin
      .from("assinaturas")
      .select("vence_em")
      .eq("aluna_id", alunaId)
      .eq("status", "ativa")
      .not("vence_em", "is", null)
      .order("vence_em", { ascending: false })
      .limit(1)
      .maybeSingle();
    const base = atual?.vence_em && atual.vence_em > hoje ? atual.vence_em : hoje;
    venceEm = somarMeses(base, plano.meses);
  }

  const { error: erroAssinatura } = await admin.from("assinaturas").upsert(
    {
      aluna_id: alunaId,
      plano_id: plano.id,
      status: "ativa",
      inicio: hoje,
      vence_em: venceEm,
      pagamento_ref: String(pagamento.id),
    },
    { onConflict: "pagamento_ref", ignoreDuplicates: true },
  );
  if (erroAssinatura) throw erroAssinatura;

  // 3. Compra paga
  const { error: erroFinal } = await admin
    .from("compras")
    .update({
      status: "paga",
      pagamento_ref: String(pagamento.id),
      aluna_id: alunaId,
      pago_em: new Date().toISOString(),
    })
    .eq("id", compra.id);
  if (erroFinal) throw erroFinal;
}

type DadosCompra = {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string | null;
  objetivo: string | null;
  horario_preferido: string | null;
};

/** Devolve o id da aluna. Na primeira compra, cria a conta e manda o convite por e-mail. */
async function garantirConta(admin: ClienteAdmin, compra: DadosCompra, siteUrl: string) {
  const email = compra.email.trim().toLowerCase();

  const { data: perfil } = await admin.from("perfis").select("id").eq("email", email).maybeSingle();
  if (perfil) return perfil.id as string;

  // Cria o login e manda o e-mail "Criar minha senha" (modelo em supabase/emails/convite.html).
  const { data: convite, error: erroConvite } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { nome: compra.nome },
    redirectTo: `${siteUrl}/app/criar-senha`,
  });

  let alunaId = convite?.user?.id;
  if (!alunaId) {
    // O login já existia (ex.: um aviso anterior parou no meio). Procura pelo e-mail.
    alunaId = await acharUsuarioPorEmail(admin, email);
    if (!alunaId) throw erroConvite ?? new Error(`Não foi possível criar a conta de ${email}`);
  }

  const { error } = await admin.from("perfis").upsert(
    {
      id: alunaId,
      nome: compra.nome,
      email,
      whatsapp: compra.whatsapp,
      cpf: compra.cpf,
      objetivo: compra.objetivo,
      horario_preferido: compra.horario_preferido,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  return alunaId;
}

async function acharUsuarioPorEmail(admin: ClienteAdmin, email: string) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const achado = data.users.find((u) => u.email?.toLowerCase() === email);
    if (achado) return achado.id;
    if (data.users.length < 1000) return undefined;
  }
  return undefined;
}

/** Data de hoje no horário de Brasília, no formato AAAA-MM-DD. */
function hojeEmSaoPaulo() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

function somarMeses(data: string, meses: number) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const resultado = new Date(Date.UTC(ano, mes - 1 + meses, dia));
  // 31/01 + 1 mês vira o último dia de fevereiro, e não 03/03.
  if (resultado.getUTCDate() !== dia) resultado.setUTCDate(0);
  return resultado.toISOString().slice(0, 10);
}

/** Confere na InfinitePay e, se estiver pago, cria a conta e libera o plano. */
export async function liberarSePago(
  admin: ClienteAdmin,
  p: { orderNsu: string; transactionNsu: string; slug: string },
  siteUrl: string,
) {
  const conferido = await conferirPagamentoInfinitePay(p);
  if (!conferido.pago) return false;
  await processarPagamento(
    admin,
    { id: `ip-${conferido.transacao}`, status: "approved", external_reference: p.orderNsu, transaction_amount: conferido.valor },
    siteUrl,
  );
  return true;
}
