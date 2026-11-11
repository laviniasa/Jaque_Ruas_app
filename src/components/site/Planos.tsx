"use client";

import Link from "next/link";
import { useState } from "react";
import { planos, regraReposicao, type CategoriaPlano } from "@/lib/data";
import { brl } from "@/lib/format";

/** Escolha do tipo de treino e do plano, com botão para o checkout */
export function Planos() {
  const [categoria, setCategoria] = useState<CategoriaPlano>("personal");
  const lista = planos.filter((p) => p.ativo && p.categoria === categoria);
  const [escolhido, setEscolhido] = useState<string>("p3");
  const selecionado = lista.find((p) => p.id === escolhido) ?? lista[0];

  function trocarCategoria(c: CategoriaPlano) {
    setCategoria(c);
    const primeiro = planos.find((p) => p.ativo && p.categoria === c && p.selo === "Mais escolhido");
    setEscolhido(primeiro?.id ?? "");
  }

  const opcoes: { id: CategoriaPlano; titulo: string; texto: string }[] = [
    { id: "personal", titulo: "Personal presencial", texto: "Aulas com a Jaque, 2 a 4 vezes por semana" },
    { id: "online", titulo: "Treino online", texto: "Planilha pronta no app, treine onde quiser" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3 className="mb-4 text-xl font-extrabold">1. Como você quer treinar?</h3>
        <div role="group" aria-label="Tipo de treino" className="grid gap-3 sm:grid-cols-2">
          {opcoes.map((o) => {
            const ativo = categoria === o.id;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => trocarCategoria(o.id)}
                className={`jr-reveal rounded-3xl border-2 p-5 text-left transition-[translate] hover:-translate-y-1 ${
                  ativo ? "border-pink bg-pink text-ink" : "border-[var(--line)] bg-[var(--card)]"
                }`}
              >
                <span className="block font-display text-3xl uppercase leading-none">{o.titulo}</span>
                <span className="mt-2 block text-sm font-semibold opacity-85">{o.texto}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-extrabold">2. Escolha seu plano</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {lista.map((p) => {
            const ativo = selecionado?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setEscolhido(p.id)}
                className={`jr-reveal relative flex min-h-36 flex-col gap-1 rounded-2xl border-2 p-5 text-left ${
                  ativo ? "border-lime bg-lime text-ink" : "border-[var(--line)]"
                }`}
              >
                {p.selo && (
                  <span className="absolute -top-3 left-4 rounded-full bg-pink px-2.5 py-1 text-[11px] font-extrabold text-ink">
                    {p.selo}
                  </span>
                )}
                <span className="text-[15px] font-extrabold">{p.nome}</span>
                <span className="mt-1 font-display text-3xl">{brl(p.preco)}</span>
                <span className="text-[13px] font-semibold opacity-80">
                  {p.descricao} · {p.periodo}
                </span>
              </button>
            );
          })}
        </div>

        {categoria === "personal" && (
          <p className="mt-4 rounded-2xl border border-dashed border-[var(--line2)] bg-[var(--card)] p-4 text-sm text-[var(--text2)]">
            <strong className="text-[var(--text)]">Reposição de aulas:</strong> {regraReposicao}
          </p>
        )}
      </div>

      {selecionado && (
        <Link
          href={`/checkout?plano=${selecionado.id}`}
          className="jr-pulse inline-flex h-16 items-center justify-center gap-3 self-start rounded-full bg-pink px-8 text-lg font-extrabold text-ink"
        >
          Quero o plano {selecionado.nome.toLowerCase()} · {brl(selecionado.preco)}
        </Link>
      )}
    </div>
  );
}
