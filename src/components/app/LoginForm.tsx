"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { caminhoSeguro } from "@/lib/site";
import { criarClienteNavegador } from "@/lib/supabase/client";

const campo =
  "h-13 rounded-2xl border border-[var(--line2)] bg-[var(--card)] px-4 text-base text-[var(--text)] outline-none focus:border-pink";

export function LoginForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("erro") === "link") {
      setErro("O link do e-mail venceu ou já foi usado. Digite seu e-mail abaixo e peça um link novo.");
    }
  }, []);

  function destino() {
    return caminhoSeguro(new URLSearchParams(window.location.search).get("proximo"));
  }

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setAviso("");
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
    router.push(destino());
    router.refresh();
  }

  /** Manda o e-mail com o link para criar ou redefinir a senha. */
  async function pedirLink() {
    setErro("");
    setAviso("");
    const email = String(new FormData(formRef.current ?? undefined).get("email") ?? "").trim();
    if (!email) {
      setErro("Digite seu e-mail primeiro.");
      return;
    }
    const supabase = criarClienteNavegador();
    if (supabase) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/app/criar-senha`,
      });
    }
    // Mesma mensagem sempre, para não revelar quem é ou não é aluna.
    setAviso("Se este e-mail for de uma aluna, mandamos agora um link para criar sua senha. Confira também o spam.");
  }

  return (
    <form ref={formRef} onSubmit={entrar} className="mt-9 flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        E-mail
        <input name="email" type="email" required autoComplete="email" className={campo} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        Senha
        <input name="senha" type="password" required autoComplete="current-password" className={campo} />
      </label>
      {erro && <p role="alert" className="text-sm font-bold text-pink">{erro}</p>}
      {aviso && <p role="status" className="text-sm font-bold text-lime">{aviso}</p>}
      <button type="submit" disabled={carregando} className="mt-1 h-14 rounded-full bg-pink font-extrabold text-ink disabled:opacity-60">
        {carregando ? "Entrando..." : "Entrar"}
      </button>
      <button type="button" onClick={pedirLink} className="h-11 text-sm font-bold text-[var(--text2)] underline underline-offset-4">
        Esqueci ou ainda não criei minha senha
      </button>
    </form>
  );
}
