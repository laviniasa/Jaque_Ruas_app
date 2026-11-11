"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase/client";

const campo =
  "h-13 rounded-2xl border border-[var(--line2)] bg-[var(--card)] px-4 text-base text-[var(--text)] outline-none focus:border-pink";

export function CriarSenhaForm() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [linkVencido, setLinkVencido] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    const dados = new FormData(e.currentTarget);
    const senha = String(dados.get("senha") ?? "");
    const repetir = String(dados.get("repetir") ?? "");

    if (senha.length < 8) return setErro("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== repetir) return setErro("As duas senhas não são iguais.");

    const supabase = criarClienteNavegador();
    if (!supabase) {
      router.push("/app/inicio"); // modo demonstração
      return;
    }

    setSalvando(true);
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setSalvando(false);
      setLinkVencido(true);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);
    if (error) {
      setErro("Não deu para salvar a senha. Tente uma senha diferente.");
      return;
    }
    router.replace("/app/inicio");
  }

  if (linkVencido) {
    return (
      <div className="mt-9 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 text-center">
        <p className="font-bold">Este link venceu ou já foi usado.</p>
        <p className="mt-2 text-sm text-[var(--text2)]">
          Na tela de entrada, digite seu e-mail e toque em “Esqueci ou ainda não criei minha senha”. Mandamos um link novo.
        </p>
        <Link href="/app" className="mt-4 flex h-12 items-center justify-center rounded-full bg-pink font-extrabold text-ink">
          Ir para a entrada
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={salvar} className="mt-9 flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        Nova senha
        <input name="senha" type="password" required minLength={8} autoComplete="new-password" className={campo} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        Repita a senha
        <input name="repetir" type="password" required minLength={8} autoComplete="new-password" className={campo} />
      </label>
      {erro && <p role="alert" className="text-sm font-bold text-pink">{erro}</p>}
      <button type="submit" disabled={salvando} className="mt-1 h-14 rounded-full bg-pink font-extrabold text-ink disabled:opacity-60">
        {salvando ? "Salvando..." : "Salvar e entrar no app"}
      </button>
    </form>
  );
}
