# Relatórios OPAC – protótipo estático

Interface estática para gestão de relatórios de visita OPAC baseada em schemas dinâmicos.

## Pré-requisitos

- Navegador moderno (suporte a módulos ES, `fetch`, `structuredClone` ou JSON fallback).
- Servir o diretório em um servidor HTTP estático (recomendado: `npx serve`, `python -m http.server`, ou GitHub Pages). Abrir direto com `file://` pode bloquear requisições `fetch`.

## Como usar

1. Servir o projeto a partir da raiz:
   ```bash
   npx serve .
   # ou
   python -m http.server
   ```
2. Abrir `http://localhost:3000` (ou porta equivalente) no navegador.
3. Clique em **Novo relatório** e escolha o tipo (numérico ou digitando o `typeId` definido em `schemas/manifest.json`).
4. Preencha os campos gerados a partir do schema (os módulos são renderizados dinamicamente).
5. Use **Salvar rascunho** para persistir os dados no `localStorage`.
6. Exportar/Importar JSON está disponível para backup e reuso. (Importação de PDF ainda não implementada.)
7. Utilize os filtros à esquerda para buscar e filtrar relatórios por tipo ou status de conformidade.

## Estrutura

- `index.html`, `assets/app.js`, `assets/style.css`: interface, renderização e lógica de carregamento dos schemas.
- `schemas/manifest.json`: manifesto de relatórios (módulos, templates, requiredFields).
- `pmo/manifest.json`: manifesto dos PMOs (estrutura normalizada `{metadata, dados}`).
- `docs/implementation-plan.md`: plano de implementação completo.

## Fluxos implementados

- Carregamento dinâmico dos manifestos (`schemas` e `pmo`).
- Painel de cards com filtros, duplicação, exportação e exclusão.
- Timeline com referências (pmo + rascunho atual).
- Form builder genérico baseado em `dataTemplate` e `moduleGraph` (suporte a objetos, listas, tipos primitivos).
- Persistência local (`localStorage`) com indicadores de alteração.

## Limitações atuais

- Geração/anexação de PDF ainda não implementada (botão apresenta alerta).
- Importação de PDF e migrações automáticas dependerão de integração futura com `pdf-lib`/`pdf.js`.
- Validações avançadas (`visibleWhen`, regras condicionais) não foram incluídas.
- Highlight contextual com PMO/relatório anterior ainda está em planejamento.

## Próximos passos sugeridos

1. Integrar `html2pdf.js` + `pdf-lib` para produção de PDF com anexo `relatorio.json`.
2. Implementar importação de PDF e execução das migrações registradas.
3. Adicionar validações (`requiredFields`, enums, condicionais) e highlight contextual usando mapeamentos de referência.
4. Expandir timeline para comparar PMO × última visita e apresentar pendências herdadas.
5. Automatizar testes (unitários e e2e) e definir workflow de deploy (GitHub Actions → GitHub Pages).

