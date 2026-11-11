import { planos } from "@/lib/data";
import { brl } from "@/lib/format";

/** TODO: tornar editável (preço, descrição, selo, mostrar/esconder) gravando no Supabase. */
export default function AdminPlanos() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Planos à venda</h1>
      <p className="mt-1 text-[#6B6B76]">Planos desligados somem da página de vendas.</p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {planos.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-[#E6E6EB] bg-white px-5 py-4">
            <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${p.categoria === "personal" ? "bg-[#FFE0EE]" : "bg-[#EEFFC2]"}`}>
              {p.categoria === "personal" ? "Personal" : "Online"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">{p.nome}</span>
              <span className="text-sm text-[#6B6B76]">{p.descricao}{p.selo ? ` · selo "${p.selo}"` : ""}</span>
            </span>
            <span className="text-lg font-extrabold">{brl(p.preco)}</span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${p.ativo ? "bg-[#E8F5EC] text-[#1E7A46]" : "bg-[#F0F0F3] text-[#6B6B76]"}`}>
              {p.ativo ? "No site" : "Escondido"}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
