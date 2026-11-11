/**
 * Checkout da InfinitePay (link de pagamento: Pix e cartão).
 * Documentação: https://www.infinitepay.io/checkout-documentacao
 *
 * Como a Jaque quer:
 * - ela recebe à vista;
 * - se a aluna parcelar, os juros ficam com a aluna (assured_installments = 0).
 */
const API = "https://api.checkout.infinitepay.io";

function handle() {
  return (process.env.INFINITEPAY_HANDLE || "").replace(/^\$/, "") || null;
}
function apiKey() {
  return process.env.INFINITEPAY_API_KEY || null;
}

export function infinitePayConfigurada() {
  return Boolean(handle() || apiKey());
}

type NovoLink = {
  compraId: string;
  descricao: string;
  preco: number; // em reais
  nome: string;
  email: string;
  whatsapp: string; // só números
  siteUrl: string;
};

/** Cria o link de pagamento e devolve o endereço para a aluna pagar. */
export async function criarLinkInfinitePay(l: NovoLink): Promise<string> {
  const token = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  const webhook = `${l.siteUrl}/api/webhooks/infinitepay${token ? `?t=${encodeURIComponent(token)}` : ""}`;
  const telefone = l.whatsapp.startsWith("55") ? `+${l.whatsapp}` : `+55${l.whatsapp}`;

  const corpo: Record<string, unknown> = {
    items: [{ quantity: 1, price: Math.round(l.preco * 100), description: l.descricao }],
    order_nsu: l.compraId,
    redirect_url: `${l.siteUrl}/checkout/obrigada`,
    webhook_url: webhook,
    customer: { name: l.nome, email: l.email, phone_number: telefone },
  };
  if (handle()) corpo.handle = handle();
  // As opções (juros para a aluna, validade) exigem a chave de API.
  if (apiKey()) {
    corpo.options = {
      assured_installments: 0, // juros do parcelamento sempre por conta da aluna
      payment_methods_enabled: ["credit_card", "pix"],
      single_payment: true, // o link só pode ser pago uma vez
      valid_until: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // vence em 1 hora
    };
  }

  const resposta = await fetch(`${API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiKey() ? { "X-Api-Key": apiKey()! } : {}) },
    body: JSON.stringify(corpo),
  });
  const texto = await resposta.text();
  if (!resposta.ok) throw new Error(`InfinitePay recusou o link (${resposta.status}): ${texto}`);

  // A documentação não diz o nome exato do campo do link; procuramos os mais prováveis.
  const dados = JSON.parse(texto) as Record<string, unknown>;
  const link = [dados.url, dados.link, dados.checkout_url, dados.payment_url, (dados.data as Record<string, unknown> | undefined)?.url]
    .find((v): v is string => typeof v === "string" && v.startsWith("http"));
  if (!link) throw new Error(`InfinitePay não devolveu o link. Resposta: ${texto.slice(0, 500)}`);
  return link;
}

export type ConferenciaInfinitePay = {
  pago: boolean;
  valor: number; // em reais (valor original, sem juros da aluna)
  transacao: string;
};

/**
 * Confere na InfinitePay se o pagamento é real. O aviso (webhook) deles não tem
 * assinatura, então NUNCA liberamos nada sem passar por aqui.
 */
export async function conferirPagamentoInfinitePay(p: {
  orderNsu: string;
  transactionNsu: string;
  slug: string;
}): Promise<ConferenciaInfinitePay> {
  const resposta = await fetch(`${API}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiKey() ? { "X-Api-Key": apiKey()! } : {}) },
    body: JSON.stringify({
      ...(handle() ? { handle: handle() } : {}),
      order_nsu: p.orderNsu,
      transaction_nsu: p.transactionNsu,
      slug: p.slug,
    }),
    cache: "no-store",
  });
  if (!resposta.ok) throw new Error(`Erro ao conferir pagamento na InfinitePay (${resposta.status})`);
  const d = (await resposta.json()) as { success?: boolean; paid?: boolean; amount?: number };
  return { pago: Boolean(d.success && d.paid), valor: Number(d.amount ?? 0) / 100, transacao: p.transactionNsu };
}
