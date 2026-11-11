# Jaque Ruas — site, app e painel

Site de vendas, app (PWA) da aluna e painel administrativo da personal trainer **Jaque Ruas**, especialista em glúteos.

| Área | Endereço | O que tem |
| --- | --- | --- |
| Site | `/` | Planos de personal e treino online, checkout, botões de WhatsApp e grupo de dicas, tema claro/escuro |
| Loja | `/loja` | Suplementos e acessórios, carrinho, retirada ou entrega |
| App da aluna (PWA) | `/app` | Login, início da aluna, treinos. O ícone instalado abre **direto aqui**, sem passar pelo site |
| Painel da Jaque | `/admin` | Planos, produtos, pedidos, alunas e configurações do site |

## Tecnologias

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) com as cores da marca (`src/app/globals.css`)
- [Supabase](https://supabase.com): login, banco de dados e fotos
- Mercado Pago: Pix, cartão e assinatura mensal (próxima etapa)
- Hospedagem sugerida: [Vercel](https://vercel.com)

## Como rodar no seu computador

Precisa do [Node.js 20 ou mais novo](https://nodejs.org).

```bash
npm install
cp .env.example .env.local   # depois preencha as chaves
npm run dev
```

Abra http://localhost:3000. Sem as chaves do Supabase, o site funciona em **modo demonstração**, com os dados de `src/lib/data.ts`.

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, cole e rode o arquivo [`supabase/schema.sql`](supabase/schema.sql). Ele cria as tabelas, as regras de segurança e os planos iniciais.
3. Em **Project Settings > API**, copie a *URL* e a *anon key* para o `.env.local`.
4. Crie o login da Jaque em **Authentication > Users** e, na tabela `perfis`, marque `is_admin = true` para ela.

## Publicar na Vercel

1. Em [vercel.com](https://vercel.com), clique em **Add New > Project** e escolha este repositório.
2. Em **Environment Variables**, cole as mesmas variáveis do `.env.local`.
3. Clique em **Deploy**. A cada envio para o GitHub, o site é publicado de novo sozinho.
4. Em **Settings > Domains**, conecte `jaqueruas.com.br`.

## Estrutura

```
src/
├── app/
│   ├── (site)/          → site: página de planos, /loja e /checkout
│   ├── app/             → app da aluna (PWA): login, início, treinos
│   ├── admin/           → painel da Jaque
│   ├── globals.css      → cores, temas claro/escuro e animações
│   └── layout.tsx       → fontes e configurações gerais
├── components/          → logo, botão de tema, header, loja, formulários
└── lib/
    ├── data.ts          → dados de exemplo (planos e produtos)
    ├── format.ts        → formatação de preço e links do WhatsApp
    └── supabase/        → conexão com o banco de dados
public/app/              → manifest, ícones e service worker do PWA
supabase/schema.sql      → tabelas e regras de segurança
```

## Próximas etapas

- [x] Estrutura do site, loja, app e painel com a marca
- [x] Tema claro/escuro e animações ao rolar
- [x] PWA do app (instalável, abre direto no login)
- [x] Banco de dados e regras de segurança (`supabase/schema.sql`)
- [ ] Ler planos e produtos do Supabase em vez de `data.ts`
- [ ] Login da aluna e proteção do `/app` e do `/admin`
- [ ] Pagamento com Mercado Pago (Pix, cartão e assinatura) + webhook que libera o plano
- [ ] Painel: editar planos e produtos, avançar pedidos, liberar alunas
- [ ] Treinos da aluna com vídeos e feedback
- [ ] Fotos reais da Jaque e dos produtos
