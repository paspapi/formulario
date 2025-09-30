# Anexo I - Producao Vegetal

Formulario para detalhamento de praticas de producao vegetal organica.

## Arquivos

- `index.html` - Formulario principal (13 secoes)
- `vegetal.js` - Logica do formulario e integracao com PMO Principal
- `vegetal-validators.js` - Validacoes especificas

## Importante: Encoding UTF-8

**NOTA**: Os arquivos foram salvos em ASCII (sem acentos) para evitar problemas de encoding no Windows.
Os caracteres especiais sao renderizados corretamente no navegador atraves de entidades HTML.

## Como usar

### 1. Preencher PMO Principal primeiro

Antes de abrir este anexo, **preencha e salve o PMO Principal**.
Os seguintes dados serao carregados automaticamente:
- Nome do fornecedor/produtor
- Nome da unidade de producao
- Data de preenchimento
- Grupo SPG

### 2. Abrir o formulario

Abra `index.html` no navegador. Os dados basicos serao preenchidos automaticamente.

### 3. Preencher as secoes

1. Dados Basicos (carregado automaticamente)
2. Preparo do Solo
3. Praticas Conservacionistas (OBRIGATORIO: selecionar pelo menos 1)
4. Barreiras de Protecao
5. Adubacao e Nutricao
6. Substrato e Ingredientes
7. Receitas Proprias
8. Produtos Comerciais
9. Equipamentos
10. Espacos de Armazenamento
11. Produtos NAO Certificar
12. Declaracoes (todas obrigatorias)
13. Assinatura

### 4. Auto-save

O formulario salva automaticamente a cada 30 segundos em localStorage.

### 5. Validacao

Clique em "Validar Formulario" para verificar erros e avisos antes de finalizar.

### 6. Exportacao

- **JSON**: Backup completo dos dados
- **PDF**: Em desenvolvimento

## Validacoes Criticas

### OBRIGATORIO
- Pelo menos 1 pratica conservacionista
- Descricao detalhada de cada pratica selecionada (min 10 caracteres)
- Sistema de adubacao descrito (min 50 caracteres)
- Todas as 6 declaracoes marcadas
- Espacos de armazenamento SEM produtos proibidos

### Avisos importantes
- Se usa/empresta equipamentos: higienizacao e OBRIGATORIA
- Equipamentos NAO podem ser compartilhados com producao convencional
- Produtos comerciais devem ser certificados para uso organico
- Substrato comprado deve ser aprovado para organicos

## Integracao com PMO Principal

O modulo carrega automaticamente dados do PMO Principal atraves de:

```javascript
localStorage.getItem('pmo_principal_data')
```

Funcao `loadPMOPrincipal()` e chamada automaticamente no `init()`.

## Suporte

Para duvidas ou problemas, consulte:
- `CLAUDE.md` (raiz do projeto)
- `prompt_universal_formulario_pmo.md`
- `INTEGRACAO_PMO_PRINCIPAL.md`

## Legislacao

- Lei 10.831/2003 - Lei de Organicos
- Portaria 52/2021 MAPA - Normas para PMO
- IN 19/2011 - Rastreabilidade

---

**ANC - Associacao de Agricultura Natural de Campinas e Regiao**
Sistema PMO v2.0
