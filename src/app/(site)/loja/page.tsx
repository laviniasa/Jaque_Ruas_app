import type { Metadata } from "next";
import { Loja } from "@/components/site/Loja";

export const metadata: Metadata = {
  title: "Loja de suplementos",
  description: "Suplementos e acessórios que a Jaque Ruas usa e indica. Retire com ela ou receba em casa.",
};

export default function LojaPage() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-4 pb-14 pt-4 sm:px-10">
        <div className="rounded-[32px] bg-pink p-8 text-ink sm:p-16">
          <span className="inline-block rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-extrabold text-lime">
            Loja oficial da Jaque
          </span>
          <h1 className="jr-rise mt-4 font-display text-[clamp(56px,8vw,120px)] uppercase leading-[0.88]">
            Suplementos
            <br />
            que eu indico
          </h1>
          <p className="mt-5 max-w-[460px] text-lg font-semibold">
            Os mesmos produtos que eu uso e recomendo para as minhas alunas. Compre aqui e retire comigo ou receba em
            casa.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-4 pb-28 sm:px-10">
        <Loja />
      </section>
    </>
  );
}
