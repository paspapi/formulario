# 📄 Prompts de Extração PMO

Este diretório contém prompts otimizados para IA extrair dados de PDFs de Plano de Manejo Orgânico (PMO) e converter para JSON.

---

## 📁 Arquivos Disponíveis

### 1. `pdf-extraction-prompt.md` ✅ PRINCIPAL
**Versão:** 2.0.0 (Janeiro 2025)
**Status:** Estável e Recomendado
**Compatível com:** PMO Unified Schema v2.0.0

**Usar para:**
- Extração de PDFs de PMO (qualquer anexo)
- Geração de JSON compatível com sistema de importação
- Estrutura v2.0.0 unificada

**Características:**
- ✅ Estrutura `metadata` + `dados` unificada
- ✅ Nomenclatura padronizada (`cpf_cnpj`, `produtos_processados`)
- ✅ Sistema de escopos simplificado (apenas `activities`)
- ✅ Campos completos (rastreabilidade, BPF, declarações)
- ✅ Exemplo real testado (pmoteste.json)
- ✅ Tabela de referência rápida

### 2. `CHANGELOG-PDF-EXTRACTION.md` 📋 HISTÓRICO
Documentação completa de mudanças entre versões.

**Conteúdo:**
- Comparação v1.0 vs v2.0.0
- Breaking changes
- Guia de migração
- Checklist de atualização

---

## 🚀 Como Usar

### Método 1: Claude / ChatGPT / Gemini (Manual)

1. **Abra o arquivo principal:**
   ```bash
   prompts/pdf-extraction-prompt.md
   ```

2. **Copie TODO o conteúdo** (Ctrl+A → Ctrl+C)

3. **Abra sua IA preferida:**
   - Claude: https://claude.ai
   - ChatGPT: https://chat.openai.com
   - Gemini: https://gemini.google.com

4. **Cole o prompt na conversa**

5. **Anexe ou cole o PDF do PMO**

6. **Aguarde a extração**
   - IA retornará JSON estruturado
   - Copie o JSON (remova ````json se houver)

7. **Salve em arquivo `.json`**
   ```bash
   pmo_2024_cpf_unidade.json
   ```

8. **Importe no sistema:**
   - Painel PMO → Importar JSON/PDF
   - Selecione o arquivo salvo
   - Sistema validará e preencherá formulários

---

### Método 2: Via API (Automatizado)

#### Exemplo com Claude API:

```javascript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// 1. Ler o prompt
const prompt = fs.readFileSync('prompts/pdf-extraction-prompt.md', 'utf-8');

// 2. Extrair texto do PDF (usando lib de sua escolha)
const pdfText = await extractTextFromPDF('pmo-produtor.pdf');

// 3. Chamar API
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 8192,
  messages: [{
    role: 'user',
    content: `${prompt}\n\n===CONTEÚDO DO PDF===\n${pdfText}`
  }]
});

// 4. Extrair JSON da resposta
const jsonText = message.content[0].text;
const pmoData = JSON.parse(jsonText);

// 5. Salvar
fs.writeFileSync('output.json', JSON.stringify(pmoData, null, 2));

console.log('✅ JSON extraído:', 'output.json');
```

#### Exemplo com OpenAI API:

```javascript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const prompt = fs.readFileSync('prompts/pdf-extraction-prompt.md', 'utf-8');
const pdfText = await extractTextFromPDF('pmo-produtor.pdf');

const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [{
    role: 'user',
    content: `${prompt}\n\n===CONTEÚDO DO PDF===\n${pdfText}`
  }],
  temperature: 0.1  // Baixa temperatura = mais preciso
});

const jsonText = completion.choices[0].message.content;
const pmoData = JSON.parse(jsonText);

fs.writeFileSync('output.json', JSON.stringify(pmoData, null, 2));
```

---

## 🔍 Validação do JSON Gerado

**SEMPRE valide o JSON antes de importar no sistema:**

### 1. Validação Estrutural

```javascript
// Verificar campos obrigatórios
const requiredFields = [
  'metadata.versao_schema',
  'metadata.tipo_formulario',
  'metadata.id_produtor',
  'metadata.grupo_spg',
  'dados.identificacao.cpf_cnpj',
  'dados.identificacao.nome_completo',
  'dados.activities'
];

requiredFields.forEach(field => {
  const value = field.split('.').reduce((obj, key) => obj?.[key], pmoData);
  if (!value) {
    console.error(`❌ Campo obrigatório faltando: ${field}`);
  }
});
```

### 2. Validação contra Schema

```javascript
import Ajv from 'ajv';
import fs from 'fs';

const ajv = new Ajv();
const schema = JSON.parse(fs.readFileSync('pmo-unified.schema.json', 'utf-8'));

const validate = ajv.compile(schema);
const valid = validate(pmoData);

if (!valid) {
  console.error('❌ JSON inválido:', validate.errors);
} else {
  console.log('✅ JSON válido!');
}
```

### 3. Checklist Manual

- [ ] `metadata.versao_schema` = "2.0.0"
- [ ] `metadata.tipo_formulario` = "pmo_completo"
- [ ] `dados.identificacao.cpf_cnpj` formatado corretamente
- [ ] `dados.activities` presente (NÃO `dados.escopo`)
- [ ] Se `activities.escopo_processamento = true`, anexo incluído em `escopos`
- [ ] `dados.pretende_certificar = true` se algum escopo ativo
- [ ] Datas em formato ISO 8601
- [ ] Coordenadas em formato decimal
- [ ] Arrays preenchidos (não vazios para dados existentes)

---

## 🐛 Troubleshooting

### Problema: IA retorna texto em vez de JSON puro

**Solução:**
```javascript
// Remover markdown
let jsonText = response.replace(/```json\n/g, '').replace(/```/g, '');

// Tentar parsear
try {
  const data = JSON.parse(jsonText);
} catch (err) {
  console.error('Erro ao parsear JSON:', err);
}
```

### Problema: Campos com nomes errados

**Causa:** IA não consultou schemas
**Solução:** Reforçar no prompt:
```
⚠️ ANTES DE EXTRAIR: CONSULTE O SCHEMA OFICIAL EM /database/schemas/
```

### Problema: Estrutura flat (v1.0) em vez de metadata + dados

**Causa:** IA usou exemplo antigo
**Solução:** Usar prompt v2.0.0 atual (este arquivo)

### Problema: Campos `dados.escopo` E `dados.activities` duplicados

**Causa:** Confusão com versões antigas
**Solução:** Remover `dados.escopo`, manter apenas `activities`

```javascript
// Limpar duplicação
if (pmoData.dados.escopo) {
  delete pmoData.dados.escopo;
}

// Garantir que activities existe
if (!pmoData.dados.activities) {
  pmoData.dados.activities = {
    escopo_hortalicas: false,
    escopo_frutas: false,
    escopo_graos: false,
    escopo_medicinais: false,
    escopo_cogumelos: false,
    escopo_pecuaria: false,
    escopo_apicultura: false,
    escopo_proc_minimo: false,
    escopo_processamento: false
  };
}
```

---

## 📚 Recursos Adicionais

### Schemas Oficiais
```
/database/schemas/
├── pmo-unified.schema.json          # Schema principal
├── cadastro-geral-pmo.schema.json   # Cadastro geral
├── anexo-vegetal.schema.json        # Produção vegetal
├── anexo-animal.schema.json         # Produção animal
├── anexo-cogumelo.schema.json       # Cogumelos
├── anexo-apicultura.schema.json     # Apicultura
├── anexo-processamento.schema.json  # Processamento industrial
└── anexo-processamentomin.schema.json # Processamento mínimo
```

### Exemplos de JSON
```
pmoteste.json                # Exemplo real validado
TESTE_IMPORTACAO.md          # Guia de teste de importação
```

### Documentação
```
prompts/
├── pdf-extraction-prompt.md         # ← Prompt principal
├── CHANGELOG-PDF-EXTRACTION.md      # Histórico de mudanças
└── README.md                        # ← Este arquivo
```

---

## ⚠️ Notas Importantes

### Precisão da IA

- **Não é 100% precisa:** Sempre revise o JSON gerado
- **Campos podem estar vazios:** Se PDF não tem informação
- **Formatação pode variar:** Valide CPF/CNPJ, datas, coordenadas
- **Tabelas complexas:** Podem exigir revisão manual

### Boas Práticas

1. **Use temperatura baixa (0-0.2)** para maior precisão
2. **Valide SEMPRE** antes de importar
3. **Revise campos críticos:**
   - CPF/CNPJ
   - Coordenadas
   - Datas
   - Percentuais (devem somar 100%)
4. **Teste importação** em ambiente de desenvolvimento primeiro
5. **Mantenha backup** dos PDFs originais

### Limitações

- ⚠️ PDFs muito grandes podem exceder limite de tokens
- ⚠️ PDFs escaneados (imagem) precisam OCR antes
- ⚠️ Tabelas complexas podem perder formatação
- ⚠️ Coordenadas DMS precisam conversão manual para decimal

---

## 🆘 Suporte

**Problemas com:**
- **Prompt:** Verifique CHANGELOG para breaking changes
- **Schema:** Consulte `/database/schemas/`
- **Importação:** Teste com pmoteste.json primeiro
- **Validação:** Use AJV com schema oficial

**Reportar issues:**
- GitHub: https://github.com/anc-organicos/pmo-system/issues
- Email: suporte@anc.org.br

---

**Versão:** 2.0.0
**Última Atualização:** Janeiro 2025
**Mantido por:** Equipe ANC
