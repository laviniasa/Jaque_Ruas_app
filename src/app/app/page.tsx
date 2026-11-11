import Link from "next/link";
import { LoginForm } from "@/components/app/LoginForm";
import { Silhueta } from "@/components/Logo";

/** Tela inicial do app: login da aluna (o ícone instalado abre aqui). */
export default function AppLogin() {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-16">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-26 w-26 place-items-center rounded-full bg-pink">
          <Silhueta cor="#0B0B0C" altura={88} />
        </span>
        <h1 className="mt-5 font-display text-[40px] uppercase leading-[0.95]">
          Jaque <span className="text-pink">Ruas</span>
        </h1>
        <p className="mt-2 text-sm font-bold tracking-wide text-[var(--muted)]">Área da aluna</p>
      </div>

      <LoginForm />

      <div className="mt-auto rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 text-center">
        <p className="text-sm font-bold">Ainda não é aluna da Jaque?</p>
        <Link href="/#planos" className="mt-3 flex h-12 items-center justify-center rounded-full bg-lime font-extrabold text-ink">
          Conhecer os planos →
        </Link>
      </div>
    </div>
  );
}
