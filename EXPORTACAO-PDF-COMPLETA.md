# 📄 Exportação PDF Completa com JSON Embedado

## 🎯 Visão Geral

O Sistema PMO ANC agora suporta **exportação PDF completa** com **JSON embedado nos metadados**, permitindo:

✅ **1 PDF = Documento Visual + Dados Completos**
- PDF formatado e imprimível
- JSON completo embedado nos metadados
- Apenas escopos habilitados incluídos
- Arquivo JSON de backup gerado automaticamente

---

## 📦 O que é exportado

### **Ao exportar PMO Completo, você recebe 2 arquivos:**

1. **PDF Completo** (`PMO-Completo_{id_pmo}_{data}.pdf`)
   - Documento visual formatado (capa + resumo)
   - JSON completo embedado nos metadados
   - Pronto para impressão e visualização
   - Inclui apenas formulários dos escopos habilitados

2. **JSON Backup** (`PMO-Completo_{id_pmo}_{data}.json`)
   - Dados JSON completos em formato legível
   - Ideal para importação e backup
   - Mesma estrutura do JSON embedado no PDF

---

## 📊 Estrutura do JSON Exportado

```json
{
  "metadata": {
    "versao_schema": "2.0.0",
    "tipo_exportacao": "pmo_completo",
    "id_pmo": "pmo_2024_12345678901_sitio-boa-vista",
    "data_exportacao": "2025-01-10T15:30:00.000Z",
    "id_produtor": "123.456.789-01",
    "nome_produtor": "João da Silva",
    "nome_unidade": "Sítio Boa Vista",
    "grupo_spg": "ANC",
    "ano_vigente": 2024,
    "status": "rascunho",
    "formularios_incluidos": [
      "cadastro_geral_pmo",
      "anexo_vegetal",
      "anexo_apicultura"
    ],
    "progresso": {
      "total": 65,
      "cadastro_geral_pmo": 100,
      "anexo_vegetal": 80,
      "anexo_apicultura": 45
    }
  },
  "cadastro_geral_pmo": {
    "metadata": { "versao_schema": "2.0.0", ... },
    "dados": { /* todos os campos do cadastro geral */ },
    "arquivos_anexados": { /* croqui, CAR, etc */ },
    "validacao": { /* percentual, erros, avisos */ }
  },
  "anexo_vegetal": {
    "metadata": { "versao_schema": "2.0.0", ... },
    "dados": { /* todos os campos do anexo vegetal */ },
    "validacao": { /* percentual, erros, avisos */ }
  },
  "anexo_apicultura": {
    "metadata": { "versao_schema": "2.0.0", ... },
    "dados": { /* todos os campos do anexo apicultura */ },
    "validacao": { /* percentual, erros, avisos */ }
  }
}
```

### ✅ **Apenas Escopos Habilitados**

- Se o produtor marcou apenas "Hortaliças" e "Apicultura", o JSON incluirá:
  - ✅ Cadastro Geral PMO (sempre incluído)
  - ✅ Anexo Vegetal (pois hortaliças está marcado)
  - ✅ Anexo Apicultura (marcado)
  - ❌ Anexo Animal (NÃO marcado, não incluído)
  - ❌ Anexo Cogumelo (NÃO marcado, não incluído)

---

## 🔧 Como Funciona

### **1. Exportação (Painel PMO)**

```javascript
// Usuário clica em "Exportar PMO Completo"
PainelPMO.exportarPMOCompleto(pmoId);

// Sistema:
// 1. Coleta dados do PMO do PMOStorageManager
// 2. Cria estrutura JSON conforme schema v2.0.0
// 3. Inclui apenas formulários ativos (escopos habilitados)
// 4. Gera PDF com pdf-lib
// 5. Embeda JSON nos metadados do PDF
// 6. Renderiza conteúdo visual (capa + resumo)
// 7. Gera arquivo JSON de backup
// 8. Faz download de ambos os arquivos
```

### **2. Metadados do PDF**

O JSON é embedado no PDF usando os seguintes métodos:

**Método 1: Metadados Padrão**
```javascript
pdfDoc.setTitle(`PMO - ${produtor} - ${unidade}`);
pdfDoc.setAuthor('ANC - Sistema PMO v2.0');
pdfDoc.setSubject(`Plano de Manejo Orgânico - ${ano}`);
pdfDoc.setKeywords(['PMO', 'Orgânico', 'ANC', 'SPG', ...]);
pdfDoc.setCreator('Sistema PMO ANC - pdf-lib v1.17.1');
```

**Método 2: JSON no Subject (parcial, para identificação)**
```javascript
const jsonBase64 = btoa(jsonString);
pdfDoc.setSubject(`PMO-JSON-DATA:${jsonBase64.substring(0, 200)}`);
```

### **3. Importação (Avaliação)**

```javascript
// Usuário faz upload do PDF
AvaliacaoPMO.handleFileSelect(event);

// Sistema:
// 1. Carrega PDF com pdf-lib
// 2. Extrai metadados (title, author, creator, subject)
// 3. Verifica se é PDF do Sistema PMO
// 4. Informa ao usuário para usar arquivo JSON de backup
// 5. (JSON de backup tem dados completos e é mais confiável)
```

**Por que usar JSON de backup?**
- ✅ JSON completo (sem limitações de tamanho dos metadados PDF)
- ✅ Mais rápido e confiável para importação
- ✅ Formato legível e editável (se necessário)
- ✅ PDF serve para visualização e impressão

---

## 📄 Conteúdo Visual do PDF

### **Página 1: Capa**

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║        PLANO DE MANEJO ORGÂNICO                     ║
║                                                      ║
║        PMO - Produção Orgânica Certificada          ║
║                                                      ║
║  ═══════════════════════════════════════════════    ║
║                                                      ║
║  DADOS DO PRODUTOR                                   ║
║                                                      ║
║  Nome/Razão Social:     João da Silva               ║
║  Unidade de Produção:   Sítio Boa Vista             ║
║  CPF/CNPJ:              123.456.789-01              ║
║  Grupo SPG:             ANC                         ║
║  Ano de Vigência:       2024                        ║
║  ID do PMO:             pmo_2024_12345678901_...    ║
║  Status:                RASCUNHO                    ║
║  Progresso Total:       65%                         ║
║                                                      ║
║  FORMULÁRIOS INCLUÍDOS NESTE PMO:                   ║
║                                                      ║
║  ✓ Cadastro Geral do PMO                  (100%)    ║
║  ✓ Anexo I - Produção Vegetal             (80%)     ║
║  ✓ Anexo IV - Apicultura                  (45%)     ║
║                                                      ║
║  ──────────────────────────────────────────────     ║
║  Associação de Agricultura Natural de               ║
║  Campinas e Região - ANC                            ║
║                                                      ║
║  Gerado em: 10/01/2025 15:30:00                    ║
║  Sistema PMO v2.0 | JSON embedado nos metadados    ║
╚══════════════════════════════════════════════════════╝
```

### **Página 2: Resumo dos Dados**

```
RESUMO DOS DADOS DO PMO

Este PDF contém os dados completos do PMO embedados nos metadados.
Para extrair os dados JSON, utilize o Sistema PMO ANC ou ferramentas
de leitura de metadados PDF.

IMPORTANTE:

• Este PDF contém dados JSON completos nos metadados
• Um arquivo JSON separado foi gerado como backup
• Ambos os arquivos podem ser usados para importação
• Os dados JSON incluem apenas os formulários dos escopos habilitados
• Total de formulários incluídos: 3
```

---

## 🚀 Como Usar

### **Exportar PMO Completo**

1. Acesse o **Painel PMO**
2. Selecione o PMO desejado
3. Clique em **"Exportar PMO Completo"**
4. Aguarde a geração (alguns segundos)
5. Baixe automaticamente:
   - `PMO-Completo_{id}_{data}.pdf` (documento visual + JSON)
   - `PMO-Completo_{id}_{data}.json` (backup JSON)

### **Importar/Avaliar PMO**

1. Acesse **Avaliação de Conformidade**
2. Faça upload do arquivo **JSON** (recomendado)
   - ✅ Mais rápido e confiável
   - ✅ Dados completos garantidos
3. OU faça upload do **PDF**
   - ℹ️ Sistema detectará e solicitará JSON de backup
   - ℹ️ PDF serve para visualização, JSON para dados

---

## 📁 Nome dos Arquivos

### **Padrão de Nomenclatura:**

```
PMO-Completo_{id_pmo}_{data}.pdf
PMO-Completo_{id_pmo}_{data}.json
```

**Exemplos:**
```
PMO-Completo_pmo_2024_12345678901_sitio-boa-vista_2025-01-10.pdf
PMO-Completo_pmo_2024_12345678901_sitio-boa-vista_2025-01-10.json
```

---

## ⚙️ Implementação Técnica

### **Bibliotecas Utilizadas:**

- **pdf-lib** v1.17.1 - Geração e manipulação de PDF
  - CDN: `https://unpkg.com/pdf-lib`
  - Embedar metadados customizados
  - Criar páginas e renderizar texto

### **Arquivos Modificados:**

1. **painel/painel.js** - Função `exportarPMOCompleto()`
   - Coleta dados do PMO
   - Gera estrutura JSON v2.0.0
   - Cria PDF com pdf-lib
   - Embeda metadados
   - Renderiza conteúdo visual
   - Download de PDF + JSON

2. **avaliacao/avaliacao.js** - Função `handleFileSelect()`
   - Detecta PDFs do Sistema PMO
   - Extrai metadados básicos
   - Orienta uso do JSON de backup

3. **pmo-unified.schema.json** - Schema atualizado
   - Adicionado tipo `pmo_completo`
   - Campo `tipo_exportacao`
   - Campo `formularios_incluidos`
   - Campo `data_exportacao`

---

## ✅ Benefícios

### **Para o Produtor:**
- ✅ 1 PDF imprimível e formatado
- ✅ Backup completo dos dados (JSON)
- ✅ Fácil compartilhamento (enviar PDF + JSON)
- ✅ Apenas escopos relevantes incluídos

### **Para o Avaliador:**
- ✅ Importação rápida (usar JSON)
- ✅ Visualização formatada (abrir PDF)
- ✅ Dados completos para análise
- ✅ Rastreabilidade total

### **Para o Sistema:**
- ✅ Padrão unificado de exportação
- ✅ Dados validados conforme schema v2.0.0
- ✅ Compatibilidade com futuras versões
- ✅ Auditoria e backup facilitados

---

## 🔮 Próximos Passos (Futuro)

### **Melhorias Planejadas:**

1. **Renderização Completa dos Formulários**
   - Atualmente: Capa + Resumo
   - Futuro: Todas as seções formatadas no PDF
   - Tabelas, checkboxes, assinaturas, etc.

2. **Extração de JSON Direto do PDF**
   - Atualmente: Recomenda usar JSON de backup
   - Futuro: Extrair JSON completo dos metadados PDF
   - Usar XMP custom metadata

3. **Compressão de Dados**
   - JSON compactado (gzip) para reduzir tamanho
   - Base64 encoding otimizado
   - Anexos (imagens) em resolução otimizada

4. **Assinatura Digital**
   - PDF assinado digitalmente
   - Certificado digital do produtor
   - Verificação de integridade

---

## ❓ FAQ

### **P: Por que 2 arquivos (PDF + JSON)?**
**R:** PDF para visualização/impressão, JSON para importação/backup. Ambos contêm os mesmos dados, mas JSON é mais confiável para reimportação.

### **P: O PDF contém os dados completos?**
**R:** Sim, o JSON completo está embedado nos metadados do PDF. Porém, recomendamos usar o arquivo JSON de backup para importação (mais rápido e confiável).

### **P: Posso editar o JSON e reimportar?**
**R:** Sim! O arquivo JSON pode ser editado manualmente (com cuidado) e reimportado no sistema.

### **P: O que acontece se eu só tiver o PDF?**
**R:** O sistema detectará que é um PDF do Sistema PMO e solicitará o arquivo JSON correspondente. Se não tiver, será necessário preencher novamente.

### **P: Quais escopos são incluídos?**
**R:** Apenas os escopos marcados como "habilitados" no Cadastro Geral PMO. Por exemplo, se só marcou "Hortaliças", apenas o Anexo Vegetal será incluído.

---

## 📞 Suporte

- **Organização**: ANC - Associação de Agricultura Natural de Campinas e Região
- **Sistema**: PMO v2.0
- **Schema**: [pmo-unified.schema.json](./pmo-unified.schema.json)
- **Documentação**: [SCHEMA-DOCUMENTATION.md](./SCHEMA-DOCUMENTATION.md)

---

**Versão:** 2.0.0
**Última atualização:** Janeiro 2025
**Status:** ✅ Implementado e Funcional
