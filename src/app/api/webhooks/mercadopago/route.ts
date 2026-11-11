import { NextResponse } from "next/server";
import { processarPagamento } from "@/lib/liberarPlano";
import { avisoAutentico, buscarPagamento, mercadoPagoConfigurado } from "@/lib/mercadopago";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { urlDoSite } from "@/lib/site";

/**
 * Aviso automático do Mercado Pago (webhook). Configure em:
 * Mercado Pago > Suas integrações > Webhooks > URL: https://SEU-SITE/api/webhooks/mercadopago
 * Evento: Pagamentos.
 *
 * Se esta rota responder erro, o Mercado Pago tenta de novo mais tarde.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const corpo = await request.json().catch(() => ({}));

  const tipo = corpo?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const pagamentoId = String(corpo?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? "");

  // Outros avisos (assinaturas, estornos de contestação etc.) são ignorados por enquanto.
  if (tipo !== "payment" || !pagamentoId) return NextResponse.json({ ok: true });

  if (!avisoAutentico(request.headers, url.searchParams.get("data.id") ?? pagamentoId)) {
    return NextResponse.json({ erro: "assinatura inválida" }, { status: 401 });
  }

  const admin = criarClienteAdmin();
  if (!admin || !mercadoPagoConfigurado()) {
    return NextResponse.json({ erro: "pagamentos não configurados" }, { status: 503 });
  }

  try {
    const pagamento = await buscarPagamento(pagamentoId);
    if (pagamento?.external_reference) {
      await processarPagamento(admin, pagamento, urlDoSite(request));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao processar pagamento", pagamentoId, e);
    return NextResponse.json({ erro: "falha ao processar" }, { status: 500 });
  }
}
