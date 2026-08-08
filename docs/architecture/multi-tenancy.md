# Modelo de organizações e isolamento multi-tenant

## Modelo acadêmico

`Institution` é a raiz do tenant e seu `id` é o `tenantId`. Uma instituição possui muitos `Course`; cada curso pertence a exatamente uma instituição e possui muitas `Cohort` (turmas). A turma repete o `tenantId` do curso para tornar o filtro de segurança explícito e indexável.

`Institution (tenant) 1 ── N Course 1 ── N Cohort`

Usuários não são proprietários dos dados: a associação entre usuário, tenant e papel produz um `TenantContext` autenticado. Toda porta de aplicação e repositório acadêmico recebe esse contexto; `tenantId` enviado pelo navegador nunca é confiável.

## Isolamento em profundidade

1. O backend deriva `TenantContext` da sessão e da associação ativa do usuário.
2. Toda entidade acadêmica persistida possui `tenant_id NOT NULL`.
3. Chaves únicas acadêmicas incluem `tenant_id`; relações compostas impedem curso e turma de tenants diferentes.
4. Toda consulta inclui `tenant_id = context.tenantId`; busca por ID isolado é proibida.
5. PostgreSQL Row-Level Security será a segunda barreira, baseada em `app.tenant_id` por transação.
6. Jobs, eventos, cache, objetos e índices vetoriais carregam tenant e usam namespace separado.
7. Acesso cruzado falha com mensagem neutra, sem confirmar que o recurso existe.

## Esquema de referência

```sql
create table institution (id uuid primary key, name text not null, status text not null);
create table course (tenant_id uuid not null references institution(id), id uuid not null, name text not null, primary key (tenant_id, id));
create table cohort (
  tenant_id uuid not null, id uuid not null, course_id uuid not null, name text not null,
  starts_at timestamptz not null, ends_at timestamptz, primary key (tenant_id, id),
  foreign key (tenant_id, course_id) references course(tenant_id, id)
);
```

## Auditoria

Leituras, escritas e recusas registram ação, resultado, ator, tenant, recurso, `correlationId` e horário. O registro não inclui conteúdo pedagógico, prompt, resposta, nome ou e-mail. Eventos são append-only e alertas cobrem recusas repetidas ou qualquer indício de vazamento entre tenants.

## Testes negativos obrigatórios

- tenant ausente ou vazio é recusado;
- professor do tenant A não lê nem grava recurso do tenant B;
- IDs válidos de outro tenant não revelam existência ou metadados;
- turma do tenant A não referencia curso do tenant B;
- cache, busca, exportação, analytics, RAG e jobs não retornam dados de outro tenant;
- troca de tenant exige nova autorização e invalidação de cache;
- tentativa negada deixa auditoria sem dados sensíveis.

Os testes unitários iniciais estão em `packages/contracts/src/tenancy.test.ts`. Testes PostgreSQL/RLS entram com a persistência e repetem os mesmos cenários negativos.
