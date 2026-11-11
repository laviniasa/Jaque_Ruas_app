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

## Pagamento: InfinitePay

O pagamento principal é pela **InfinitePay** (link de pagamento, Pix e cartão):

- a Jaque recebe **à vista**;
- se a aluna parcelar (até 12x), **os juros ficam com a aluna** (`assured_installments: 0`);
- o personal aparece no site como "Pix ou cartão à vista". A InfinitePay não permite travar o número de parcelas, mas como os juros ficam com a aluna, a Jaque recebe o valor cheio de qualquer jeito;
- o aviso da InfinitePay não tem assinatura. Por isso o site **sempre confere o pagamento** em `/payment_check` antes de liberar, e o endereço do aviso leva uma senha (`INFINITEPAY_WEBHOOK_TOKEN`);
- a InfinitePay não tem ambiente de teste: teste com um plano de R$1 e estorne pelo app.

| Arquivo | O que faz |
| --- | --- |
| `src/lib/infinitepay.ts` | Cria o link de pagamento e confere o pagamento |
| `src/app/api/webhooks/infinitepay/route.ts` | Recebe o aviso de pagamento |
| `src/app/(site)/checkout/obrigada/page.tsx` | Também confere o pagamento quando a aluna volta da InfinitePay |

O Mercado Pago continua no código como alternativa: ele só é usado se as variáveis da InfinitePay estiverem vazias.

## Como funciona a compra de um plano

1. A aluna escolhe o plano no site, preenche os dados e clica em **Pagar com Pix ou cartão**.
2. O site guarda os dados na tabela `compras` e abre a tela de pagamento do Mercado Pago.
3. Quando o pagamento é aprovado, o Mercado Pago avisa o site (`/api/webhooks/mercadopago`), e o sistema faz tudo sozinho:
   - cria a conta da aluna (só na primeira compra);
   - libera o plano no app (tabela `assinaturas`, com data de vencimento);
   - manda o e-mail de boas-vindas com o botão **Criar minha senha**.
4. A aluna clica no botão, cria a própria senha em `/app/criar-senha` e já entra no app.

A senha **nunca** vai escrita no e-mail. Se o link vencer, a aluna pede outro na tela de entrada do app ("Esqueci ou ainda não criei minha senha"). Se ela já for aluna e comprar de novo, o plano é renovado e os dias que faltavam não se perdem.

| Arquivo | O que faz |
| --- | --- |
| `src/app/api/checkout/route.ts` | Confere os dados (inclusive CPF), pega o preço do banco e cria a cobrança |
| `src/app/api/webhooks/mercadopago/route.ts` | Recebe o aviso do Mercado Pago e confere o pagamento direto na API |
| `src/lib/liberarPlano.ts` | Cria a conta, libera o plano e marca a compra como paga |
| `src/app/auth/confirm/route.ts` | Confere o link do e-mail e deixa a aluna logada |
| `src/middleware.ts` | Protege o app (só aluna logada) e o painel (só a Jaque) |
| `supabase/emails/` | Modelos de e-mail com a marca da Jaque |

### Antifraude

A análise de risco do cartão é do Mercado Pago. O site ajuda essa análise e coloca travas extras:

- **Dados completos na cobrança:** nome, sobrenome, CPF, telefone, descrição e categoria do item.
- **Device ID:** o script `security.js` do Mercado Pago identifica o aparelho e é enviado no cabeçalho `X-meli-session-id`.
- **Limite de tentativas:** 6 por IP a cada 10 minutos e 4 por e-mail por hora.
- **Armadilha para robôs:** campo escondido no formulário. Se for preenchido, a compra é recusada.
- **Validações:** CPF válido, e-mail descartável recusado, preço sempre vindo do banco.
- **Webhook seguro:** assinatura secreta conferida e pagamento consultado direto na API.
- **Estorno e chargeback:** o acesso da aluna é bloqueado sozinho.
- **Registro:** IP, navegador e Device ID ficam guardados na compra, para defesa em contestações.
- **Validade:** a cobrança vence em 30 minutos.

### Configurar o pagamento e os e-mails

1. **Mercado Pago:** em [Suas integrações](https://www.mercadopago.com.br/developers/panel/app), crie uma aplicação (Checkout Pro). Copie o *Access Token* para `MERCADOPAGO_ACCESS_TOKEN`. Em **Webhooks**, cadastre `https://SEU-SITE/api/webhooks/mercadopago` com o evento **Pagamentos** e copie a assinatura secreta para `MERCADOPAGO_WEBHOOK_SECRET`. Teste primeiro com as credenciais de teste.
2. **Supabase > Authentication > URL Configuration:** em *Site URL*, coloque o endereço do site. Em *Redirect URLs*, adicione `https://SEU-SITE/**`.
3. **Supabase > Authentication > Emails:** cole `supabase/emails/convite.html` no modelo **Invite user** e `supabase/emails/redefinir-senha.html` no **Reset password** (o assunto sugerido está na primeira linha de cada arquivo).
4. **E-mail de verdade (SMTP):** o envio padrão do Supabase só serve para testes (manda poucos e-mails por hora). Para as alunas, crie uma conta grátis no [Resend](https://resend.com), confirme o domínio e preencha em **Authentication > Emails > SMTP Settings**.
5. Copie `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API > service_role) para o servidor. Essa chave nunca vai para o navegador.

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
- [x] Login da aluna e proteção do `/app` e do `/admin`
- [x] Pagamento com Mercado Pago (Pix e cartão) + webhook que cria a conta, libera o plano e manda o e-mail "Criar minha senha"
- [ ] Cobrança recorrente automática no cartão (assinatura do Mercado Pago)
- [ ] Painel: lista de compras e alunas novas
- [ ] App: mostrar o plano e a data de vencimento reais da aluna
- [ ] Painel: editar planos e produtos, avançar pedidos, liberar alunas
- [ ] Treinos da aluna com vídeos e feedback
- [ ] Fotos reais da Jaque e dos produtos
