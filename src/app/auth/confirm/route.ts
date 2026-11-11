import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { urlDoSite, caminhoSeguro } from "@/lib/site";
import { criarClienteServidor } from "@/lib/supabase/server";

/**
 * Para onde leva o botão dos e-mails ("Criar minha senha" e "Redefinir senha").
 * Confere o código do link, deixa a aluna logada e manda para a tela de criar senha.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const tipo = searchParams.get("type") as EmailOtpType | null;
  const proximo = caminhoSeguro(searchParams.get("next"), "/app/criar-senha");
  const site = urlDoSite(request);

  if (tokenHash && tipo) {
    const supabase = await criarClienteServidor();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(`${site}${proximo}`);
    }
  }

  // Link vencido (vale 24h) ou já usado.
  return NextResponse.redirect(`${site}/app?erro=link`);
}
