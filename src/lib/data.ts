/**
 * Dados de exemplo usados enquanto o Supabase não está conectado.
 * Depois, tudo isto passa a vir do banco e é editado no painel (/admin).
 */

export type CategoriaPlano = "personal" | "online";

export type Plano = {
  id: string;
  categoria: CategoriaPlano;
  nome: string;
  descricao: string;
  preco: number;
  periodo: string;
  selo?: string;
  ativo: boolean;
};

export type Produto = {
  id: string;
  nome: string;
  detalhe: string;
  categoria: "Whey" | "Creatina" | "Pré e BCAA" | "Acessórios";
  preco: number;
  estoque: number;
  selo?: string;
  cor: string;
  ativo: boolean;
};

export const planos: Plano[] = [
  { id: "p2", categoria: "personal", nome: "2x por semana", descricao: "8 aulas no mês", preco: 640, periodo: "por mês", selo: "Cabe no bolso", ativo: true },
  { id: "p3", categoria: "personal", nome: "3x por semana", descricao: "12 aulas no mês", preco: 960, periodo: "por mês", selo: "Mais escolhido", ativo: true },
  { id: "p4", categoria: "personal", nome: "4x por semana", descricao: "16 aulas no mês", preco: 1280, periodo: "por mês", selo: "Resultado mais rápido", ativo: true },
  { id: "om", categoria: "online", nome: "Mensal", descricao: "Treino no app por 30 dias", preco: 49.9, periodo: "por mês", ativo: true },
  { id: "oa", categoria: "online", nome: "Anual", descricao: "Treino no app por 12 meses", preco: 297, periodo: "por ano", selo: "Mais escolhido", ativo: true },
  { id: "ov", categoria: "online", nome: "Vitalício", descricao: "Acesso para sempre", preco: 397, periodo: "pagamento único", ativo: true },
];

export const regraReposicao =
  "Aulas desmarcadas são repostas no mesmo mês, no máximo 2 por aluna, devido à alta demanda. Aulas desmarcadas pela Jaque são remarcadas junto com você.";

export const produtos: Produto[] = [
  { id: "whey", nome: "Whey Protein 900g", detalhe: "Baunilha · 30 doses", categoria: "Whey", preco: 149.9, estoque: 12, selo: "Mais vendido", cor: "#FF4D9D", ativo: true },
  { id: "creatina", nome: "Creatina 300g", detalhe: "Pura · 100 doses", categoria: "Creatina", preco: 99.9, estoque: 8, selo: "A Jaque usa", cor: "#D8FF3E", ativo: true },
  { id: "pre", nome: "Pré-treino 300g", detalhe: "Frutas vermelhas", categoria: "Pré e BCAA", preco: 119.9, estoque: 7, cor: "#B66DFF", ativo: true },
  { id: "coqueteleira", nome: "Coqueteleira Jaque", detalhe: "600 ml · rosa neon", categoria: "Acessórios", preco: 39.9, estoque: 25, selo: "Exclusivo", cor: "#F4F1EC", ativo: true },
  { id: "elasticos", nome: "Kit elásticos glúteo", detalhe: "3 intensidades", categoria: "Acessórios", preco: 59.9, estoque: 10, cor: "#FF9FC8", ativo: true },
  { id: "isolado", nome: "Whey Isolado 900g", detalhe: "Chocolate · 30 doses", categoria: "Whey", preco: 199.9, estoque: 5, cor: "#FF7AB6", ativo: true },
];
