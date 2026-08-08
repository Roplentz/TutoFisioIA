# Modelo de ameaças inicial

## Ativos críticos

Dados de identidade, progresso e avaliações; materiais docentes; prompts/políticas; registros de auditoria; credenciais e chaves de provedores.

## Ameaças prioritárias

- acesso entre instituições, turmas ou estudantes;
- prompt injection em perguntas e documentos;
- uso de fonte não aprovada ou aposentada;
- citação inexistente ou que não sustenta a resposta;
- orientação clínica individual indevida;
- vazamento de dados em logs ou provedores de IA;
- alteração não auditada de conteúdo ou política pedagógica.

## Controles mínimos

RBAC e isolamento por tenant; filtros de autorização em todas as consultas; aprovação humana antes da indexação; validação de citações; redaction de PII; secrets fora do código; logs estruturados; trilha de auditoria imutável; testes de injeção e isolamento; revisão humana para decisões de alto impacto.

## Gate do piloto

100% dos testes de isolamento aprovados e zero falha crítica conhecida de exposição de dados ou orientação clínica perigosa.
