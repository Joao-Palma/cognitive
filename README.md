# Estudo LEIC

App de planeamento de estudo para a LEIC (Técnico). Indicas a data do exame e até que matéria sai. A app usa o
programa da cadeira (importado do Fénix) e o teu calendário para dizer **quando começar a estudar** e **o que
estudar em cada dia**. Vários testes na mesma semana são conciliados num único plano.

## Arranque

```bash
npm install
cp .env.example .env
npm run db:setup           # arranca o Postgres (Docker), aplica migrações e insere Álgebra Linear
npm run scrape             # opcional: importa as restantes cadeiras da LEIC-A/T (API do Fénix)
npm run dev                # http://localhost:3100
```

Para entrar, basta o email em `/login`, sem verificação. Fica ativo em dev, e em produção só com `ALLOW_EMAIL_ONLY_LOGIN=true`.

## Comandos

| Comando | O quê |
|---|---|
| `npm test` | Testes do núcleo (planner, recorrências, disponibilidade, scheduler, parser) |
| `npm run db:setup` | `docker compose up -d`, migrações e seed (Álgebra Linear) |
| `npm run db:seed` | Só o seed. Também corre sozinho em `prisma migrate dev` (BD nova) e `prisma migrate reset` |
| `npm run scrape` | Importa/atualiza cadeiras do Fénix (`-- --fresh` ignora a cache) |
| `npm run db:studio` | Inspecionar a BD |

## Como o plano é calculado (determinístico)

1. **Horas por tópico** = `ECTS × 28 h × 0,15`, repartidas por `peso × dificuldade`. Junta-se um bloco de revisão de max(2 h, 15%).
2. **Capacidade diária** = `min(horas/dia, tempo livre na janela de estudo)`. O tempo livre já desconta os eventos do calendário (aulas recorrentes incluídas) e os próprios exames.
3. **Agendamento** de trás para a frente, a partir do último exame. Em cada dia, a prioridade vai para o exame mais próximo, por isso a véspera de cada teste fica para essa cadeira.
4. Se não couber, o plano é comprimido até ao tempo livre total (`compressed`). Se mesmo assim não couber, fica `infeasible` e a app indica as horas em falta.
5. As tarefas já feitas nunca se movem. Qualquer alteração a exames, eventos ou definições gera um replan imediato.

Código: `src/lib/{planner,availability,events,scheduler,replan}.ts`.

## Guias de estudo interativos

Para **Álgebra Linear** há 21 guias, um por tópico do programa. Estão em `src/guides/al/` e cada um tem resumo, definições e teoremas, um laboratório interativo, exemplo resolvido, exercícios com solução e erros comuns. Há 18 laboratórios, entre eles:

- eliminação de Gauss passo a passo e transformações do plano;
- vetores próprios, cadeias de Markov e PageRank;
- Gram-Schmidt, mínimos quadrados e SVD;
- formas quadráticas.

O código está em `src/guides/widgets/`. A aritmética exata (frações) e a álgebra 2×2 estão em `src/guides/math/` e têm testes. A notação segue a usada no IST e nos [resumos da LEIC](https://resumos.leic.pt); o texto e os exemplos são originais.

Para acrescentar uma cadeira:

1. Escreve os componentes em `src/guides/<sigla>/`.
2. Regista-os em `src/guides/GuideRenderer.tsx`.
3. Adiciona as ordens dos tópicos a `src/guides/index.ts`.
4. Põe a cadeira e os tópicos em `prisma/seed-data/<sigla>.json`, para entrarem no seed.

O seed falha se houver um guia para um tópico que não exista.

## Premium

`User.isPremium` controla o acesso aos guias por tópico (`/guides/[topicId]`). O 1.º guia de cada cadeira é amostra grátis. Em dev, o premium ativa-se em **Definições**. Os pagamentos (Stripe) ficam para a fase 2.

## Deploy (Vercel + Neon)

1. Na Vercel: **Add New → Project** e importa o repositório do GitHub. A partir daí, cada push para `main` faz deploy.
2. Em **Storage → Create Database → Neon**, liga a base de dados ao projeto. Ficam definidas as variáveis `DATABASE_URL` e `DATABASE_URL_UNPOOLED`.
3. Em **Settings → Environment Variables**:
   - `NEXTAUTH_SECRET` (gera com `openssl rand -base64 32`);
   - `ALLOW_EMAIL_ONLY_LOGIN=true`, para o login demo só com email. Atenção: sem verificação, qualquer pessoa entra com qualquer email.
4. O build (`npm run vercel-build`) aplica as migrações, corre o seed e faz `next build`.

Para importar as restantes cadeiras para produção, corre `DATABASE_URL=<url do Neon> DATABASE_URL_UNPOOLED=<url direta> npm run scrape` a partir da tua máquina.
