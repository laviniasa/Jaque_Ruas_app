import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do Supabase para usar em componentes do navegador ("use client").
 * Retorna null enquanto as variáveis de ambiente não estiverem configuradas,
 * para o site continuar funcionando em modo demonstração.
 */
export function criarClienteNavegador() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) return null;
  return createBrowserClient(url, chave);
}
