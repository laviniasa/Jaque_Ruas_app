"use client";

import { useEffect, useState } from "react";

type Tema = "dark" | "light";

/** Botão Claro / Escuro. Guarda a escolha da pessoa no navegador. */
export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>("dark");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("jr-tema");
      if (salvo === "light" || salvo === "dark") aplicar(salvo);
    } catch {
      /* navegação privada: segue no padrão */
    }
  }, []);

  function aplicar(novo: Tema) {
    setTema(novo);
    document.documentElement.dataset.theme = novo;
    try {
      localStorage.setItem("jr-tema", novo);
    } catch {
      /* ignora */
    }
  }

  const base = "flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-extrabold";

  return (
    <div role="group" aria-label="Tema do site" className="flex gap-0.5 rounded-full border border-[var(--line2)] p-1">
      <button
        type="button"
        aria-pressed={tema === "light"}
        onClick={() => aplicar("light")}
        className={`${base} ${tema === "light" ? "bg-[#111] text-white" : "text-[var(--text)]"}`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        Claro
      </button>
      <button
        type="button"
        aria-pressed={tema === "dark"}
        onClick={() => aplicar("dark")}
        className={`${base} ${tema === "dark" ? "bg-pink text-ink" : "text-[var(--text)]"}`}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        Escuro
      </button>
    </div>
  );
}
