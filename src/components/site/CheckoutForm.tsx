"use client";

import { useEffect, useState } from "react";

const objetivos = ["Glúteos", "Emagrecer", "Definição", "Saúde"];
const horarios = ["Manhã", "Tarde", "Noite"];

const campo =
  "h-13 rounded-2xl border border-[var(--line2)] bg-[var(--card)] px-4 text-base text-[var(--text)] outline-none focus:border-pink";

/**
 * Formulário de dados da aluna. Envia para /api/checkout, que guarda os dados
 * e devolve o link do Mercado Pago (Pix ou cartão). Quando o pagamento é aprovado,
 * o sistema cria a conta, libera o plano e manda o e-mail "Criar minha senha".
 */
export function CheckoutForm({ planoId, personal }: { planoId: string; personal: boolean }) {
  const [objetivo, setObjetivo] = useState(objetivos[0]);
  const [horario, setHorario] = useState(horarios[0]);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Script de segurança do Mercado Pago: gera o "Device ID" do aparelho da compradora,
  // usado pela análise antifraude deles.
  useEffect(() => {
    if (document.getElementById("mp-security")) return;
    const script = document.createElement("script");
    script.id = "mp-security";
    script.src = "https://www.mercadopago.com/v2/security.js";
    script.setAttribute("view", "checkout");
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const dados = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const resposta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dados,
          planoId,
          objetivo,
          horario: personal ? horario : null,
          deviceId: (window as unknown as { MP_DEVICE_SESSION_ID?: string }).MP_DEVICE_SESSION_ID ?? null,
        }),
      });
      const json = (await resposta.json()) as { url?: string; erro?: string };
      if (!resposta.ok || !json.url) throw new Error(json.erro ?? "Não foi possível iniciar o pagamento.");
      // Vai para a tela de pagamento do Mercado Pago (ou para o sucesso, no modo demonstração).
      window.location.href = json.url;
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível iniciar o pagamento.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold">Seus dados</h2>
      {/* Armadilha para robôs: pessoas não veem este campo; robôs costumam preencher. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Não preencha
          <input name="site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
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

      {erro && (
        <p role="alert" className="rounded-2xl border border-pink px-4 py-3 text-sm font-bold text-pink">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-2 h-14 rounded-full bg-pink text-base font-extrabold text-ink disabled:opacity-60"
      >
        {enviando ? "Abrindo o pagamento..." : "Pagar com Pix ou cartão"}
      </button>
      <p className="text-center text-xs font-semibold text-[var(--muted)]">
        Pagamento seguro pelo Mercado Pago. Assim que for aprovado, você recebe no e-mail o link para criar sua senha do app.
      </p>
    </form>
  );
}
