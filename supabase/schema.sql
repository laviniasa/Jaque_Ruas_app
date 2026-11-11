-- =========================================================
-- Banco de dados do projeto Jaque Ruas (Supabase / Postgres)
-- Como usar: Supabase > SQL Editor > cole este arquivo > Run
-- =========================================================

-- Perfis (alunas e a administradora). Ligado ao login do Supabase.
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  whatsapp text,
  cpf text,
  objetivo text,
  horario_preferido text,
  is_admin boolean not null default false,
  criado_em timestamptz not null default now()
);

-- Planos à venda (personal presencial e treino online)
create table if not exists public.planos (
  id text primary key,
  categoria text not null check (categoria in ('personal', 'online')),
  nome text not null,
  descricao text not null default '',
  preco numeric(10, 2) not null check (preco >= 0),
  periodo text not null default 'por mês',
  meses integer, -- null = vitalício
  selo text,
  ativo boolean not null default true,
  ordem integer not null default 0
);

-- Assinaturas: liga a aluna ao plano. Criada pelo webhook do pagamento.
create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  aluna_id uuid not null references public.perfis (id) on delete cascade,
  plano_id text not null references public.planos (id),
  status text not null default 'pendente' check (status in ('pendente', 'ativa', 'vencida', 'cancelada', 'bloqueada')),
  inicio date,
  vence_em date,
  pagamento_ref text, -- id do pagamento/assinatura no Mercado Pago
  criado_em timestamptz not null default now()
);

-- Produtos da loja
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  detalhe text not null default '',
  categoria text not null,
  preco numeric(10, 2) not null check (preco >= 0),
  estoque integer not null default 0 check (estoque >= 0),
  selo text,
  foto_url text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Pedidos da loja
create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  cliente_nome text not null,
  cliente_whatsapp text not null,
  endereco text,
  entrega text not null check (entrega in ('retirada', 'casa')),
  total numeric(10, 2) not null,
  status text not null default 'aguardando_pagamento'
    check (status in ('aguardando_pagamento', 'pago', 'separando', 'entregue', 'cancelado')),
  pagamento_ref text,
  criado_em timestamptz not null default now()
);

create table if not exists public.pedido_itens (
  pedido_id bigint not null references public.pedidos (id) on delete cascade,
  produto_id uuid not null references public.produtos (id),
  quantidade integer not null check (quantidade > 0),
  preco_unitario numeric(10, 2) not null,
  primary key (pedido_id, produto_id)
);

-- Configurações do site (uma linha só)
create table if not exists public.configuracoes (
  id integer primary key default 1 check (id = 1),
  whatsapp text,
  grupo_dicas_url text,
  instagram text,
  vagas_personal integer not null default 0,
  mostrar_vagas boolean not null default true,
  pausar_personal boolean not null default false,
  tema_padrao text not null default 'dark' check (tema_padrao in ('dark', 'light'))
);
insert into public.configuracoes (id) values (1) on conflict do nothing;

-- ---------------------------------------------------------
-- Segurança (RLS): visitante só lê o que está à venda;
-- aluna só vê os próprios dados; admin pode tudo.
-- ---------------------------------------------------------
create or replace function public.eh_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.perfis where id = auth.uid()), false);
$$;

alter table public.perfis enable row level security;
alter table public.planos enable row level security;
alter table public.assinaturas enable row level security;
alter table public.produtos enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_itens enable row level security;
alter table public.configuracoes enable row level security;

create policy "planos ativos são públicos" on public.planos for select using (ativo or public.eh_admin());
create policy "admin edita planos" on public.planos for all using (public.eh_admin()) with check (public.eh_admin());

create policy "produtos ativos são públicos" on public.produtos for select using (ativo or public.eh_admin());
create policy "admin edita produtos" on public.produtos for all using (public.eh_admin()) with check (public.eh_admin());

create policy "configurações são públicas" on public.configuracoes for select using (true);
create policy "admin edita configurações" on public.configuracoes for update using (public.eh_admin());

create policy "aluna vê o próprio perfil" on public.perfis for select using (id = auth.uid() or public.eh_admin());
create policy "aluna edita o próprio perfil" on public.perfis for update using (id = auth.uid()) with check (id = auth.uid() and is_admin = false);
create policy "admin edita perfis" on public.perfis for all using (public.eh_admin()) with check (public.eh_admin());

create policy "aluna vê as próprias assinaturas" on public.assinaturas for select using (aluna_id = auth.uid() or public.eh_admin());
create policy "admin gerencia assinaturas" on public.assinaturas for all using (public.eh_admin()) with check (public.eh_admin());

create policy "admin gerencia pedidos" on public.pedidos for all using (public.eh_admin()) with check (public.eh_admin());
create policy "admin gerencia itens" on public.pedido_itens for all using (public.eh_admin()) with check (public.eh_admin());
-- Pedidos e assinaturas são criados pelo servidor (webhook do pagamento) com a chave de serviço,
-- que ignora o RLS. Nunca coloque essa chave no navegador.

-- ---------------------------------------------------------
-- Dados iniciais (os mesmos do site de demonstração)
-- ---------------------------------------------------------
insert into public.planos (id, categoria, nome, descricao, preco, periodo, meses, selo, ordem) values
  ('p2', 'personal', '2x por semana', '8 aulas no mês', 640, 'por mês', 1, 'Cabe no bolso', 1),
  ('p3', 'personal', '3x por semana', '12 aulas no mês', 960, 'por mês', 1, 'Mais escolhido', 2),
  ('p4', 'personal', '4x por semana', '16 aulas no mês', 1280, 'por mês', 1, 'Resultado mais rápido', 3),
  ('om', 'online', 'Mensal', 'Treino no app por 30 dias', 49.90, 'por mês', 1, null, 4),
  ('oa', 'online', 'Anual', 'Treino no app por 12 meses', 297, 'por ano', 12, 'Mais escolhido', 5),
  ('ov', 'online', 'Vitalício', 'Acesso para sempre', 397, 'pagamento único', null, null, 6)
on conflict (id) do nothing;
