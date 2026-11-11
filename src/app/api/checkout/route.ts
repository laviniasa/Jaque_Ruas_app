import { NextResponse } from "next/server";
import { planos as planosDemo } from "@/lib/data";
import { criarCobranca, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { urlDoSite } from "@/lib/site";

/**
 * Recebe o formulário do checkout, guarda os dados da aluna como "compra aguardando
 * pagamento" e devolve o link do Mercado Pago (Pix ou cartão).
 * O preço sempre vem do banco, nunca do navegador.
 */
export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  const dados = validar(corpo);
  if ("erro" in dados) return NextResponse.json({ erro: dados.erro }, { status: 400 });

  const admin = criarClienteAdmin();

  // Modo demonstração: sem Supabase ou sem Mercado Pago, vai direto para a tela de sucesso.
  if (!admin || !mercadoPagoConfigurado()) {
    const plano = planosDemo.find((p) => p.id === dados.planoId && p.ativo);
    if (!plano) return NextResponse.json({ erro: "Plano não encontrado." }, { status: 404 });
    return NextResponse.json({ url: "/checkout/obrigada?demo=1" });
  }

  const { data: plano } = await admin
    .from("planos")
    .select("id, categoria, nome, preco")
    .eq("id", dados.planoId)
    .eq("ativo", true)
    .maybeSingle();
  if (!plano) return NextResponse.json({ erro: "Este plano não está mais à venda." }, { status: 404 });

  if (plano.categoria === "personal") {
    const { data: config } = await admin.from("configuracoes").select("pausar_personal").eq("id", 1).maybeSingle();
    if (config?.pausar_personal) {
      return NextResponse.json(
        { erro: "As vagas de personal estão esgotadas no momento. Fale com a Jaque no WhatsApp para entrar na lista de espera." },
        { status: 409 },
      );
    }
  }

  const { data: compra, error } = await admin
    .from("compras")
    .insert({
      plano_id: plano.id,
      nome: dados.nome,
      email: dados.email,
      whatsapp: dados.whatsapp,
      cpf: dados.cpf,
      objetivo: dados.objetivo,
      horario_preferido: dados.horario,
      valor: plano.preco,
    })
    .select("id")
    .single();
  if (error || !compra) {
    console.error("Erro ao salvar compra", error);
    return NextResponse.json({ erro: "Não foi possível iniciar o pagamento. Tente de novo." }, { status: 500 });
  }

  try {
    const titulo = `${plano.categoria === "personal" ? "Personal" : "Treino online"} ${plano.nome} | Jaque Ruas`;
    const url = await criarCobranca({
      compraId: compra.id,
      planoId: plano.id,
      titulo,
      preco: Number(plano.preco),
      nome: dados.nome,
      email: dados.email,
      siteUrl: urlDoSite(request),
    });
    return NextResponse.json({ url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ erro: "O pagamento está fora do ar agora. Tente de novo em alguns minutos." }, { status: 502 });
  }
}

type DadosValidos = {
  planoId: string;
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  objetivo: string | null;
  horario: string | null;
};

function validar(corpo: unknown): DadosValidos | { erro: string } {
  if (!corpo || typeof corpo !== "object") return { erro: "Dados inválidos." };
  const c = corpo as Record<string, unknown>;
  const texto = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

  const planoId = texto(c.planoId, 20);
  const nome = texto(c.nome);
  const email = texto(c.email).toLowerCase();
  const whatsapp = texto(c.whatsapp, 30).replace(/\D/g, "");
  const cpf = texto(c.cpf, 20).replace(/\D/g, "");

  if (!planoId) return { erro: "Escolha um plano." };
  if (nome.split(/\s+/).length < 2) return { erro: "Digite seu nome completo." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: "Confira o seu e-mail. É por ele que chega o seu acesso." };
  if (whatsapp.length < 10 || whatsapp.length > 13) return { erro: "Confira o número do WhatsApp com DDD." };
  if (!cpfValido(cpf)) return { erro: "Confira o CPF." };

  return {
    planoId,
    nome,
    email,
    whatsapp,
    cpf,
    objetivo: texto(c.objetivo, 40) || null,
    horario: texto(c.horario, 40) || null,
  };
}

function cpfValido(cpf: string) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (n: number) => {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(cpf[i]) * (n + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}
