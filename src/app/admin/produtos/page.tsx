import { produtos } from "@/lib/data";
import { brl } from "@/lib/format";

/** TODO: cadastro e edição de produtos (nome, preço, estoque, selo, foto) no Supabase. */
export default function AdminProdutos() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">Loja e produtos</h1>
      <p className="mt-1 text-[#6B6B76]">Produto sem estoque aparece como &quot;Esgotado&quot; no site.</p>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E6E6EB] bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[#6B6B76]">
            <tr>
              <th className="px-5 py-3.5">Produto</th>
              <th className="px-5 py-3.5">Preço</th>
              <th className="px-5 py-3.5">Estoque</th>
              <th className="px-5 py-3.5">No site</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className="border-t border-[#F0F0F3]">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <span className="h-10 w-10 flex-none rounded-lg" style={{ background: p.cor }} />
                    <span>
                      <span className="block font-extrabold">{p.nome}</span>
                      <span className="text-xs text-[#6B6B76]">{p.categoria}</span>
                    </span>
                  </span>
                </td>
                <td className="px-5 py-3 font-extrabold">{brl(p.preco)}</td>
                <td className={`px-5 py-3 font-extrabold ${p.estoque === 0 ? "text-[#C21E3A]" : p.estoque <= 2 ? "text-[#B45309]" : "text-[#1E7A46]"}`}>
                  {p.estoque === 0 ? "Esgotado" : `${p.estoque} un.`}
                </td>
                <td className="px-5 py-3">{p.ativo ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
