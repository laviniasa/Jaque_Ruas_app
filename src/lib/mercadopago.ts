import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Conversa com a API do Mercado Pago (Checkout Pro: Pix e cartão).
 * Usado só no servidor. Documentação: https://www.mercadopago.com.br/developers
 */
const API = "https://api.mercadopago.com";

function token() {
  return process.env.MERCADOPAGO_ACCESS_TOKEN || null;
}

export function mercadoPagoConfigurado() {
  return Boolean(token());
}

type NovaCobranca = {
  compraId: string;
  planoId: string;
  titulo: string;
  preco: number;
  nome: string;
  email: string;
  siteUrl: string;
};

/** Cria a cobrança e devolve o link da tela de pagamento do Mercado Pago. */
export async function criarCobranca(c: NovaCobranca): Promise<string> {
  const resposta = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": c.compraId,
    },
    body: JSON.stringify({
      items: [{ id: c.planoId, title: c.titulo, quantity: 1, unit_price: c.preco, currency_id: "BRL" }],
      payer: { name: c.nome, email: c.email },
      external_reference: c.compraId,
      notification_url: `${c.siteUrl}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${c.siteUrl}/checkout/obrigada`,
        pending: `${c.siteUrl}/checkout/obrigada?status=pendente`,
        failure: `${c.siteUrl}/checkout?plano=${c.planoId}&erro=pagamento`,
      },
      auto_return: "approved",
      statement_descriptor: "JAQUE RUAS",
    }),
  });
  if (!resposta.ok) {
    throw new Error(`Mercado Pago recusou a cobrança (${resposta.status}): ${await resposta.text()}`);
  }
  const dados = (await resposta.json()) as { init_point?: string };
  if (!dados.init_point) throw new Error("Mercado Pago não devolveu o link de pagamento");
  return dados.init_point;
}

export type PagamentoMP = {
  id: number | string;
  status: "approved" | "pending" | "in_process" | "authorized" | "rejected" | "cancelled" | "refunded" | "charged_back";
  external_reference: string | null;
  transaction_amount: number;
};

/**
 * Busca o pagamento direto no Mercado Pago.
 * O aviso (webhook) só diz "o pagamento X mudou"; a situação real sempre vem daqui,
 * assim ninguém consegue liberar um plano mandando um aviso falso.
 */
export async function buscarPagamento(id: string): Promise<PagamentoMP | null> {
  const resposta = await fetch(`${API}/v1/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (resposta.status === 404) return null;
  if (!resposta.ok) throw new Error(`Erro ao buscar pagamento ${id} (${resposta.status})`);
  return (await resposta.json()) as PagamentoMP;
}

/**
 * Confere a assinatura secreta do aviso (cabeçalho x-signature).
 * Se a chave MERCADOPAGO_WEBHOOK_SECRET não estiver configurada, deixa passar:
 * o pagamento é sempre conferido na API de qualquer forma.
 */
export function avisoAutentico(headers: Headers, dataId: string) {
  const segredo = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!segredo) return true;

  const assinatura = headers.get("x-signature") ?? "";
  const requestId = headers.get("x-request-id") ?? "";
  const partes = Object.fromEntries(
    assinatura.split(",").map((p) => p.trim().split("=") as [string, string]),
  );
  if (!partes.ts || !partes.v1) return false;

  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  const modelo = `id:${id};request-id:${requestId};ts:${partes.ts};`;
  const esperado = createHmac("sha256", segredo).update(modelo).digest("hex");

  const a = Buffer.from(esperado);
  const b = Buffer.from(partes.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}
