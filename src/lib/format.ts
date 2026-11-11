/** Formata um número como Real: 1280 -> "R$ 1.280,00" */
export function brl(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Link do WhatsApp com mensagem pronta */
export function linkWhatsApp(mensagem = "Oi, Jaque! Vim pelo site."): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP ?? "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const linkGrupoDicas = process.env.NEXT_PUBLIC_GRUPO_DICAS ?? "#";
