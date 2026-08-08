# Web/PWA

Aplicação Next.js/TypeScript do TutorIA Fisio. Nesta fundação ela entrega a página inicial, endpoint operacional `GET /api/health`, instrumentação inicial e os gates de lint, tipos, testes e build.

## Desenvolvimento

Na raiz do monorepo:

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para executar todos os gates localmente, use `npm run check`.

## Limites

Esta entrega prova o bootstrap técnico. Autenticação, currículo, RAG, tutor e dashboards serão implementados nas próximas issues e devem consumir apenas os contratos públicos definidos em `packages/contracts`.
