import Link from "next/link";

const exercicios = [
  { nome: "Elevação pélvica", series: "4 × 12", carga: "40 kg", descanso: "60s" },
  { nome: "Agachamento sumô", series: "4 × 15", carga: "16 kg", descanso: "45s" },
  { nome: "Abdução na máquina", series: "3 × 20", carga: "35 kg", descanso: "30s" },
  { nome: "Stiff com halteres", series: "4 × 10", carga: "2 × 12 kg", descanso: "60s" },
  { nome: "Coice no cabo", series: "3 × 15", carga: "10 kg", descanso: "30s" },
];

/**
 * Treino do dia (exemplo, no estilo do MFIT).
 * TODO: carregar treinos da aluna do Supabase e salvar exercícios feitos e feedback.
 */
export default function Treinos() {
  return (
    <div className="px-5 pb-10 pt-12">
      <Link href="/app/inicio" className="text-sm font-bold text-[var(--muted)]">← Início</Link>
      <h1 className="mt-3 font-display text-3xl uppercase">Glúteo A</h1>
      <p className="text-sm font-semibold text-[var(--muted)]">Inferiores · foco em glúteos</p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {exercicios.map((e) => (
          <li key={e.nome} className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
            <span className="grid h-14 w-14 flex-none place-items-center rounded-xl bg-[var(--card2)]">▶</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold">{e.nome}</span>
              <span className="mt-1 flex flex-wrap gap-1.5 text-xs font-bold text-[var(--muted)]">
                <span className="rounded-md bg-[var(--card2)] px-2 py-0.5">{e.series}</span>
                <span className="rounded-md bg-[var(--card2)] px-2 py-0.5">{e.carga}</span>
                <span className="rounded-md bg-[var(--card2)] px-2 py-0.5">desc. {e.descanso}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
