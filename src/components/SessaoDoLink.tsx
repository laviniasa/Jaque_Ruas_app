"use client";

import { useEffect } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

/**
 * Quando o e-mail usa o modelo padrão do Supabase (sem SMTP próprio), o link
 * chega no site com o login no final do endereço (#access_token=...).
 * Este componente pega esse login, guarda e leva a aluna para criar a senha.
 */
export function SessaoDoLink() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const p = new URLSearchParams(hash);

    if (p.get("error_description")) {
      window.location.replace("/app?erro=link");
      return;
    }

    const access_token = p.get("access_token");
    const refresh_token = p.get("refresh_token");
    if (!access_token || !refresh_token) return;

    const supabase = criarClienteNavegador();
    if (!supabase) return;

    const tipo = p.get("type");
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (error) {
        window.location.replace("/app?erro=link");
        return;
      }
      const precisaSenha = tipo === "invite" || tipo === "recovery" || tipo === "signup";
      window.location.replace(precisaSenha ? "/app/criar-senha" : "/app/inicio");
    });
  }, []);

  return null;
}
