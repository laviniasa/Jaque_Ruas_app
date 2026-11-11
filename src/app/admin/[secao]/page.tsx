import { notFound } from "next/navigation";

const secoes: Record<string, { titulo: string; texto: string }> = {
  pedidos: {
    titulo: "Pedidos da loja",
    texto: "Os pedidos aparecem aqui quando a loja estiver ligada ao pagamento. Você avança o status: Pago → Separando → Entregue.",
  },
  alunas: {
    titulo: "Alunas",
    texto: "Lista de alunas com plano, vencimento e botão para liberar ou bloquear o acesso ao app.",
  },
  configuracoes: {
    titulo: "Configurações do site",
    texto: "Links do WhatsApp, do grupo de dicas e do Instagram, aviso de vagas e tema padrão do site.",
  },
};

export default async function SecaoEmBreve({ params }: { params: Promise<{ secao: string }> }) {
  const { secao } = await params;
  const info = secoes[secao];
  if (!info) notFound();

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">{info.titulo}</h1>
      <p className="mt-3 max-w-xl rounded-2xl border border-dashed border-[#CFCFD6] bg-white p-5 text-[#6B6B76]">
        <strong className="text-[#111114]">Em construção.</strong> {info.texto}
      </p>
    </>
  );
}
