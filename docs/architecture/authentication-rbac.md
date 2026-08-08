# Autenticação, autorização e SSO

## Decisão arquitetural

O TutorIA Fisio usa OpenID Connect (OIDC) com Authorization Code + PKCE. O núcleo recebe identidade validada por `issuer`, `audience`, assinatura JWKS, validade e `subject`; não aceita papel ou `tenantId` enviados pelo navegador. A associação ativa no banco resolve instituição e papel.

O contrato `IdentityProvider` mantém o sistema independente do fornecedor e preparado para SSO institucional (Microsoft Entra ID, Google Workspace ou provedor compatível). Cada instituição pode configurar seu provedor após verificação de domínio e aprovação administrativa auditada.

## Papéis e menor privilégio

| Papel | Acesso inicial |
|---|---|
| Estudante | tutor, currículo publicado e progresso próprio |
| Professor | recursos do estudante + gestão curricular e leitura dos alunos das disciplinas autorizadas |
| Coordenação | professor + relatórios e gestão de associações acadêmicas |
| Administrador | coordenação + configuração do tenant, SSO e revogação de sessões |

Permissões são verificadas no servidor e sempre combinadas com o tenant ativo. O papel sozinho não concede acesso a outra instituição, curso, turma ou disciplina.

## Sessões e revogação

- cookies `HttpOnly`, `Secure` e `SameSite=Lax`; rotação após login e elevação de privilégio;
- sessão curta com expiração absoluta e inatividade; refresh token rotativo armazenado cifrado ou apenas no provedor;
- logout e revogação administrativa invalidam a sessão no servidor imediatamente;
- mudança de papel, suspensão da associação, usuário ou tenant revoga todas as sessões afetadas;
- tokens nunca são registrados em logs e respostas de falha são neutras.

## Auditoria e operação

Alterações de papéis, configuração de SSO e revogações geram eventos append-only com ator, tenant, alvo, horário e `correlationId`, sem tokens ou dados pedagógicos. Alertas cobrem falhas repetidas, reutilização de refresh token, elevação de privilégio e acessos entre tenants.

## Próxima integração

Na camada web, um adaptador OIDC executará descoberta, PKCE, callback e validação criptográfica por biblioteca madura. Persistência deverá guardar associações e sessões com `tenant_id`; testes de integração devem cobrir logout, rotação, suspensão, alteração de papel e SSO de múltiplas instituições.
