import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { linkGrupoDicas, linkWhatsApp } from "@/lib/format";

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-10">
      <Link href="/" className="no-underline">
        <Logo />
      </Link>

      <nav aria-label="Principal" className="flex flex-wrap gap-6 text-sm font-semibold">
        <Link href="/#planos">Planos</Link>
        <Link href="/loja">Loja</Link>
        <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href={linkGrupoDicas} target="_blank" rel="noopener noreferrer">Grupo de dicas</a>
      </nav>

      <div className="flex flex-wrap items-center gap-2.5 whitespace-nowrap">
        <ThemeToggle />
        <Link
          href="/app"
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--line2)] px-4 text-sm font-extrabold"
        >
          Entrar no app
        </Link>
        <Link
          href="/#planos"
          className="inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-extrabold text-ink"
        >
          Comprar agora
        </Link>
      </div>
    </header>
  );
}
