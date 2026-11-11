/**
 * Travas antifraude do lado do site. A análise principal de risco do cartão
 * é feita pelo Mercado Pago; aqui barramos robôs, abuso e dados claramente falsos
 * antes mesmo de criar a cobrança.
 */

// ---- Limite de tentativas (por IP e por e-mail) ----
// Fica na memória do servidor: suficiente para um servidor só (Render).
const tentativas = new Map<string, number[]>();

export function dentroDoLimite(chave: string, maximo: number, janelaMs: number) {
  const agora = Date.now();
  const recentes = (tentativas.get(chave) ?? []).filter((t) => agora - t < janelaMs);
  if (recentes.length >= maximo) {
    tentativas.set(chave, recentes);
    return false;
  }
  recentes.push(agora);
  tentativas.set(chave, recentes);
  if (tentativas.size > 10_000) tentativas.clear(); // evita encher a memória
  return true;
}

/** IP de quem está comprando (o Render repassa no cabeçalho x-forwarded-for). */
export function ipDaRequisicao(request: Request) {
  const encaminhado = request.headers.get("x-forwarded-for") ?? "";
  return encaminhado.split(",")[0].trim() || request.headers.get("x-real-ip") || "desconhecido";
}

// ---- E-mails descartáveis (usados para golpe e cadastro falso) ----
const DOMINIOS_DESCARTAVEIS = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "getnada.com", "sharklasers.com", "dispostable.com",
  "throwawaymail.com", "maildrop.cc", "fakeinbox.com", "emailondeck.com", "moakt.com",
]);

export function emailDescartavel(email: string) {
  const dominio = email.split("@")[1]?.toLowerCase() ?? "";
  return DOMINIOS_DESCARTAVEIS.has(dominio);
}

// ---- Dados para a análise de risco do Mercado Pago ----
export function separarNome(nomeCompleto: string) {
  const partes = nomeCompleto.trim().split(/\s+/);
  return { nome: partes[0] ?? "", sobrenome: partes.slice(1).join(" ") };
}

/** "5511999998888" ou "11999998888" -> { area_code: "11", number: "999998888" } */
export function separarTelefone(whatsapp: string) {
  let n = whatsapp.replace(/\D/g, "");
  if (n.length > 11 && n.startsWith("55")) n = n.slice(2);
  return { area_code: n.slice(0, 2), number: n.slice(2) };
}
