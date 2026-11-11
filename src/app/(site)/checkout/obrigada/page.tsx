import type { Metadata } from "next";
import Link from "next/link";
import { infinitePayConfigurada } from "@/lib/infinitepay";
import { liberarSePago } from "@/lib/liberarPlano";
import { urlDoSite } from "@/lib/site";
import { criarClienteAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Pagamento recebido" };

/** Tela que aparece quando a aluna volta do Mercado Pago. */
export default async function Obrigada({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    demo?: string;
    teste?: string;
    order_nsu?: string;
    transaction_nsu?: string;
    slug?: string;
  }>;
}) {
  const { status, demo, teste, order_nsu, transaction_nsu, slug } = await searchParams;
  let pendente = status === "pendente";

  // Volta da InfinitePay: confere o pagamento na hora (o aviso automático também faz isso;
  // o que chegar primeiro libera, sem duplicar).
  if (order_nsu && transaction_nsu && slug && infinitePayConfigurada()) {
    const admin = criarClienteAdmin();
    if (admin) {
      try {
        const pago = await liberarSePago(admin, { orderNsu: order_nsu, transactionNsu: transaction_nsu, slug }, urlDoSite());
        if (!pago) pendente = true;
      } catch (e) {
        console.error("Erro ao conferir pagamento na volta da InfinitePay", e);
        pendente = true;
      }
    }
  }

  const passos = pendente
    ? [
        "Se ainda não pagou, conclua o Pix ou o cartão na tela de pagamento.",
        "Assim que o pagamento for confirmado, seu plano é liberado sozinho.",
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
        {pendente ? "Aguardando confirmação" : "Pagamento aprovado"}
      </span>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none sm:text-6xl">
        {pendente ? "Quase lá!" : "Bem-vinda ao time!"}
      </h1>
      {(demo || teste) && (
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
          {teste
            ? "Modo teste: o pagamento foi simulado, mas a conta e o e-mail são de verdade."
            : "Modo demonstração: nenhum pagamento real foi feito."}
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
