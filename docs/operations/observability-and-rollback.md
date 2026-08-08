# Observabilidade e rollback

## Sinais mínimos

- **Disponibilidade:** `GET /api/health`, taxa de sucesso e latência p95;
- **Erros:** exceções agrupadas por release, rota e `correlationId`;
- **RAG/IA:** latência, falha de provedor, recusa, citações válidas e custo por interação;
- **Aprendizagem:** eventos de evidência sem conteúdo clínico identificável.

Logs são JSON estruturado, sem prompts, respostas, nomes, e-mails ou dados clínicos. O `instrumentation.ts` é o ponto único para conectar OpenTelemetry ao coletor escolhido. Alertas iniciais: disponibilidade abaixo de 99%, erro acima de 2% por 5 minutos ou p95 acima de 2 segundos.

## Estratégia de release

1. build imutável identificado pelo SHA do commit;
2. migrações compatíveis com a versão anterior (expand/contract);
3. deploy em preview, smoke test de `/api/health` e fluxo crítico;
4. produção gradual com monitoramento dos sinais mínimos;
5. remoção de estruturas antigas apenas em release posterior.

## Rollback

- reimplantar imediatamente o último artefato saudável pelo SHA;
- desativar funcionalidades novas por feature flag quando possível;
- nunca executar rollback destrutivo de banco: usar correção forward-only;
- registrar incidente, período afetado, decisão e evidências;
- objetivo inicial: restaurar serviço em até 15 minutos.

Rollback é obrigatório quando há exposição de dados, quebra de isolamento entre tenants, indisponibilidade sustentada ou degradação crítica da segurança pedagógica.
