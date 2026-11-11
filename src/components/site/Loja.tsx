"use client";

import { useMemo, useState } from "react";
import { produtos, type Produto } from "@/lib/data";
import { brl } from "@/lib/format";

const categorias = ["Todos", "Whey", "Creatina", "Pré e BCAA", "Acessórios"] as const;

/**
 * Vitrine + carrinho.
 * TODO: finalizar compra via /api/pedidos (Mercado Pago) e salvar o pedido no Supabase.
 */
export function Loja() {
  const [categoria, setCategoria] = useState<(typeof categorias)[number]>("Todos");
  const [carrinho, setCarrinho] = useState<Record<string, number>>({});
  const [entrega, setEntrega] = useState<"retirada" | "casa">("retirada");

  const visiveis = produtos.filter((p) => p.ativo && (categoria === "Todos" || p.categoria === categoria));
  const itens = useMemo(
    () =>
      Object.entries(carrinho)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ produto: produtos.find((p) => p.id === id) as Produto, qtd: q })),
    [carrinho],
  );
  const total = itens.reduce((soma, i) => soma + i.produto.preco * i.qtd, 0);
  const qtdTotal = itens.reduce((soma, i) => soma + i.qtd, 0);

  function mudar(id: string, delta: number) {
    setCarrinho((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + delta) }));
  }

  return (
    <div className="flex flex-wrap items-start gap-7">
      <div className="min-w-0 flex-[3_1_620px]">
        <div role="group" aria-label="Categorias" className="mb-7 flex flex-wrap gap-2.5">
          {categorias.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c)}
              className={`h-11 rounded-full border px-5 text-[15px] font-extrabold ${
                categoria === c ? "border-pink bg-pink text-ink" : "border-[var(--line2)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
          {visiveis.map((p) => {
            const q = carrinho[p.id] ?? 0;
            const esgotado = p.estoque <= 0;
            return (
              <article
                key={p.id}
                className={`jr-reveal relative flex flex-col gap-2.5 rounded-3xl border bg-[var(--card)] p-3.5 transition-[translate] hover:-translate-y-2 ${
                  q ? "border-pink" : "border-[var(--line)]"
                }`}
              >
                {p.selo && (
                  <span className="absolute left-6 top-6 rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold text-lime">
                    {p.selo}
                  </span>
                )}
                {/* TODO: foto real do produto */}
                <div className="h-52 rounded-2xl" style={{ background: p.cor }} />
                <div className="px-1">
                  <h3 className="text-[17px] font-extrabold">{p.nome}</h3>
                  <p className="text-[13px] font-semibold text-[var(--muted)]">{p.detalhe}</p>
                  <p className="mt-2.5 font-display text-3xl text-pink">{brl(p.preco)}</p>
                </div>
                <button
                  type="button"
                  disabled={esgotado}
                  onClick={() => mudar(p.id, 1)}
                  className={`h-12 rounded-full border border-pink font-extrabold disabled:opacity-40 ${
                    q ? "" : "bg-pink text-ink"
                  }`}
                >
                  {esgotado ? "Esgotado" : q ? `No carrinho (${q}) · adicionar mais` : "Adicionar ao carrinho"}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <aside id="carrinho" aria-label="Carrinho" className="min-w-0 flex-[2_1_360px] rounded-[28px] bg-cream p-6 text-ink">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl uppercase">Seu carrinho</h2>
          <span className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-extrabold text-cream">{qtdTotal} itens</span>
        </div>

        {itens.length === 0 ? (
          <p className="mt-5 rounded-2xl border-2 border-dashed border-[#CFC9C1] p-7 text-center font-semibold text-[#5C5853]">
            Seu carrinho está vazio.
          </p>
        ) : (
          <>
            <ul className="mt-4 flex flex-col gap-2.5">
              {itens.map(({ produto, qtd }) => (
                <li key={produto.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5">
                  <span className="h-12 w-12 flex-none rounded-xl" style={{ background: produto.cor }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold">{produto.nome}</span>
                    <span className="text-[13px] font-bold text-[#5C5853]">{brl(produto.preco * qtd)}</span>
                  </span>
                  <button type="button" aria-label="Diminuir" onClick={() => mudar(produto.id, -1)} className="h-9 w-9 rounded-full border border-[#CFC9C1]">−</button>
                  <span className="min-w-4 text-center font-extrabold">{qtd}</span>
                  <button type="button" aria-label="Aumentar" onClick={() => mudar(produto.id, 1)} className="h-9 w-9 rounded-full bg-ink text-cream">+</button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm font-extrabold">Como quer receber?</p>
            <div role="radiogroup" aria-label="Entrega" className="mt-2 flex flex-col gap-2">
              {[
                { id: "retirada" as const, nome: "Retirar com a Jaque", desc: "Grátis, na academia" },
                { id: "casa" as const, nome: "Receber em casa", desc: "Frete combinado pelo WhatsApp" },
              ].map((e) => (
                <button
                  key={e.id}
                  type="button"
                  role="radio"
                  aria-checked={entrega === e.id}
                  onClick={() => setEntrega(e.id)}
                  className={`rounded-2xl border-2 bg-white p-3 text-left ${entrega === e.id ? "border-ink" : "border-[#DDD8D1]"}`}
                >
                  <span className="block text-sm font-extrabold">{e.nome}</span>
                  <span className="block text-xs font-semibold text-[#5C5853]">{e.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-[#D6D0C8] pt-3.5">
              <span className="font-bold">Total</span>
              <span className="font-display text-3xl">{brl(total)}</span>
            </div>
            <button type="button" className="mt-3 h-14 w-full rounded-full bg-ink font-extrabold text-cream">
              Finalizar compra
            </button>
          </>
        )}
      </aside>
    </div>
  );
}
