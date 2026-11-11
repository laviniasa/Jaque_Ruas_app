"use client";

import { useState } from "react";

const objetivos = ["Glúteos", "Emagrecer", "Definição", "Saúde"];
const horarios = ["Manhã", "Tarde", "Noite"];

const campo =
  "h-13 rounded-2xl border border-[var(--line2)] bg-[var(--card)] px-4 text-base text-[var(--text)] outline-none focus:border-pink";

/**
 * Formulário de dados da aluna.
 * TODO (etapa de pagamentos): enviar para /api/checkout, que cria a cobrança no
 * Mercado Pago e devolve o link do Pix/cartão. O webhook libera o plano no app.
 */
export function CheckoutForm({ planoId, personal }: { planoId: string; personal: boolean }) {
  const [objetivo, setObjetivo] = useState(objetivos[0]);
  const [horario, setHorario] = useState(horarios[0]);
  const [enviado, setEnviado] = useState(false);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    // Por enquanto só mostra no console. Na próxima etapa vai para o pagamento.
    console.log({ planoId, objetivo, horario: personal ? horario : null, ...dados });
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 text-center">
        <p className="font-display text-4xl uppercase">Quase lá!</p>
        <p className="mt-3 text-[var(--text2)]">
          O pagamento por Pix e cartão entra na próxima etapa do projeto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold">Seus dados</h2>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        Nome completo
        <input name="nome" required autoComplete="name" className={campo} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
        E-mail (seu acesso chega aqui)
        <input name="email" type="email" required autoComplete="email" className={campo} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
          WhatsApp
          <input name="whatsapp" type="tel" required autoComplete="tel" placeholder="(00) 00000-0000" className={campo} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-[var(--text2)]">
          CPF
          <input name="cpf" inputMode="numeric" required placeholder="000.000.000-00" className={campo} />
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-[var(--text2)]">Seu objetivo</legend>
        <div className="flex flex-wrap gap-2">
          {objetivos.map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={objetivo === o}
              onClick={() => setObjetivo(o)}
              className={`h-10 rounded-full border px-4 text-sm font-bold ${
                objetivo === o ? "border-pink bg-pink text-ink" : "border-[var(--line2)]"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </fieldset>

      {personal && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-[var(--text2)]">Melhor horário para as aulas</legend>
          <div className="flex flex-wrap gap-2">
            {horarios.map((h) => (
              <button
                key={h}
                type="button"
                aria-pressed={horario === h}
                onClick={() => setHorario(h)}
                className={`h-10 rounded-full border px-4 text-sm font-bold ${
                  horario === h ? "border-pink bg-pink text-ink" : "border-[var(--line2)]"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <button type="submit" className="mt-2 h-14 rounded-full bg-pink text-base font-extrabold text-ink">
        Continuar para o pagamento
      </button>
    </form>
  );
}
