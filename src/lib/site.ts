/**
 * Endereço público do site, usado nos links do Mercado Pago e dos e-mails.
 * Ordem: variável NEXT_PUBLIC_SITE_URL > endereço automático do Render > endereço da requisição.
 */
export function urlDoSite(request?: Request) {
  const fixa = process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL;
  if (fixa) return fixa.replace(/\/$/, "");
  if (request) return new URL(request.url).origin;
  return "http://localhost:3000";
}

/** Aceita só caminhos internos ("/app/inicio"), para ninguém usar o link para mandar a aluna a outro site. */
export function caminhoSeguro(caminho: string | null | undefined, padrao = "/app/inicio") {
  if (!caminho || !caminho.startsWith("/") || caminho.startsWith("//")) return padrao;
  return caminho;
}
