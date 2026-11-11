import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/site/CheckoutForm";
import { planos } from "@/lib/data";
import { brl } from "@/lib/format";

export const metadata: Metadata = { title: "Finalizar assinatura" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string; erro?: string }>;
}) {
  const { plano: planoId, erro } = await searchParams;
  const plano = planos.find((p) => p.id === planoId && p.ativo);

  if (!plano) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl uppercase">Plano não encontrado</h1>
        <Link href="/#planos" className="mt-8 inline-flex h-14 items-center rounded-full bg-pink px-7 font-extrabold text-ink">
          Ver planos
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-[1fr_1.2fr]">
      <aside className="h-fit rounded-3xl bg-cream p-7 text-ink">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#5C5853]">Seu pedido</span>
        <h1 className="mt-3 font-display text-4xl uppercase leading-none">
          {plano.categoria === "personal" ? "Personal " : "Treino online "}
          {plano.nome.toLowerCase()}
        </h1>
        <p className="mt-2 font-semibold text-[#5C5853]">{plano.descricao}</p>
        <p className="mt-6 font-display text-5xl">{brl(plano.preco)}</p>
        <p className="font-bold text-[#5C5853]">{plano.periodo}</p>
        <p className="mt-6 border-t border-[#D6D0C8] pt-4 text-sm font-semibold text-[#5C5853]">
          Pagamento seguro. Assim que for aprovado, seu acesso ao app é liberado na hora.
        </p>
      </aside>
      <div>
        {erro === "pagamento" && (
          <p role="alert" className="mb-5 rounded-2xl border border-pink px-4 py-3 text-sm font-bold text-pink">
            O pagamento não foi concluído. Confira os dados e tente de novo, ou escolha outra forma de pagamento.
          </p>
        )}
        <CheckoutForm planoId={plano.id} personal={plano.categoria === "personal"} />
      </div>
    </section>
  );
}
