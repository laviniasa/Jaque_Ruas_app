import { NextResponse } from "next/server";
import { infinitePayConfigurada } from "@/lib/infinitepay";
import { liberarSePago } from "@/lib/liberarPlano";
import { criarClienteAdmin } from "@/lib/supabase/admin";
import { urlDoSite } from "@/lib/site";

/**
 * Aviso automático da InfinitePay quando um link é pago.
 * O endereço vai junto em cada link (não precisa cadastrar no painel deles).
 * Se responder erro, a InfinitePay tenta de novo mais tarde.
 */
export async function POST(request: Request) {
  // Senha extra no endereço do aviso: barra avisos que não vieram dos nossos links.
  const token = process.env.INFINITEPAY_WEBHOOK_TOKEN;
  if (token && new URL(request.url).searchParams.get("t") !== token) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const corpo = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const orderNsu = String(corpo.order_nsu ?? "");
  const transactionNsu = String(corpo.transaction_nsu ?? "");
  const slug = String(corpo.invoice_slug ?? corpo.slug ?? "");
  if (!orderNsu || !transactionNsu || !slug) return NextResponse.json({ ok: true });

  const admin = criarClienteAdmin();
  if (!admin || !infinitePayConfigurada()) {
    return NextResponse.json({ erro: "pagamentos não configurados" }, { status: 400 });
  }

  try {
    await liberarSePago(admin, { orderNsu, transactionNsu, slug }, urlDoSite(request));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao processar aviso da InfinitePay", orderNsu, e);
    return NextResponse.json({ erro: "falha ao processar" }, { status: 400 });
  }
}
