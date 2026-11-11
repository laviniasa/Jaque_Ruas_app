import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Telas do app que qualquer pessoa pode abrir sem estar logada. */
const telasAbertas = ["/app", "/app/criar-senha"];

/**
 * Roda antes de cada página do app e do painel:
 * - renova o login da aluna (para ela não ser deslogada sozinha);
 * - quem não está logada vai para a tela de entrada do app;
 * - o painel /admin só abre para a Jaque (is_admin = true).
 * Sem o Supabase configurado (modo demonstração), deixa tudo aberto.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  // Arquivos do PWA (sw.js, manifest, ícones) passam direto.
  if (!url || !chave || pathname.includes(".")) return NextResponse.next();

  let resposta = NextResponse.next({ request });
  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const precisaLogin = pathname.startsWith("/admin") || !telasAbertas.includes(pathname.replace(/\/$/, ""));
  if (precisaLogin && !user) {
    const entrada = request.nextUrl.clone();
    entrada.pathname = "/app";
    entrada.search = `?proximo=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(entrada);
  }

  if (pathname.startsWith("/admin") && user) {
    const { data: perfil } = await supabase.from("perfis").select("is_admin").eq("id", user.id).maybeSingle();
    if (!perfil?.is_admin) {
      const inicio = request.nextUrl.clone();
      inicio.pathname = "/app/inicio";
      inicio.search = "";
      return NextResponse.redirect(inicio);
    }
  }

  return resposta;
}

export const config = {
  matcher: ["/app", "/app/:path*", "/admin", "/admin/:path*"],
};
