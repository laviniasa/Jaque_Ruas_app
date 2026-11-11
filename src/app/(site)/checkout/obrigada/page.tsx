import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pagamento recebido" };

/** Tela que aparece quando a aluna volta do Mercado Pago. */
export default async function Obrigada({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; demo?: string }>;
}) {
  const { status, demo } = await searchParams;
  const pendente = status === "pendente";

  const passos = pendente
    ? [
        "Pague o Pix pelo app do seu banco (o código vale por tempo limitado).",
        "Assim que o banco confirmar, seu plano é liberado sozinho.",
        "Você recebe um e-mail com o botão “Criar minha senha”.",
      ]
    : [
        "Abra o e-mail que acabamos de mandar (veja também o spam e a aba Promoções).",
        "Toque em “Criar minha senha” e escolha a sua senha.",
        "Pronto: o app abre com o seu plano liberado. Instale na tela inicial do celular.",
      ];

  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-pink">
        {pendente ? "Aguardando o Pix" : "Pagamento aprovado"}
      </span>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none sm:text-6xl">
        {pendente ? "Quase lá!" : "Bem-vinda ao time!"}
      </h1>
      {demo && (
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
          Modo demonstração: nenhum pagamento real foi feito.
        </p>
      )}

      <ol className="mt-10 flex flex-col gap-3 text-left">
        {passos.map((passo, i) => (
          <li key={passo} className="flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink font-extrabold text-ink">
              {i + 1}
            </span>
            <span className="pt-1 font-semibold">{passo}</span>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm font-semibold text-[var(--text2)]">
        Já é aluna da Jaque? Seu plano foi renovado. É só entrar no app com a sua senha de sempre.
      </p>

      <Link
        href="/app"
        className="mt-8 inline-flex h-14 items-center rounded-full bg-pink px-8 font-extrabold text-ink"
      >
        Abrir o app
      </Link>
    </section>
  );
}
