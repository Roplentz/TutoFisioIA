# TutorIA Fisio

Plataforma de tutoria inteligente baseada em currículo, competências e evidências para a formação em Fisioterapia.

## Visão

O TutorIA Fisio amplia a estratégia pedagógica do professor com orientação personalizada e rastreável. O piloto será realizado na disciplina de **Cinesiologia e Biomecânica**, com foco em aprendizagem ativa, raciocínio e desenvolvimento de competências.

**North Star:** competências desenvolvidas com evidência de aprendizagem.

## Princípios

- professor mantém autoria, controle e responsabilidade;
- apenas fontes aprovadas participam das respostas oficiais;
- toda resposta relevante apresenta fonte, localização, competência e próximo passo;
- o tutor orienta pelo método socrático e não entrega respostas prontas por padrão;
- ausência de evidência gera uma recusa transparente;
- isolamento de dados, auditoria, acessibilidade e segurança são requisitos de produto.

## Escopo do MVP

- login do estudante;
- disciplina e conteúdo estruturado;
- base documental aprovada pelo professor;
- tutor conversacional com citações;
- modo socrático, exercícios e casos simulados;
- avaliação diagnóstica e mapa básico de competências;
- dashboards do estudante e do professor.

Não fazem parte do MVP: LMS completo, aplicativo nativo, prescrição clínica, diagnóstico automático, correção automática oficial, voz, avatar 3D, VR ou microserviços.

## Arquitetura

Monólito modular em TypeScript, com Next.js/PWA, API REST versionada, PostgreSQL + vetores, object storage compatível com S3, autenticação OIDC/OAuth e AI Gateway independente de fornecedor.

Consulte [Visão do produto](docs/product/vision.md), [Arquitetura](docs/architecture/overview.md), [ADR-001](docs/adr/001-modular-monolith.md) e [Roadmap](docs/product/roadmap.md).

## Estrutura

```text
apps/web                    interface web/PWA e API/BFF
packages/                   módulos de domínio
evals/                      avaliações acadêmicas, pedagógicas e de segurança
policies/                   políticas de IA e dados
docs/                       produto, arquitetura, decisões e segurança
```

## Estado

Release 0 — Foundation. A implementação começará após aprovação da arquitetura, ownership, segurança, políticas e critérios de qualidade.

## Propriedade intelectual

Repositório privado. Nenhuma licença de uso ou redistribuição é concedida neste momento.
