# PDF Master Extraction - Orquestrador de Extração de PMO/ANC

## Objetivo

Este prompt coordena a extração completa de dados de formulários PMO (Plano de Manejo Orgânico) e cadastros ANC, detectando automaticamente quais anexos estão presentes no PDF e orquestrando a chamada dos prompts modulares específicos.

## Como Usar

### Modo Automático (Extração Completa)

1. **Análise Inicial do PDF**
   - Identifique o tipo de documento (PMO Completo, Cadastro, Anexo Individual)
   - Detecte quais anexos estão presentes no documento
   - Verifique o escopo de certificação ("Produção", "Processamento", "Produção + Processamento")

2. **Carregue as Regras Comuns**
   - **SEMPRE** carregue `pdf-extraction-rules-common.md` antes de qualquer extração
   - Este arquivo contém as regras de formatação, nomenclatura e validação compartilhadas

3. **Ordem de Execução**

   **SEMPRE execute nesta ordem:**

   a) **Cadastro Geral** (obrigatório)
   - Carregue: `pdf-extraction-cadastro-geral.md`
   - Extraia: metadata, certificacao, dados_gerais, responsaveis_producao
   - Gere: `id_produtor`, detecte `tipo_pessoa`

   b) **Anexos de Produção** (se detectados)
   - `pdf-extraction-anexo-vegetal.md` → se encontrar "ANEXO I" ou "produção vegetal"
   - `pdf-extraction-anexo-cogumelo.md` → se encontrar "ANEXO II" ou "cogumelos"
   - `pdf-extraction-anexo-animal.md` → se encontrar "ANEXO III" ou "pecuária/animais"
   - `pdf-extraction-anexo-apicultura.md` → se encontrar "ANEXO IV" ou "apicultura/mel"

   c) **Anexos de Processamento** (se detectados)
   - `pdf-extraction-anexo-processamento.md` → se encontrar CNPJ ou "agroindústria"
   - `pdf-extraction-anexo-processamento-minimo.md` → se encontrar "processamento mínimo"

4. **Agregação dos JSONs Parciais**
   - Combine todos os JSONs extraídos em um único objeto
   - Mantenha a estrutura do schema `cadastro-geral-pmo.schema.json`
   - Campos não preenchidos devem usar valores padrão conforme `rules-common.md`

5. **Validação Final**
   - Carregue: `pdf-extraction-validacao.md`
   - Execute checklist de validação
   - Corrija inconsistências detectadas
   - Garanta que JSON final é válido

### Modo Manual (Extração Específica)

Para extrair apenas um anexo específico:

1. Carregue `pdf-extraction-rules-common.md`
2. Carregue o prompt específico do anexo desejado
3. Extraia apenas aquela seção
4. Retorne JSON parcial

**Exemplo**: Extrair apenas Anexo Vegetal
```
1. Carregar pdf-extraction-rules-common.md
2. Carregar pdf-extraction-anexo-vegetal.md
3. Extrair seção anexo_vegetal
4. Retornar JSON parcial
```

## Detecção de Anexos

### Identificadores no PDF

| Anexo | Palavras-chave | Prompt a Carregar |
|-------|---------------|-------------------|
| Cadastro Geral | "dados gerais", "identificação do produtor" | `pdf-extraction-cadastro-geral.md` |
| Anexo I - Vegetal | "ANEXO I", "produção vegetal", "culturas" | `pdf-extraction-anexo-vegetal.md` |
| Anexo II - Cogumelo | "ANEXO II", "cogumelos", "shiitake", "substrato" | `pdf-extraction-anexo-cogumelo.md` |
| Anexo III - Animal | "ANEXO III", "pecuária", "animais", "criação" | `pdf-extraction-anexo-animal.md` |
| Anexo IV - Apicultura | "ANEXO IV", "apicultura", "mel", "abelhas" | `pdf-extraction-anexo-apicultura.md` |
| Processamento | "agroindústria", "CNPJ", "processamento", "produtos processados" | `pdf-extraction-anexo-processamento.md` |
| Proc. Mínimo | "processamento mínimo", "higienização", "sanitização" | `pdf-extraction-anexo-processamento-minimo.md` |

### Lógica de Detecção

```
SE encontrar "CNPJ" E "produtos processados":
  → Processamento Industrial

SE encontrar "processamento mínimo" OU "higienização de produtos":
  → Processamento Mínimo

SE encontrar "ANEXO I" OU múltiplas culturas listadas:
  → Anexo Vegetal

SE encontrar "ANEXO II" OU "cogumelos" OU "substrato para cultivo":
  → Anexo Cogumelo

SE encontrar "ANEXO III" OU "espécies criadas" OU "plantel":
  → Anexo Animal

SE encontrar "ANEXO IV" OU "colmeias" OU "floradas":
  → Anexo Apicultura
```

## Regras de Escopo

### Escopo: "Produção"
- ✅ Extrair: Cadastro Geral + Anexos de Produção (I, II, III, IV)
- ❌ NÃO extrair: Anexos de Processamento
- Deixar vazios: `processamento_minimo`, `processamento_industrial`

### Escopo: "Processamento"
- ✅ Extrair: Cadastro Geral + Anexos de Processamento
- ❌ NÃO extrair: Anexos de Produção
- Deixar vazios: `anexo_vegetal`, `anexo_cogumelos`, `anexo_animal`, `anexo_apicultura`

### Escopo: "Produção + Processamento"
- ✅ Extrair: Tudo que estiver presente no documento
- Preencher todas as seções detectadas

## Estrutura do JSON Final

```json
{
  "metadata": { ... },
  "certificacao": { ... },
  "dados_gerais": { ... },
  "responsaveis_producao": [ ... ],
  "atividades_organicas": { ... },
  "historico_culturas": [ ... ],
  "produtos_certificar": [ ... ],
  "preservacao_ambiental": { ... },
  "recursos_hidricos": [ ... ],
  "comercializacao": { ... },
  "controles_registros": [ ... ],
  "producao_subsistencia": { ... },
  "producao_paralela": { ... },

  // Anexos de Produção (se aplicável)
  "anexo_vegetal": { ... } ou {},
  "anexo_cogumelos": { ... } ou {},
  "anexo_animal": { ... } ou {},
  "anexo_apicultura": { ... } ou {},

  // Anexos de Processamento (se aplicável)
  "processamento_minimo": { ... } ou {},
  "processamento_industrial": { ... } ou {}
}
```

## Workflow Completo

```
┌─────────────────────────────────────┐
│   1. Receber PDF                    │
│   2. Analisar documento             │
│   3. Detectar anexos presentes      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Carregar rules-common.md          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Extrair Cadastro Geral            │
│   (sempre obrigatório)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Para cada anexo detectado:        │
│   - Carregar prompt específico      │
│   - Extrair dados                   │
│   - Gerar JSON parcial              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Agregar todos os JSONs            │
│   em estrutura única                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Aplicar validacao.md              │
│   Corrigir inconsistências          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Retornar JSON final completo      │
└─────────────────────────────────────┘
```

## Campos Obrigatórios (Validação Mínima)

Independente dos anexos, **SEMPRE** preencher:

- `metadata.id_produtor` (gerar se não existir)
- `metadata.data_extracao` (data atual em ISO 8601)
- `metadata.tipo_documento` (array com anexos detectados)
- `dados_gerais.identificacao.nome_completo`
- `dados_gerais.identificacao.cpf_cnpj`
- `dados_gerais.contato.telefone`
- `dados_gerais.contato.endereco.municipio`
- `dados_gerais.contato.endereco.uf`

## Tratamento de Erros

### Anexo Mencionado mas Não Preenchido
- Se PDF menciona "ANEXO I" mas não há dados → deixar objeto vazio `{}`
- Adicionar ao `metadata.tipo_documento` mesmo assim

### Dados Incompletos
- Usar valores padrão de `rules-common.md`
- Nunca usar `null`
- Registrar em `metadata.observacoes` se necessário

### Conflitos de Dados
- Priorizar dados mais específicos sobre dados gerais
- Exemplo: data no anexo sobrescreve data no cadastro geral
- Documentar decisão em `metadata.observacoes`

## Referências

- **Schemas**: `/database/schemas/*.schema.json`
- **Regras Comuns**: `pdf-extraction-rules-common.md`
- **Validação**: `pdf-extraction-validacao.md`
- **Prompts Específicos**: `pdf-extraction-[tipo].md`

## Notas Importantes

⚠️ **SEMPRE** carregar `rules-common.md` antes de qualquer extração

⚠️ **SEMPRE** começar pelo Cadastro Geral

⚠️ **SEMPRE** respeitar o escopo de certificação

⚠️ **NUNCA** usar `null` - use valores padrão

⚠️ **SEMPRE** validar JSON final antes de retornar
