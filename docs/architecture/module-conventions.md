# Convenções, contratos e ownership

## Regra central

Cada módulo de domínio controla seus dados e expõe comportamento por contratos TypeScript explícitos. Importações diretas de implementações internas entre módulos são proibidas; integrações síncronas usam interfaces públicas e integrações assíncronas usam `DomainEvent`.

## Estrutura padrão

```text
src/modules/<module>/
  application/   casos de uso e portas
  domain/        entidades, regras e eventos
  infrastructure/adaptadores externos
  public.ts      única superfície importável por outros módulos
```

## Contratos obrigatórios

- toda operação recebe `tenantId` no contexto autenticado;
- eventos carregam `id`, `occurredAt`, `tenantId` e `correlationId`;
- contratos não expõem tipos de ORM, SDK de LLM ou detalhes de infraestrutura;
- mudanças incompatíveis exigem ADR e versão de API;
- dados sensíveis nunca aparecem em logs ou payloads analíticos.

## Ownership inicial

| Área | Responsável | Revisão obrigatória |
|---|---|---|
| Produto e pedagogia | Rodrigo Plentz | Mudança de comportamento do tutor |
| Arquitetura e contratos | Rodrigo Plentz | Limites de módulos, APIs e eventos |
| IA, RAG e segurança | Rodrigo Plentz | Fontes, guardrails e provedores |
| Dados e analytics | Rodrigo Plentz | Esquema, retenção e métricas |

O `CODEOWNERS` automatiza a solicitação de revisão. A matriz será ampliada quando novos mantenedores entrarem.
