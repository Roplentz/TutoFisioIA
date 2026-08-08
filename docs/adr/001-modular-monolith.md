# ADR-001 — Monólito modular

- **Status:** aceito
- **Data:** 2026-08-08

## Contexto

O MVP precisa validar aprendizagem, governança de conteúdo e segurança com uma equipe pequena e rápida.

## Decisão

Construir uma aplicação TypeScript modular com Next.js/PWA, API REST versionada e PostgreSQL. Cada domínio terá contratos e ownership próprios dentro do mesmo deploy.

## Consequências

- menor complexidade operacional inicial;
- transações e observabilidade mais simples;
- limites modulares precisam ser revisados para evitar acoplamento;
- módulos críticos poderão ser extraídos quando escala ou isolamento justificarem.
