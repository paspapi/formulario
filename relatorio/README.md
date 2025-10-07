# Relatﾃｳrios OPAC 窶・protﾃｳtipo estﾃ｡tico

Interface estﾃ｡tica para gestﾃ｣o de relatﾃｳrios de visita OPAC baseada em schemas dinﾃ｢micos.

## Prﾃｩ-requisitos

- Navegador moderno (suporte a mﾃｳdulos ES, `fetch`, `structuredClone` ou JSON fallback).
- Servir o diretﾃｳrio em um servidor HTTP estﾃ｡tico (recomendado: `npx serve`, `python -m http.server`, ou GitHub Pages). Abrir direto com `file://` pode bloquear requisiﾃｧﾃｵes `fetch`.

## Como usar

1. Servir o projeto a partir da raiz:
   ```bash
   npx serve .
   # ou
   python -m http.server
   ```
2. Abrir `http://localhost:3000` (ou porta equivalente) no navegador.
3. Clique em **Novo relatório** e selecione o tipo desejado no modal.
4. Preencha os campos gerados a partir do schema (os mﾃｳdulos sﾃ｣o renderizados dinamicamente).
5. Use **Salvar rascunho** para persistir os dados no `localStorage`.
6. Exportar/Importar JSON estﾃ｡ disponﾃｭvel para backup e reuso. (Importaﾃｧﾃ｣o de PDF ainda nﾃ｣o implementada.)
7. Utilize os filtros ﾃ esquerda para buscar e filtrar relatﾃｳrios por tipo ou status de conformidade.

## Estrutura

- `index.html`, `assets/app.js`, `assets/style.css`: interface, renderizaﾃｧﾃ｣o e lﾃｳgica de carregamento dos schemas.
- `schemas/manifest.json`: manifesto de relatﾃｳrios (mﾃｳdulos, templates, requiredFields).
- `pmo/manifest.json`: manifesto dos PMOs (estrutura normalizada `{metadata, dados}`).
- `docs/implementation-plan.md`: plano de implementaﾃｧﾃ｣o completo.

## Fluxos implementados

- Carregamento dinﾃ｢mico dos manifestos (`schemas` e `pmo`).
- Painel de cards com filtros, duplicaﾃｧﾃ｣o, exportaﾃｧﾃ｣o e exclusﾃ｣o.
- Timeline com referﾃｪncias (pmo + rascunho atual).
- Form builder genﾃｩrico baseado em `dataTemplate` e `moduleGraph` (suporte a objetos, listas, tipos primitivos).
- Persistﾃｪncia local (`localStorage`) com indicadores de alteraﾃｧﾃ｣o.

## Limitaﾃｧﾃｵes atuais

- Geraﾃｧﾃ｣o/anexaﾃｧﾃ｣o de PDF ainda nﾃ｣o implementada (botﾃ｣o apresenta alerta).
- Importaﾃｧﾃ｣o de PDF e migraﾃｧﾃｵes automﾃ｡ticas dependerﾃ｣o de integraﾃｧﾃ｣o futura com `pdf-lib`/`pdf.js`.
- Validaﾃｧﾃｵes avanﾃｧadas (`visibleWhen`, regras condicionais) nﾃ｣o foram incluﾃｭdas.
- Highlight contextual com PMO/relatﾃｳrio anterior ainda estﾃ｡ em planejamento.

## Prﾃｳximos passos sugeridos

1. Integrar `html2pdf.js` + `pdf-lib` para produﾃｧﾃ｣o de PDF com anexo `relatorio.json`.
2. Implementar importaﾃｧﾃ｣o de PDF e execuﾃｧﾃ｣o das migraﾃｧﾃｵes registradas.
3. Adicionar validaﾃｧﾃｵes (`requiredFields`, enums, condicionais) e highlight contextual usando mapeamentos de referﾃｪncia.
4. Expandir timeline para comparar PMO à última visita e apresentar pendências herdadas.
5. Automatizar testes (unitários e e2e) e definir workflow de deploy (GitHub Actions e GitHub Pages).

## Backlog de UX (futuro)

### Formulários
- Validar se o grid em duas colunas atende módulos com muitos campos curtos; considerar terceira coluna acima de 1440px.
- Adicionar legendas ou dicas contextuais para campos críticos a partir do feedback dos verificadores.
- Mapear campos obrigatórios para destacar pendências e facilitar navegação longa.

### Modais e toasts
- Implementar atalhos explícitos (Enter/Escape) e ciclo de foco para acessibilidade total.
- Suportar modais encadeados (ex.: duplicar relatório e confirmar pendências).
- Adicionar variante de toast persistente para erros bloqueantes ou ações demoradas.

### Layout para PDF
- Gerar relatório de teste com dados reais e ajustar margens/quebras página a página.
- Incluir cabeçalho/rodapé com metadados (unidade, verificador, data) quando em impressão.
- Avaliar fonte alternativa para campos extensos (ex.: monoespaçada para códigos/IDs).
