import Link from "next/link";
import { planos, produtos } from "@/lib/data";

export default function AdminInicio() {
  const cards = [
    { label: "Planos à venda", valor: planos.filter((p) => p.ativo).length, href: "/admin/planos" },
    { label: "Produtos na loja", valor: produtos.filter((p) => p.ativo).length, href: "/admin/produtos" },
    { label: "Estoque baixo", valor: produtos.filter((p) => p.estoque <= 2).length, href: "/admin/produtos" },
  ];

  return (
    <>
      <p className="text-sm font-semibold text-[#6B6B76]">Olá, Jaque</p>
      <h1 className="text-3xl font-extrabold tracking-tight">Visão geral</h1>
      <div className="mt-6 grid gap-3.5 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-[#E6E6EB] bg-white p-5">
            <span className="block text-sm font-bold text-[#6B6B76]">{c.label}</span>
            <span className="mt-2 block text-3xl font-extrabold">{c.valor}</span>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-[#6B6B76]">
        Vendas, pedidos e alunas aparecem aqui quando o banco de dados e os pagamentos forem conectados.
      </p>
    </>
  );
}
