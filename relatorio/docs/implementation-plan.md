# Plano de Implementação – Sistema de Relatórios OPAC

## 1. Contexto e Objetivos
- Site estático (GitHub Pages) para gerar, versionar e importar relatórios de visitas OPAC.
- Formular algo 100% schema-driven: formulários, cálculo de preenchimento, geração de PDF com JSON anexado.
- Painel inicial com cards por Unidade de Produção (UP), timeline de referências (PMO, relatórios anteriores, importações).
- Garantir interoperabilidade: os PDFs carregam `relatorio.json` e os PMOs seguem manifesto separado (`pmo/manifest.json`).

## 2. Arquitetura Geral
- **Frontend único** em JavaScript/TypeScript, build estático sem backend.
- Componentes principais:
  - Loader de schemas (`schemas/manifest.json`, `pmo/manifest.json`).
  - Motor de formulários dinâmicos (modules + UI renderer).
  - Painel de cards e timeline de referências.
  - Módulo PDF (html2pdf.js + pdf-lib) com anexo JSON.
  - Importador (pdf.js) para extrair `relatorio.json`.
- Armazenamento local: `localStorage` (ou `IndexedDB` se necessário) para rascunhos, caches de schemas e timeline.

## 3. Gestão de Schemas
- Manifesto `schemas/manifest.json`: tipos de visita (`moduleGraph`, `requiredFields`).
- Manifesto `pmo/manifest.json`: PMO geral + anexos normalizados (`metadata`/`dados`).
- Todo loader deve:
  1. Carregar manifestos e cachear `schemaVersion`.
  2. Baixar `schemaPath` on-demand, validar via `JSON.parse`.
  3. Mesclar `moduleGraph` → `dataTemplate`, gerando formulário em runtime.
- Migrações: `schemas/migrations/relatorio_visita_opac-v1.0.0_to_v1.1.0.json` orienta upgrade do `relatorio.json` no import.

## 4. Frontend – Módulos
1. **Painel de UPs**  
   - Cards com data última visita, conformidade, pendências, preenchimento %, tipo de visita.  
   - Botões: Editar rascunho, Novo relatório, Importar (PDF/JSON), Gerar PDF, Excluir.
   - Timeline lateral (sem abas): PMO vigente, relatórios anteriores, importações extras ordenadas por data.

2. **Form Builder**  
   - Render a partir de `moduleGraph`: seções, campos, condicionais (`visibleWhen`), cálculo do preenchimento (`requiredFields`).  
   - Highlight contextual: foco no campo → scroll/spotlight em timeline com dados equivalentes (`references` do schema).

3. **Pendências & Não Conformidades**  
   - Seção padrão `nao_conformidades_padrao`.  
   - Importar NCs não resolvidas da última visita, registrar verificação na visita atual.

4. **PDF & Importação**  
   - Gerar PDF com seção de impressão; anexar `relatorio.json` (com `schemaId`, `schemaVersion`, `schemaHash`).  
   - Importador extrai JSON do PDF anterior → executa migrações → preenche formulário + timeline.

## 5. Fluxos de Dados
- **Salvar rascunho**: serializar dados + metadados (`schemaVersion`, `tipo`, `updatedAt`) em `localStorage`.  
- **Duplicar**: copiar rascunho/relatório anterior e gerar novo `id`.  
- **Excluir**: remover chaves do storage; confirmar no UI.
- **Exportar JSON** opcional para backup manual.

## 6. Roadmap de Implementação

### Fase 1 – Fundamentos
- Loader de manifestos (visitas + PMO) e cache de schemas.
- Estrutura do painel com cards estáticos e timeline mock (dados do storage).
- Rotina de cálculo de preenchimento e indicadores de conformidade (placeholder).

### Fase 2 – Formulário Dinâmico
- Motor de renderização por `moduleGraph` + `dataTemplate`.
- Validações básicas (`requiredFields`, `visibleWhen`).
- Highlight contextual: mapping `fieldPath` → `references` (com fallback).
- Log `origens[]` para registro dos campos aplicados de PMO/relatório anterior.

### Fase 3 – Pendências e NCs
- CRUD de pendências/NCs com importação da última visita.
- Contadores e indicadores nos cards.
- Regras de conformidade baseadas em respostas + NCs (definidas no schema).

### Fase 4 – PDF e Importação
- Visão de impressão e geração de PDF (`html2pdf.js`) + anexo (`pdf-lib`).
- Importação via `pdf.js`, leitura de `relatorio.json`, aplicação de migrações.
- Exportação/Importação manual de JSON.

### Fase 5 – UX e Persistência
- Timeline com filtros, busca, comparativo (PMO × última visita).  
- `IndexedDB` fallback se volume de dados crescer.  
- Modo offline-first (cache de schemas e assets com Service Worker opcional).

### Fase 6 – Testes e Deploy
- Testes unitários e e2e (Playwright/Cypress) cobrindo:
  - Carregamento de manifestos e migrações.
  - Renderização do formulário e campos condicionais.
  - Geração/importação de PDF e JSON.  
- Deploy automatizado GitHub Actions → GitHub Pages.

## 7. Integração com PMO e Referências
- Mapear `fieldPath` ↔ PMO (`pmo.**`) e relatórios anteriores; guardar planilha de referência para manutenção.
- Destacar no timeline o documento vigente/anterior (botão “definir como vigente”).
- Permitir download do PMO em JSON para auditoria.

## 8. Governança e Documentação
- Documentar o processo de atualização de schemas e manifestos (checklist de versionamento + migração).  
- Manter guia para editores de schema (tipos aceitos, convenções de nomes, exemplos).  
- Incluir changelog semântico (ex.: `docs/schema-changelog.md`) para acompanhar alterações relevantes.

## 9. Considerações Técnicas
- Encoding unificado: todos os arquivos em UTF-8 sem BOM (já normalizado).
- Para novos campos com enums, preferir arrays `enum` ao invés de comentários (`_comentario`).
- Testar transformações com dados reais antes de publicar nova `schemaVersion`.

## 10. Próximos Passos Imediatos
1. Implementar loader de manifestos (visita/PMO) e validação de versões.  
2. Construir protótipo do painel e timeline consumindo manifestos.  
3. Definir mapa `references` nos módulos para suportar highlight contextual.  
4. Especificar regras de conformidade (documento auxiliar ou módulo dedicado).  
5. Montar pipeline de testes + deploy (GitHub Actions) para garantir integridade.

