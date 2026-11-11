"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

const campo =
  "h-13 rounded-2xl border border-[var(--line2)] bg-[var(--card)] px-4 text-base text-[var(--text)] outline-none focus:border-pink";

export function LoginForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    const dados = new FormData(e.currentTarget);
    const email = String(dados.get("email") ?? "");
    const senha = String(dados.get("senha") ?? "");

    const supabase = criarClienteNavegador();
    if (!supabase) {
      // Supabase ainda não configurado: segue para a demonstração.
      router.push("/app/inicio");
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }
    router.push("/app/inicio");
  }

  return (
    <form onSubmit={entrar} className="mt-9 flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        E-mail
        <input name="email" type="email" required autoComplete="email" className={campo} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        Senha
        <input name="senha" type="password" required autoComplete="current-password" className={campo} />
      </label>
      {erro && <p role="alert" className="text-sm font-bold text-pink">{erro}</p>}
      <button type="submit" disabled={carregando} className="mt-1 h-14 rounded-full bg-pink font-extrabold text-ink disabled:opacity-60">
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
