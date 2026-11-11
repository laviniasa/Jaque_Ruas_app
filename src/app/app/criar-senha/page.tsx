import type { Metadata } from "next";
import { CriarSenhaForm } from "@/components/app/CriarSenhaForm";
import { Silhueta } from "@/components/Logo";

export const metadata: Metadata = { title: "Criar minha senha" };

/** A aluna chega aqui pelo botão do e-mail de boas-vindas (ou de "esqueci minha senha"). */
export default function CriarSenha() {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-16">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-pink">
          <Silhueta cor="#0B0B0C" altura={68} />
        </span>
        <h1 className="mt-5 font-display text-[36px] uppercase leading-[0.95]">
          Crie sua <span className="text-pink">senha</span>
        </h1>
        <p className="mt-3 max-w-xs text-sm font-semibold text-[var(--text2)]">
          É com ela que você vai entrar no app da Jaque. Use pelo menos 8 caracteres.
        </p>
      </div>
      <CriarSenhaForm />
    </div>
  );
}
