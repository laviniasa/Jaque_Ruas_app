import Link from "next/link";
import { Silhueta } from "@/components/Logo";
import { linkWhatsApp } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-5 border-t border-[var(--line)] px-4 py-8 text-sm text-[var(--muted)] sm:px-10">
      <span className="flex items-center gap-2.5 font-display text-xl uppercase tracking-wide text-[var(--text)]">
        <Silhueta cor="var(--color-pink)" altura={40} />
        Jaque Ruas
      </span>
      <div className="flex flex-wrap gap-6">
        <a href="https://www.instagram.com/jaque.ruaspersonal/" target="_blank" rel="noopener noreferrer">
          @jaque.ruaspersonal
        </a>
        <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <Link href="/admin">Área da Jaque</Link>
      </div>
      <span>© {new Date().getFullYear()} Jaque Ruas</span>
    </footer>
  );
}
