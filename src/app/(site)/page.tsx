import Link from "next/link";
import { Silhueta } from "@/components/Logo";
import { Planos } from "@/components/site/Planos";
import { linkGrupoDicas, linkWhatsApp } from "@/lib/format";

const palavras = ["Glúteos", "Treino em casa", "Academia", "Vídeo de cada exercício", "Acesso na hora"];

export default function Home() {
  return (
    <>
      {/* ABERTURA */}
      <section id="topo" className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-12 px-4 pb-16 pt-8 sm:px-10">
        <div className="min-w-0 flex-[1_1_560px]">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] px-3.5 py-2 font-mono text-xs uppercase tracking-[0.1em] text-[var(--text2)]">
            <span className="h-2 w-2 rounded-full bg-lime" />
            Especialista em glúteos
          </span>

          <h1 className="mt-7 font-display text-[clamp(72px,10vw,160px)] uppercase leading-[0.86]">
            <span className="jr-rise block">Bumbum</span>
            <span className="jr-rise block text-transparent [-webkit-text-stroke:2px_var(--color-pink)] [animation-delay:.18s]">
              na nuca
            </span>
            <span className="jr-rise block text-[var(--accent-text)] [animation-delay:.36s]">em 3 meses</span>
          </h1>

          <p className="mt-8 max-w-[480px] text-lg leading-relaxed text-[var(--text2)]">
            Personal presencial ou treino online com o meu método. Você escolhe o plano, paga e{" "}
            <strong className="text-[var(--text)]">começa hoje</strong>, com tudo no app.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link href="#planos" className="jr-pulse inline-flex h-15 items-center rounded-full bg-pink px-8 text-[17px] font-extrabold text-ink">
              Ver planos →
            </Link>
            <Link href="/loja" className="inline-flex h-15 items-center rounded-full border border-[var(--line2)] px-6 font-extrabold">
              Loja de suplementos
            </Link>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2.5 text-sm font-bold">
            <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-3">
              Falar no WhatsApp
            </a>
            <a href={linkGrupoDicas} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-3">
              Entrar no grupo de dicas (grátis)
            </a>
          </div>
        </div>

        <div className="relative h-[560px] min-w-0 flex-[1_1_380px] sm:h-[660px]">
          {/* TODO: trocar pela foto da Jaque (vertical, boa resolução) em /public/img/jaque-hero.jpg */}
          <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-[300px_300px_32px_32px] border-[3px] border-pink bg-[var(--card2)] sm:left-10">
            <span className="m-7 rounded-xl bg-black/80 px-3.5 py-2.5 font-mono text-xs text-[#a7a3a0]">FOTO DA JAQUE</span>
          </div>
          <div className="jr-spin absolute left-0 top-6 grid h-36 w-36 place-items-center rounded-full bg-lime">
            <Silhueta cor="#0B0B0C" altura={88} />
          </div>
        </div>
      </section>

      {/* FAIXA */}
      <div aria-hidden="true" className="-mx-5 mt-2 -rotate-[1.5deg] overflow-hidden bg-lime py-4 text-ink">
        <div className="jr-marquee flex w-max gap-10 whitespace-nowrap font-display text-4xl uppercase">
          {[...palavras, ...palavras].map((p, i) => (
            <span key={i}>{p} ✦</span>
          ))}
        </div>
      </div>

      {/* PLANOS */}
      <section id="planos" className="mx-auto max-w-[1320px] px-4 py-32 sm:px-10">
        <h2 className="jr-reveal mb-14 font-display text-[clamp(52px,6.4vw,104px)] uppercase leading-[0.9]">
          Escolha. Pague.
          <br />
          <span className="text-pink">Treine hoje.</span>
        </h2>
        <Planos />
      </section>

      {/* CHAMADA FINAL */}
      <section className="border-t border-[var(--line)] px-4 py-28 text-center">
        <h2 className="jr-reveal font-display text-[clamp(80px,15vw,230px)] uppercase leading-[0.84]">
          Bora
          <br />
          <span className="text-pink">treinar?</span>
        </h2>
        <Link href="#planos" className="jr-pulse mt-12 inline-flex h-16 items-center rounded-full bg-lime px-9 text-lg font-extrabold text-ink">
          Escolher meu plano →
        </Link>
      </section>
    </>
  );
}
