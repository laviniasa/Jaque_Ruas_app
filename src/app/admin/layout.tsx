import type { Metadata } from "next";
import Link from "next/link";
import { Silhueta } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

const menu = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/planos", label: "Planos" },
  { href: "/admin/produtos", label: "Loja e produtos" },
  { href: "/admin/pedidos", label: "Pedidos da loja" },
  { href: "/admin/alunas", label: "Alunas" },
  { href: "/admin/configuracoes", label: "Configurações do site" },
];

/**
 * Painel da Jaque.
 * TODO (etapa de login): proteger /admin com o middleware, liberando só o e-mail da Jaque.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="light" className="flex min-h-dvh flex-wrap bg-[#F4F4F6] text-[#111114]">
      <aside className="flex min-w-[220px] max-w-[260px] flex-[1_1_240px] flex-col gap-6 bg-[#111114] px-4 py-6 text-[#F4F4F6]">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <Silhueta cor="#FF4D9D" altura={50} />
          <span className="leading-none">
            <span className="block font-display text-xl uppercase">
              Jaque <span className="text-pink">Ruas</span>
            </span>
            <span className="mt-1 block text-xs font-bold text-[#9C9CA6]">Painel de controle</span>
          </span>
        </Link>
        <nav aria-label="Menu do painel" className="flex flex-col gap-1">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className="flex h-11 items-center rounded-xl px-3.5 text-[15px] font-bold text-[#E4E4EA] hover:bg-[#1E1E23]">
              {m.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="mt-auto flex h-10 items-center justify-center rounded-xl bg-pink font-extrabold text-ink">
          Ver meu site
        </Link>
      </aside>
      <main className="min-w-0 flex-[999_1_640px] px-4 py-7 sm:px-10">{children}</main>
    </div>
  );
}
