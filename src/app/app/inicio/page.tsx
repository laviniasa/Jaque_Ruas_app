import Link from "next/link";
import { Silhueta } from "@/components/Logo";
import { linkGrupoDicas, linkWhatsApp } from "@/lib/format";

/**
 * Início da aluna (exemplo).
 * TODO: buscar no Supabase o plano ativo, a próxima aula e o treino do dia.
 */
export default function InicioAluna() {
  const atalhos = [
    { titulo: "Meus treinos", href: "/app/treinos" },
    { titulo: "Loja", href: "/loja" },
    { titulo: "Grupo de dicas", href: linkGrupoDicas },
    { titulo: "Falar com a Jaque", href: linkWhatsApp() },
  ];

  return (
    <div className="px-5 pb-10 pt-12">
      <header className="flex items-center gap-2.5">
        <Silhueta cor="var(--color-pink)" altura={48} />
        <div className="leading-none">
          <p className="font-display text-xl uppercase">
            Jaque <span className="text-pink">Ruas</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">Bom dia!</p>
        </div>
      </header>

      <section className="mt-6 rounded-3xl bg-pink p-5 text-ink">
        <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-extrabold text-lime">Plano ativo</span>
        <p className="mt-3 font-display text-3xl uppercase leading-none">Personal 3x por semana</p>
        <p className="mt-1.5 text-sm font-bold">Renova em 02/12</p>
      </section>

      <Link href="/app/treinos" className="mt-3.5 flex items-center gap-3.5 rounded-3xl bg-lime p-5 text-ink">
        <span className="flex-1">
          <span className="block text-xs font-extrabold">TREINO DE HOJE</span>
          <span className="block font-display text-3xl uppercase leading-tight">Glúteo A</span>
          <span className="block text-sm font-bold">6 exercícios · ~45 min</span>
        </span>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-lime">▶</span>
      </Link>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        {atalhos.map((a) => (
          <a key={a.titulo} href={a.href} className="flex h-24 items-end rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3.5 text-sm font-extrabold">
            {a.titulo}
          </a>
        ))}
      </div>
    </div>
  );
}
