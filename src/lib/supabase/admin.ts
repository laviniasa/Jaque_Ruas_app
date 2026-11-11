import { createClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase com a chave de serviço (service role).
 * Ignora as regras de segurança (RLS), por isso SÓ pode ser usado no servidor:
 * rotas em src/app/api. Nunca importe este arquivo em componente "use client".
 * Retorna null enquanto as variáveis de ambiente não estiverem configuradas.
 */
export function criarClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) return null;
  return createClient(url, chave, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type ClienteAdmin = NonNullable<ReturnType<typeof criarClienteAdmin>>;
