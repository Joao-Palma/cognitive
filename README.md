# Estudo LEIC

App de planeamento de estudo para a LEIC (Técnico). Indicas a data do exame e até que matéria sai. A app usa o
programa da cadeira (importado do Fénix) e o teu calendário para dizer **quando começar a estudar** e **o que
estudar em cada dia**. Vários testes na mesma semana são conciliados num único plano.

## Arranque

```bash
npm install
cp .env.example .env
npx prisma migrate dev     # cria a BD SQLite
npm run scrape             # importa cadeiras e tópicos da LEIC-A/T (API pública do Fénix)
npm run dev                # http://localhost:3100
```

Em desenvolvimento há um login "Dev (só email)" em `/api/auth/signin`.

## Comandos

| Comando | O quê |
|---|---|
| `npm test` | Testes do núcleo (planner, recorrências, disponibilidade, scheduler, parser) |
| `npm run scrape` | Importa/atualiza cadeiras do Fénix (`-- --fresh` ignora a cache) |
| `npm run db:studio` | Inspecionar a BD |

## Como o plano é calculado (determinístico)

1. **Horas por tópico** = `ECTS × 28 h × 0,15`, repartidas por `peso × dificuldade`. Junta-se um bloco de revisão de max(2 h, 15%).
2. **Capacidade diária** = `min(horas/dia, tempo livre na janela de estudo)`. O tempo livre já desconta os eventos do calendário (aulas recorrentes incluídas) e os próprios exames.
3. **Agendamento** de trás para a frente, a partir do último exame. Em cada dia, a prioridade vai para o exame mais próximo, por isso a véspera de cada teste fica para essa cadeira.
4. Se não couber, o plano é comprimido até ao tempo livre total (`compressed`). Se mesmo assim não couber, fica `infeasible` e a app indica as horas em falta.
5. As tarefas já feitas nunca se movem. Qualquer alteração a exames, eventos ou definições gera um replan imediato.

Código: `src/lib/{planner,availability,events,scheduler,replan}.ts`.

## Premium

`User.isPremium` controla o acesso aos guias por tópico (`/guides/[topicId]`). Os pagamentos (Stripe) ficam para a fase 2.
