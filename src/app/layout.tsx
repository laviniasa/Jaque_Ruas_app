import type { Metadata } from "next";
import { Anton, JetBrains_Mono, Manrope } from "next/font/google";
import { SessaoDoLink } from "@/components/SessaoDoLink";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "Jaque Ruas | Personal especialista em glúteos",
    template: "%s | Jaque Ruas",
  },
  description:
    "Personal presencial e treino online com a Jaque Ruas, especialista em glúteos. Planos, loja de suplementos e app de treinos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      suppressHydrationWarning
      className={`${anton.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body>
        <SessaoDoLink />
        {children}
      </body>
    </html>
  );
}
