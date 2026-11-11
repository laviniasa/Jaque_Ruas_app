"use client";

import { useEffect } from "react";

/** Registra o service worker do app (necessário para instalar como PWA). */
export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/app/sw.js", { scope: "/app" }).catch(() => {
        /* sem PWA, o app continua funcionando no navegador */
      });
    }
  }, []);
  return null;
}
