# Relatorios OPAC - prototipo estatico

Interface estatica para gestao de relatorios de visita OPAC baseada em schemas dinamicos.

## Pre-requisitos

- Navegador moderno (suporte a modulos ES, `fetch`, `structuredClone` ou JSON fallback).
- Servir o diretorio em um servidor HTTP estatico (ex.: `npx serve`, `python -m http.server`, GitHub Pages). Abrir direto com `file://` pode bloquear requisicoes `fetch`.

## Como usar

1. Servir o projeto a partir da raiz:
   ```bash
   npx serve .
   # ou
   python -m http.server
   ```
2. Abrir `http://localhost:3000` (ou porta equivalente) no navegador.
3. O painel principal lista todos os relatorios como cards. Use busca e filtros compactos no topo.
4. Clique em **Novo relatorio** e escolha o tipo no modal. Voce sera redirecionado para a pagina de formulario (`form.html?id=...`) para preencher os dados.
5. No formulario use as acoes do topo (menu ou botoes inline) para salvar rascunho, exportar JSON, gerar PDF (quando implementado) ou excluir.
6. Importar JSON esta disponivel no menu superior do painel. O relatorio importado abre direto no formulario para edicao.

## Estrutura

- `index.html`: painel de cards (listagem e filtros).
- `form.html`: pagina de edicao do relatorio.
- `assets/app.js`: logica compartilhada (armazenamento, renderizacao, eventos).
- `assets/style.css`: estilos globais, menu responsivo e preparo para impressao/PDF.
- `schemas/manifest.json`: manifesto de relatorios (modulos, templates, requiredFields).
- `pmo/manifest.json`: manifesto dos PMOs (estrutura `{metadata, dados}`).
- `docs/implementation-plan.md`: plano de implementacao completo.

## Fluxos implementados

- Carregamento dinamico dos manifestos (`schemas` e `pmo`).
- Painel de cards com filtros, duplicacao, exportacao e exclusao.
- Form builder generico baseado em `dataTemplate` e `moduleGraph` (objetos, listas, tipos primitivos).
- Persistencia local (`localStorage`) com indicadores de alteracao.

## Limitacoes atuais

- Geracao/anexacao de PDF ainda nao implementada (acao mostra alerta).
- Importacao de PDF e migracoes automaticas dependerao de integracao futura com `pdf-lib`/`pdf.js`.
- Validacoes avancadas (`visibleWhen`, regras condicionais) nao foram incluidas.
- Destacando contextual com PMO/relatorio anterior ainda esta em planejamento.

## Proximos passos sugeridos

1. Integrar `html2pdf.js` + `pdf-lib` para producao de PDF com anexo `relatorio.json`.
2. Implementar importacao de PDF e execucao das migracoes registradas.
3. Adicionar validacoes (`requiredFields`, enums, condicionais) e highlight contextual usando mapeamentos de referencia.
4. Expandir painel para comparar PMO a ultima visita e apresentar pendencias herdadas.
5. Automatizar testes (unitarios e e2e) e definir workflow de deploy (GitHub Actions e GitHub Pages).

## Backlog de UX (futuro)

### Formularios
- Validar se o grid em duas colunas atende modulos com muitos campos curtos; considerar terceira coluna acima de 1440px.
- Adicionar legendas ou dicas contextuais para campos criticos a partir do feedback dos verificadores.
- Mapear campos obrigatorios para destacar pendencias e facilitar navegacao longa.

### Modais e toasts
- Implementar atalhos explicitos (Enter/Escape) e ciclo de foco para acessibilidade total.
- Suportar modais encadeados (ex.: duplicar relatorio e confirmar pendencias).
- Adicionar variante de toast persistente para erros bloqueantes ou acoes demoradas.

### Layout para PDF
- Gerar relatorio de teste com dados reais e ajustar margens/quebras pagina a pagina.
- Incluir cabecalho/rodape com metadados (unidade, verificador, data) quando em impressao.
- Avaliar fonte alternativa para campos extensos (ex.: monoespacada para codigos/IDs).
