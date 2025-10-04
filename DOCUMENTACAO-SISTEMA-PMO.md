# 📋 Documentação Completa - Sistema PMO Digital

## 🎯 Visão Geral

**Sistema de Plano de Manejo Orgânico Digital** desenvolvido para a **ANC - Associação de Agricultura Natural de Campinas e Região**.

Uma aplicação web completa para criação, gerenciamento e certificação de Planos de Manejo Orgânico (PMO) conforme legislação brasileira (Portaria 52/2021 do MAPA).

---

## 📊 Índice

1. [O que é o Sistema](#o-que-é-o-sistema)
2. [Capacidades e Funcionalidades](#capacidades-e-funcionalidades)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Componentes Principais](#componentes-principais)
5. [Módulos e Formulários](#módulos-e-formulários)
6. [Fluxo de Trabalho](#fluxo-de-trabalho)
7. [Tecnologias Utilizadas](#tecnologias-utilizadas)
8. [Estrutura de Armazenamento](#estrutura-de-armazenamento)
9. [Validações e Conformidade](#validações-e-conformidade)
10. [Guia de Uso](#guia-de-uso)
11. [Segurança e Privacidade](#segurança-e-privacidade)
12. [Roadmap e Melhorias Futuras](#roadmap-e-melhorias-futuras)

---

## 🌟 O que é o Sistema

### Definição

Sistema web completo e offline-first que permite a produtores orgânicos, técnicos da ANC e avaliadores:

- **Criar e preencher** Planos de Manejo Orgânico digitalmente
- **Gerenciar múltiplos PMOs** simultaneamente
- **Acompanhar progresso** de preenchimento em tempo real
- **Validar conformidade** com a legislação brasileira
- **Exportar documentos** em PDF e JSON
- **Avaliar PMOs** para certificação participativa

### Objetivos

1. **Simplificar** o processo burocrático de certificação orgânica
2. **Reduzir erros** através de validação automatizada
3. **Acelerar análise** com dados estruturados e padronizados
4. **Garantir rastreabilidade** completa da produção orgânica
5. **Facilitar auditorias** e visitas de verificação

### Público-Alvo

- **Produtores Orgânicos**: Agricultores familiares e empresas
- **Técnicos da ANC**: Orientadores de preenchimento
- **Avaliadores**: Responsáveis pela certificação
- **Gestores SPG**: Coordenadores do Sistema Participativo de Garantia

---

## 🚀 Capacidades e Funcionalidades

### 1. Gerenciamento de Múltiplos PMOs

#### Sistema de Painel Centralizado
- **Visualização em cards** de todos os PMOs cadastrados
- **Busca e filtros avançados**:
  - Por nome do produtor
  - CPF/CNPJ
  - Unidade de produção
  - Grupo SPG
  - Ano vigente
  - Status (rascunho/completo)
- **Ordenação flexível**:
  - Mais recentes/antigos
  - Maior/menor progresso
  - Ordem alfabética (A-Z/Z-A)

#### Criação de Novos PMOs
- **ID único automático**: `pmo_{ano}_{cpf_cnpj}_{unidade}`
- **Metadados completos**:
  - Data de criação
  - Data de última modificação
  - Versão do schema
  - Status (rascunho/completo)
- **Migração automática** de dados antigos

#### Importação/Exportação
- **Upload de PDF** com metadados
- **Importação de JSON** (backup)
- **Exportação completa** de dados
- **Download de PDF** gerado

### 2. Formulários Inteligentes

#### 2.1 Cadastro Geral PMO (Obrigatório)

**17 Seções Completas**:

1. **Identificação do Produtor/Empresa**
   - CPF ou CNPJ com validação
   - Dados cadastrais completos
   - Nome da unidade de produção

2. **Dados de Contato**
   - Telefone com máscara automática
   - E-mail com validação
   - Telefone adicional (opcional)

3. **Endereço da Unidade de Produção**
   - **Busca automática via CEP** (API ViaCEP)
   - Coordenadas GPS (latitude/longitude)
   - Roteiro de acesso detalhado

4. **Dados da Propriedade**
   - Situação de posse da terra
   - Área total em hectares
   - CAF (Cadastro de Agricultor Familiar)

5. **Histórico de Manejo Orgânico**
   - Anos de prática orgânica
   - Situação atual (conversão/orgânico)
   - Comprovações documentais

6. **Responsáveis pela Produção**
   - **Tabela dinâmica** (adicionar/remover)
   - CPF com validação
   - Funções e responsabilidades
   - Contatos individuais

7. **Atividades Orgânicas (Escopo)**
   - Seleção de tipos de produção:
     - 🌱 Hortaliças
     - 🍎 Frutas
     - 🌾 Grãos e cereais
     - 🌿 Plantas medicinais
     - 🍄 Cogumelos
     - 🐄 Pecuária
     - 🐝 Apicultura
     - 🏭 Processamento
     - 🥗 Processamento mínimo
   - **Navegação inteligente**: habilita apenas anexos necessários

8. **Histórico de Aplicações**
   - Registro de insumos não permitidos (últimos 3 anos)
   - Datas e ingredientes ativos
   - **Validação automática** de período de conversão (12 meses)

9. **Lista de Produtos a Certificar** ⭐
   - **Tabela dinâmica obrigatória**
   - Estimativa de produção anual
   - Origem de sementes/mudas
   - Variedades cultivadas

10. **Preservação Ambiental**
    - CAR (Cadastro Ambiental Rural)
    - Áreas de Preservação Permanente (APP)
    - Reserva Legal
    - Destinação de resíduos
    - Proteção de nascentes

11. **Recursos Hídricos**
    - Fontes de água (poço, rio, açude)
    - Avaliação de riscos de contaminação
    - Análises de qualidade da água
    - Sistema de irrigação

12. **Comercialização**
    - Canais de venda
    - Rotulagem e embalagens
    - Sistema de rastreabilidade
    - Produção paralela (orgânica/convencional)

13. **Controles e Registros**
    - Cadernos de campo digitais
    - **Rastreabilidade obrigatória** (IN 19/2011)
    - Gestão de estoque
    - Controle de insumos

14. **Produção de Subsistência**
    - Produção não orgânica para consumo próprio
    - Medidas de separação
    - Áreas distintas

15. **Produção Paralela**
    - Mesmo produto orgânico E convencional
    - Riscos de contaminação
    - **Sistema de bloqueio** se inadequado

16. **Upload de Documentos** ⭐
    - **Croqui da propriedade (obrigatório)**
    - CAR (recomendado)
    - Análises de solo
    - Análises de água
    - Notas fiscais de insumos
    - **Drag-and-drop** facilitado
    - **Preview instantâneo**
    - Conversão para Base64

17. **Declarações e Compromissos** ⭐
    - Veracidade das informações
    - Seguir normas de produção orgânica (Lei 10.831/2003)
    - Autorizar visitas de verificação
    - Assinatura digital

#### 2.2 Anexos Específicos (Conforme Escopo)

**Anexo Vegetal** 🌱
- Culturas e variedades
- Calendário de plantio e colheita
- Manejo de pragas e doenças
- Adubação orgânica
- Controle de plantas invasoras
- Rotação de culturas

**Anexo Animal** 🐄
- Espécies criadas
- Sistema de criação
- Alimentação (orgânica/não orgânica)
- Sanidade animal
- Bem-estar animal
- Gestão de dejetos

**Anexo Cogumelo** 🍄
- Espécies cultivadas
- Substrato utilizado
- Ambiente de cultivo
- Origem do inóculo
- Controle de contaminação

**Anexo Apicultura** 🐝
- Número de colmeias
- Localização dos apiários
- Manejo de caixas
- Alimentação artificial
- Sanidade das abelhas
- Produtos obtidos (mel, própolis, pólen)

**Anexo Processamento** 🏭
- Produtos processados
- Fluxograma de produção
- Ingredientes utilizados
- Embalagens
- Rotulagem
- Controle de qualidade
- PPHO (Procedimentos Padrão de Higiene Operacional)

**Anexo Processamento Mínimo** 🥗
- Produtos minimamente processados
- Higienização
- Embalagem
- Armazenamento
- Validade

### 3. Sistema de Avaliação

**Módulo para Avaliadores**:

- **Carregamento automático** de dados do PMO
- **Checklist de verificação**:
  - Conformidade com legislação
  - Completude de informações
  - Coerência de dados
  - Documentação anexada
- **Campos de avaliação**:
  - Observações gerais
  - Pontos fortes
  - Não conformidades
  - Recomendações
  - Parecer técnico
- **Status de aprovação**:
  - Aprovado
  - Aprovado com ressalvas
  - Não aprovado
  - Pendente de documentação

### 4. Validação Inteligente

#### Validação em Tempo Real
- **HTML5 nativo**: campos obrigatórios, tipos, padrões
- **JavaScript customizado**: CPF, CNPJ, e-mail, telefone
- **Validação por seção**: feedback imediato

#### Validação Completa
- **Relatório detalhado** com 2 níveis:
  - ❌ **Erros**: Impedem envio/aprovação
  - ⚠️ **Avisos**: Recomendações (não impedem)
- **Verificação de legislação**:
  - Período de conversão (12 meses)
  - CAR obrigatório
  - Rastreabilidade implementada
  - Croqui da propriedade anexado

#### Regras de Negócio
- **Portaria 52/2021 MAPA**: Estrutura do PMO
- **Lei 10.831/2003**: Produção orgânica
- **IN 19/2011**: Rastreabilidade
- **Lei 12.651/2012**: CAR obrigatório

### 5. Auto-Save e Persistência

#### Salvamento Automático
- **Intervalo**: A cada 30 segundos
- **Armazenamento**: localStorage do navegador
- **Indicador visual**: "Última gravação às HH:MM"
- **Sem necessidade de internet**

#### Sistema de Armazenamento Unificado
```javascript
PMOStorageManager
├── Registry (índice de todos PMOs)
│   ├── current_pmo_id
│   └── pmos[]
│       ├── id
│       ├── metadados
│       ├── progresso
│       └── formularios_ativos
└── Dados de cada PMO
    ├── cadastro_geral_pmo
    ├── anexo_vegetal
    ├── anexo_animal
    ├── anexo_cogumelo
    ├── anexo_apicultura
    ├── anexo_processamento
    ├── anexo_processamentominimo
    ├── avaliacao
    ├── documentos_anexados (Base64)
    └── pdfs_gerados (Base64)
```

### 6. Progresso e Acompanhamento

#### Cálculo de Progresso
- **Baseado em campos obrigatórios** preenchidos
- **Por formulário**: percentual individual
- **Geral**: média ponderada de todos formulários ativos
- **Atualização em tempo real** durante digitação

#### Indicadores Visuais
- **Barra de progresso** no topo de cada formulário
- **Percentual numérico**: "65% Completo"
- **Status colorido**:
  - 🔴 0-40%: Incompleto
  - 🟡 41-80%: Em andamento
  - 🟢 81-100%: Completo

#### Timeline de Formulários
- **Navegação visual** entre formulários
- **Indicação de status** (não iniciado/em progresso/completo)
- **Ordem lógica** de preenchimento

### 7. Recursos de Interface

#### Máscaras de Entrada
- **CPF**: `000.000.000-00`
- **CNPJ**: `00.000.000/0000-00`
- **CEP**: `00000-000`
- **Telefone**: `(00) 00000-0000`
- **Data**: `DD/MM/AAAA`
- **Dinheiro**: `R$ 0.000,00`

#### Tabelas Dinâmicas
- ➕ **Adicionar linha**: Insere nova linha
- ❌ **Remover linha**: Deleta linha específica
- 📋 **Duplicar linha**: Copia dados para facilitar preenchimento
- **Numeração automática**: Atualiza ao adicionar/remover
- **Validação por linha**: Cada linha é validada individualmente

#### Upload de Arquivos
- **Drag-and-drop**: Arraste arquivos para área de upload
- **Seleção manual**: Clique para escolher arquivos
- **Preview instantâneo**:
  - Imagens: Thumbnail visual
  - PDFs: Nome e tamanho
- **Validação**:
  - Tamanho máximo: 10MB por arquivo
  - Formatos: PDF, JPG, PNG, JPEG
- **Conversão Base64**: Armazenamento local offline

#### APIs Integradas
- **ViaCEP**: Busca automática de endereço por CEP
- **BrasilAPI** (futuro): Validação de CNPJ na Receita Federal
- **Google Maps** (futuro): Validação de coordenadas GPS

### 8. Exportação e Relatórios

#### Exportação JSON
```json
{
  "metadata": {
    "id_pmo": "pmo_2025_12345678900_sitio-exemplo",
    "id_produtor": "123.456.789-00",
    "tipo_documento": ["pmo-principal", "anexo-vegetal"],
    "data_extracao": "2025-01-30T14:30:00Z",
    "versao_schema": "1.0",
    "grupo_spg": "ANC",
    "status_processamento": "COMPLETO",
    "ano_vigente": 2025
  },
  "dados_gerais": { ... },
  "anexos": { ... },
  "documentos_anexados": { ... },
  "validacao": {
    "campos_obrigatorios_completos": true,
    "possui_erros": false,
    "percentual_preenchimento": 100
  }
}
```

#### Geração de PDF
- **Template oficial** da ANC
- **Cabeçalho/rodapé** padronizado
- **Marcas d'água** para rascunhos
- **Assinatura digital** (planejado)
- **QR Code** para validação (planejado)

#### Relatórios do Sistema
- **Painel de indicadores**:
  - Total de PMOs cadastrados
  - PMOs completos vs. rascunhos
  - PMOs por grupo SPG
  - PMOs por tipo de produção
  - Progresso médio geral

### 9. Navegação e Fluxo

#### Sistema de Navegação Inteligente
- **Baseado em escopo**: Só mostra formulários relevantes
- **Breadcrumbs**: Localização atual
- **Menu lateral**: Acesso rápido a seções
- **Timeline visual**: Progresso sequencial

#### Flow Navigator
```
Cadastro Geral PMO (obrigatório)
    ↓
Seleção de Escopo (Seção 7)
    ↓
Anexos Específicos (habilitados conforme escopo)
    ├─→ Anexo Vegetal
    ├─→ Anexo Animal
    ├─→ Anexo Cogumelo
    ├─→ Anexo Apicultura
    ├─→ Anexo Processamento
    └─→ Anexo Proc. Mínimo
    ↓
Validação Completa
    ↓
Avaliação (técnico)
    ↓
Aprovação/Certificação
```

### 10. Responsividade

#### Design Mobile-First
- **Breakpoints**:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Touch-friendly**: Botões mínimo 44x44px
- **Gestos suportados**: Swipe, drag-and-drop
- **Teclado virtual**: Inputs otimizados

#### Acessibilidade (WCAG 2.1)
- **Labels descritivos** em todos campos
- **Navegação por teclado**: Tab, Enter, Esc
- **ARIA attributes**: Roles, labels, live regions
- **Contraste adequado**: AA mínimo
- **Screen readers**: Compatível com NVDA, JAWS

---

## 🏗️ Arquitetura do Sistema

### Estrutura de Pastas

```
formulario/
├── index.html                    # Página inicial do sistema
├── README.md                     # Documentação principal
├── DOCUMENTACAO-SISTEMA-PMO.md   # Esta documentação
│
├── framework/                    # Framework CSS/JS reutilizável
│   ├── core/
│   │   ├── pmo-framework.css        # Estilos compilados
│   │   └── pmo-framework.js         # Scripts compilados
│   │
│   ├── styles/                   # Arquivos CSS modulares
│   │   ├── _variables.css           # Variáveis de design
│   │   ├── _base.css                # Reset e base
│   │   ├── _components.css          # Componentes UI
│   │   ├── _utilities.css           # Classes utilitárias
│   │   ├── _responsive.css          # Media queries
│   │   └── _print.css               # Estilos para impressão
│   │
│   ├── components/               # Componentes JavaScript
│   │   ├── pmo-storage-manager.js   # Gerenciador de armazenamento
│   │   ├── pmo-tables.js            # Tabelas dinâmicas
│   │   ├── scope-manager.js         # Gerenciador de escopo
│   │   ├── progress-tracker.js      # Rastreador de progresso
│   │   ├── flow-navigator.js        # Navegação entre formulários
│   │   ├── validators.js            # Validações customizadas
│   │   ├── storage.js               # Utilitários de localStorage
│   │   ├── upload.js                # Upload de arquivos
│   │   ├── notifications.js         # Sistema de notificações
│   │   └── export.js                # Exportação JSON/PDF
│   │
│   ├── utils/                    # Utilitários
│   │   ├── formatters.js            # Formatação de dados
│   │   ├── constants.js             # Constantes do sistema
│   │   ├── date-helpers.js          # Manipulação de datas
│   │   └── api-client.js            # Cliente HTTP
│   │
│   └── README.md                 # Documentação do framework
│
├── pmo/                          # Módulos do sistema PMO
│   │
│   ├── painel/                   # Painel de gerenciamento
│   │   ├── index.html
│   │   ├── painel.js
│   │   └── painel.css
│   │
│   ├── cadastro-geral-pmo/       # Formulário principal
│   │   ├── index.html
│   │   ├── cadastro-geral-pmo.js
│   │   ├── validation-rules.js
│   │   └── README.md
│   │
│   ├── anexo-vegetal/            # Anexo de produção vegetal
│   │   ├── index.html
│   │   ├── vegetal.js
│   │   ├── vegetal-validators.js
│   │   └── README.md
│   │
│   ├── anexo-animal/             # Anexo de produção animal
│   │   ├── index.html
│   │   ├── anexo-animal.js
│   │   ├── validation-rules.js
│   │   └── README.md
│   │
│   ├── anexo-cogumelo/           # Anexo de cogumelos
│   │   ├── index.html
│   │   └── cogumelo.js
│   │
│   ├── anexo-apicultura/         # Anexo de apicultura
│   │   ├── index.html
│   │   └── anexo-apicultura.js
│   │
│   ├── anexo-processamento/      # Anexo de processamento
│   │   ├── index.html
│   │   └── processamento.js
│   │
│   ├── anexo-processamentominimo/  # Proc. mínimo
│   │   ├── index.html
│   │   └── processamento-minimo.js
│   │
│   ├── avaliacao/                # Módulo de avaliação
│   │   ├── index.html
│   │   └── avaliacao.js
│   │
│   └── relatorios/               # Módulo de relatórios
│       ├── index.html
│       ├── visualizar.html
│       ├── exportar.html
│       └── relatorios.js
│
├── api/                          # Backend (planejado)
│   ├── endpoints/
│   │   ├── auth.js
│   │   ├── pmo.js
│   │   ├── validation.js
│   │   ├── export.js
│   │   └── sync.js
│   │
│   ├── services/
│   │   ├── cep-service.js
│   │   ├── receita-service.js
│   │   ├── pdf-generator.js
│   │   └── email-service.js
│   │
│   └── middleware/
│       ├── auth-middleware.js
│       ├── validation-middleware.js
│       └── error-handler.js
│
└── config/                       # Configurações
    ├── routes.config.js
    ├── validation.config.js
    ├── storage.config.js
    └── app.config.js
```

### Camadas da Aplicação

#### 1. Camada de Apresentação (Frontend)
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos e animações
- **JavaScript ES6+**: Lógica de negócio

#### 2. Camada de Lógica de Negócio
- **PMOStorageManager**: Gerenciamento de dados
- **PMOScopeManager**: Controle de escopo
- **Validators**: Regras de validação
- **Exporters**: Geração de documentos

#### 3. Camada de Dados
- **localStorage**: Armazenamento offline
- **IndexedDB** (futuro): Dados maiores
- **Backend REST API** (futuro): Sincronização

#### 4. Camada de Integração
- **APIs Externas**: ViaCEP, BrasilAPI
- **Serviços de E-mail** (futuro)
- **Cloud Storage** (futuro)

---

## 🧩 Componentes Principais

### 1. PMOStorageManager

**Responsabilidade**: Gerenciar múltiplos PMOs com IDs únicos

**Métodos Principais**:
```javascript
// Criar novo PMO
createPMO(dados) → String (ID)

// Obter PMO completo
getPMO(id) → Object

// Atualizar formulário específico
updateFormulario(id, formularioNome, dados) → Boolean

// Obter formulário específico
getFormulario(id, formularioNome) → Object

// Atualizar progresso
updateProgresso(id, formularioNome, percentual) → Boolean

// Definir PMO ativo
setActivePMO(id) → Boolean

// Obter PMO ativo
getActivePMO() → Object

// Listar todos PMOs
listAllPMOs() → Array

// Deletar PMO
deletePMO(id) → Boolean

// Migrar dados antigos
migrateOldData() → void
```

**Estrutura de Dados**:
```javascript
// Registry
{
  current_pmo_id: "pmo_2025_12345678900_sitio",
  pmos: [
    {
      id: "pmo_2025_12345678900_sitio",
      cpf_cnpj: "123.456.789-00",
      nome: "João da Silva",
      unidade: "Sítio Exemplo",
      grupo_spg: "ANC",
      ano_vigente: 2025,
      versao: "1.0",
      data_criacao: "2025-01-30T10:00:00Z",
      data_modificacao: "2025-01-30T14:30:00Z",
      status: "rascunho",
      progresso: {
        "cadastro-geral-pmo": 85,
        "anexo-vegetal": 60,
        "total": 72
      },
      formularios_ativos: [
        "cadastro-geral-pmo",
        "anexo-vegetal",
        "anexo-apicultura"
      ]
    }
  ]
}

// Dados do PMO (armazenado separadamente)
{
  cadastro_geral_pmo: { ... },
  anexo_vegetal: { ... },
  anexo_apicultura: { ... },
  documentos_anexados: {
    "croqui.pdf": "data:application/pdf;base64,..."
  },
  pdfs_gerados: {
    "cadastro-geral-pmo": "base64..."
  }
}
```

### 2. PMOScopeManager

**Responsabilidade**: Gerenciar atividades selecionadas e habilitar formulários

**Mapeamento de Atividades**:
```javascript
{
  'escopo_hortalicas': 'anexo-vegetal',
  'escopo_frutas': 'anexo-vegetal',
  'escopo_medicinais': 'anexo-vegetal',
  'escopo_cogumelos': 'anexo-cogumelo',
  'escopo_pecuaria': 'anexo-animal',
  'escopo_apicultura': 'anexo-apicultura',
  'escopo_proc_minimo': 'anexo-processamentominimo',
  'escopo_processamento': 'anexo-processamento'
}
```

**Métodos**:
```javascript
// Salvar atividades selecionadas
saveActivities(activities, pretendeCertificar)

// Obter atividades
getActivities()

// Obter anexos necessários
getRequiredAnexos()

// Verificar se anexo é necessário
isAnexoRequired(anexoNome)

// Atualizar progresso de anexo
updateAnexoProgress(anexoNome, percentage)

// Callback quando escopo muda
onScopeChanged()
```

### 3. Sistema de Validação

**Validators.js**:
```javascript
// Validar CPF
validateCPF(cpf) → Boolean

// Validar CNPJ
validateCNPJ(cnpj) → Boolean

// Validar E-mail
validateEmail(email) → Boolean

// Validar Telefone
validateTelefone(telefone) → Boolean

// Validar Data
validateDate(data) → Boolean

// Validar CEP
validateCEP(cep) → Boolean

// Validar Coordenadas GPS
validateGPS(latitude, longitude) → Boolean
```

**ValidationRules.js**:
```javascript
// Validar seção específica
validateIdentificacao(dados) → Object {erros, avisos}

// Validar formulário completo
validateComplete(dados) → Object {
  valido: Boolean,
  erros: Array,
  avisos: Array,
  percentual: Number
}

// Validar período de conversão
validatePeriodoConversao(historicoAplicacoes) → Boolean

// Validar CAR obrigatório
validateCAR(dados) → Boolean

// Validar rastreabilidade
validateRastreabilidade(dados) → Boolean
```

### 4. Tabelas Dinâmicas (PMOTables)

**Funcionalidades**:
```javascript
// Adicionar linha
addRow(tableId, template)

// Remover linha
removeRow(button)

// Duplicar linha
duplicateRow(button)

// Atualizar numeração
updateRowNumbers(tableId)

// Validar tabela
validateTable(tableId) → Boolean

// Obter dados da tabela
getTableData(tableId) → Array

// Popular tabela com dados
populateTable(tableId, data)
```

### 5. Sistema de Upload

**Upload.js**:
```javascript
// Configurar área de upload
setupUploadArea(containerId, options)

// Processar arquivo
processFile(file) → Promise<Base64>

// Validar arquivo
validateFile(file, maxSize, allowedTypes) → Boolean

// Gerar preview
generatePreview(file, containerId)

// Remover arquivo
removeFile(fileId)

// Obter todos arquivos
getAllFiles() → Array
```

### 6. Exportação de Dados

**Export.js**:
```javascript
// Exportar JSON
exportJSON(pmoId) → Blob

// Gerar PDF
generatePDF(pmoId, formularioNome) → Promise<Blob>

// Download automático
downloadFile(blob, filename)

// Exportar todos formulários em ZIP
exportAll(pmoId) → Promise<Blob>
```

---

## 📝 Módulos e Formulários

### Mapeamento de Formulários

| Módulo | Nome Técnico | Obrigatório | Dependências |
|--------|-------------|-------------|--------------|
| Cadastro Geral | `cadastro-geral-pmo` | ✅ Sim | Nenhuma |
| Anexo Vegetal | `anexo-vegetal` | Se escopo vegetal | Cadastro Geral |
| Anexo Animal | `anexo-animal` | Se escopo animal | Cadastro Geral |
| Anexo Cogumelo | `anexo-cogumelo` | Se cogumelos | Cadastro Geral |
| Anexo Apicultura | `anexo-apicultura` | Se apicultura | Cadastro Geral |
| Anexo Processamento | `anexo-processamento` | Se processamento | Cadastro Geral |
| Proc. Mínimo | `anexo-processamentominimo` | Se proc. mínimo | Cadastro Geral |
| Avaliação | `avaliacao` | Para avaliadores | Todos formulários preenchidos |

### Campos Obrigatórios por Formulário

#### Cadastro Geral PMO
- CPF ou CNPJ
- Nome completo
- Nome da unidade de produção
- Telefone
- E-mail
- Endereço completo
- Coordenadas GPS
- Área total
- Anos de manejo orgânico
- Pelo menos 1 responsável pela produção
- Pelo menos 1 produto a certificar
- CAR (número)
- Fonte de água
- Rastreabilidade implementada
- Croqui da propriedade (upload)
- Aceite das declarações

#### Anexos Específicos
Cada anexo possui campos obrigatórios específicos da sua atividade.

---

## 🔄 Fluxo de Trabalho

### 1. Fluxo do Produtor

```
1. Acessar Painel PMO
   ↓
2. Criar Novo PMO
   ├─→ Informar CPF/CNPJ
   ├─→ Nome da unidade
   └─→ Ano vigente
   ↓
3. Preencher Cadastro Geral
   ├─→ 17 seções
   ├─→ Selecionar escopo (Seção 7)
   └─→ Upload de documentos
   ↓
4. Preencher Anexos Específicos
   ├─→ Apenas anexos do escopo selecionado
   └─→ Acompanhar progresso
   ↓
5. Validar Formulário Completo
   ├─→ Corrigir erros
   └─→ Revisar avisos
   ↓
6. Exportar/Enviar
   ├─→ Baixar PDF
   ├─→ Exportar JSON (backup)
   └─→ Enviar para avaliação
```

### 2. Fluxo do Avaliador

```
1. Acessar Painel PMO
   ↓
2. Selecionar PMO para Avaliar
   ↓
3. Abrir Módulo de Avaliação
   ├─→ Carrega dados automaticamente
   └─→ Visualiza formulários preenchidos
   ↓
4. Preencher Avaliação
   ├─→ Checklist de verificação
   ├─→ Observações
   ├─→ Não conformidades
   └─→ Parecer técnico
   ↓
5. Definir Status
   ├─→ Aprovado
   ├─→ Aprovado com ressalvas
   ├─→ Não aprovado
   └─→ Pendente de documentação
   ↓
6. Exportar/Enviar
   ├─→ Gerar relatório de avaliação
   └─→ Notificar produtor
```

### 3. Fluxo de Edição

```
1. Abrir PMO existente no Painel
   ↓
2. Sistema carrega dados salvos
   ↓
3. Editar campos necessários
   ├─→ Auto-save a cada 30s
   └─→ Progresso atualizado em tempo real
   ↓
4. Salvar manualmente (opcional)
   ↓
5. Revalidar se necessário
```

---

## 💻 Tecnologias Utilizadas

### Frontend

#### HTML5
- Semântica moderna
- Validação nativa
- LocalStorage API
- File API
- Geolocation API

#### CSS3
- Variáveis CSS (Custom Properties)
- Flexbox e Grid Layout
- Media Queries (Responsive)
- Animações e Transições
- Print Styles

#### JavaScript (ES6+)
- Classes e Módulos
- Promises e Async/Await
- Arrow Functions
- Template Literals
- Destructuring
- Spread/Rest Operators

### Bibliotecas Externas

- **PDF-lib**: Geração e manipulação de PDFs
- **html2canvas** (futuro): Screenshots de formulários
- **jsPDF** (futuro): Geração alternativa de PDF

### APIs Externas

- **ViaCEP**: Busca de endereço por CEP
- **BrasilAPI** (planejado): Validação CNPJ
- **Google Maps API** (planejado): Mapas e validação GPS

### Backend (Planejado)

- **Node.js + Express**: Servidor HTTP
- **MongoDB**: Banco de dados NoSQL
- **JWT**: Autenticação
- **Nodemailer**: Envio de e-mails
- **AWS S3** ou **Firebase Storage**: Armazenamento de arquivos

---

## 💾 Estrutura de Armazenamento

### localStorage (Atual)

**Chaves Principais**:
```javascript
// Registry de PMOs
'pmo_registry' → {
  current_pmo_id: String,
  pmos: Array<PMO>
}

// Dados de cada PMO
'pmo_2025_12345678900_sitio_data' → {
  cadastro_geral_pmo: Object,
  anexo_vegetal: Object,
  anexo_animal: Object,
  // ... outros formulários
  documentos_anexados: Object,
  pdfs_gerados: Object
}

// Escopo de atividades
'pmo_scope_activities' → {
  pretende_certificar: Boolean,
  activities: Object,
  lastUpdated: String
}

// Progresso (legacy, migrado para registry)
'pmo_progress_{formulario}' → Number
```

**Capacidade**:
- Limite típico: 5-10MB por domínio
- Dados em formato JSON
- Arquivos em Base64 (aumenta ~33% o tamanho)

**Vantagens**:
- ✅ Funciona offline
- ✅ Sem necessidade de servidor
- ✅ Rápido e síncron
- ✅ Suportado por todos navegadores modernos

**Limitações**:
- ❌ Limite de tamanho (5-10MB)
- ❌ Dados não criptografados
- ❌ Pode ser limpo pelo usuário

### IndexedDB (Futuro)

**Para**:
- Arquivos grandes (PDFs, imagens)
- Histórico de versões
- Sincronização offline

**Capacidade**:
- Limite típico: 50MB+ (pode pedir mais ao usuário)
- Armazenamento estruturado
- Suporte a Blobs

### Backend Database (Futuro)

**MongoDB Schema**:
```javascript
{
  _id: ObjectId,
  pmo_id: String (unique),
  produtor: {
    cpf_cnpj: String,
    nome: String,
    email: String
  },
  metadata: {
    grupo_spg: String,
    ano_vigente: Number,
    versao: String,
    status: String,
    data_criacao: Date,
    data_modificacao: Date
  },
  dados: {
    cadastro_geral_pmo: Object,
    anexos: Object
  },
  documentos: [
    {
      tipo: String,
      nome: String,
      url: String, // S3/Firebase URL
      data_upload: Date
    }
  ],
  avaliacao: {
    avaliador: String,
    data: Date,
    status: String,
    parecer: String
  },
  historico: [
    {
      data: Date,
      usuario: String,
      acao: String,
      campos_alterados: Array
    }
  ]
}
```

---

## ✅ Validações e Conformidade

### Legislação Brasileira

#### Lei 10.831/2003 - Lei de Orgânicos
- Estabelece normas para produção orgânica
- Define sistemas de certificação
- Estabelece responsabilidades

#### Portaria 52/2021 MAPA - Estrutura do PMO
- Define 17 seções obrigatórias
- Estabelece informações mínimas
- Determina documentos obrigatórios

#### IN 19/2011 MAPA - Rastreabilidade
- Exige sistema de rastreabilidade
- Define registros obrigatórios
- Estabelece prazos de guarda

#### Lei 12.651/2012 - Código Florestal
- CAR obrigatório para propriedades rurais
- Proteção de APPs e Reserva Legal
- Recuperação de áreas degradadas

### Validações Automáticas

#### 1. Validação de CPF
```javascript
// Algoritmo de validação oficial
function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;

  // Verificar dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // Segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}
```

#### 2. Validação de CNPJ
```javascript
// Algoritmo de validação oficial
function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;

  // Lógica similar ao CPF com pesos diferentes
  // ... código de validação

  return true;
}
```

#### 3. Validação de Período de Conversão
```javascript
// Mínimo 12 meses sem insumos proibidos
function validatePeriodoConversao(historicoAplicacoes) {
  if (!historicoAplicacoes || historicoAplicacoes.length === 0) {
    return true; // Sem histórico = OK
  }

  const datasMaisRecentes = historicoAplicacoes
    .map(h => new Date(h.data_aplicacao))
    .sort((a, b) => b - a);

  const maisRecente = datasMaisRecentes[0];
  const hoje = new Date();
  const diffMeses = (hoje - maisRecente) / (1000 * 60 * 60 * 24 * 30);

  if (diffMeses < 12) {
    return {
      valido: false,
      erro: `Período de conversão incompleto. Faltam ${Math.ceil(12 - diffMeses)} meses.`
    };
  }

  return { valido: true };
}
```

#### 4. Validação de Coordenadas GPS
```javascript
function validateGPS(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Brasil: aproximadamente -33° a 5° latitude, -73° a -34° longitude
  if (lat < -35 || lat > 6) {
    return { valido: false, erro: 'Latitude fora dos limites do Brasil' };
  }
  if (lng < -75 || lng > -30) {
    return { valido: false, erro: 'Longitude fora dos limites do Brasil' };
  }

  return { valido: true };
}
```

### Relatório de Validação

**Estrutura**:
```javascript
{
  formulario: "cadastro-geral-pmo",
  valido: false,
  percentual_preenchimento: 85,
  erros: [
    {
      secao: "1. Identificação",
      campo: "cpf_cnpj",
      mensagem: "CPF inválido",
      tipo: "erro"
    },
    {
      secao: "16. Upload",
      campo: "croqui",
      mensagem: "Croqui da propriedade é obrigatório",
      tipo: "erro"
    }
  ],
  avisos: [
    {
      secao: "10. Preservação Ambiental",
      campo: "car",
      mensagem: "CAR não anexado. É obrigatório por lei.",
      tipo: "aviso"
    },
    {
      secao: "8. Histórico",
      campo: "aplicacoes",
      mensagem: "Período de conversão ainda em andamento (faltam 3 meses)",
      tipo: "aviso"
    }
  ],
  campos_obrigatorios: {
    total: 45,
    preenchidos: 38,
    faltantes: 7
  }
}
```

---

## 📖 Guia de Uso

### Para Produtores

#### Primeiro Acesso

1. **Abrir o sistema**
   - Navegue para `index.html`
   - Clique em "Acessar Painel PMO"

2. **Criar primeiro PMO**
   - Clique em "➕ Novo PMO"
   - Preencha:
     - CPF ou CNPJ
     - Nome completo
     - Nome da unidade de produção
     - Ano vigente (padrão: ano atual)
     - Grupo SPG (se aplicável)

3. **Preencher Cadastro Geral**
   - Sistema abre automaticamente
   - Preencha as 17 seções sequencialmente
   - Atenção à **Seção 7** (Escopo): define quais anexos você precisará preencher
   - Sistema salva automaticamente a cada 30 segundos

4. **Upload de Documentos** (Seção 16)
   - Arraste arquivos para a área de upload OU
   - Clique para selecionar
   - **Obrigatório**: Croqui da propriedade
   - **Recomendado**: CAR, análises de solo/água

5. **Aceitar Declarações** (Seção 17)
   - Leia atentamente
   - Marque todas as checkboxes obrigatórias

6. **Preencher Anexos Específicos**
   - Navegue pelo menu lateral
   - Só aparecem anexos do seu escopo
   - Preencha conforme sua produção

7. **Validar Formulário**
   - Clique em "✓ Validar Formulário"
   - Corrija todos **erros** (❌)
   - Revise **avisos** (⚠️)

8. **Exportar/Enviar**
   - "📥 Exportar JSON": Backup completo
   - "📄 Exportar PDF": Documento formatado
   - "✉️ Enviar PMO": Submete para avaliação

#### Editar PMO Existente

1. **Abrir Painel**
2. **Localizar PMO**
   - Use busca por nome, CPF ou unidade
   - Ou use filtros (grupo, ano, status)
3. **Clicar em "Editar"**
4. **Fazer alterações**
   - Auto-save continua funcionando
5. **Salvar manualmente** (opcional)
   - Clique em "💾 Salvar Rascunho"

#### Gerenciar Múltiplos PMOs

- **Criar novo**: ➕ Novo PMO
- **Alternar entre PMOs**: Clique em "Editar" no card desejado
- **Visualizar progresso**: Veja percentual em cada card
- **Filtrar**: Por grupo, ano, status
- **Buscar**: Digite nome, CPF ou unidade

### Para Avaliadores

#### Avaliar PMO

1. **Abrir Painel**
2. **Localizar PMO para avaliar**
   - Filtre por status: "Completo"
3. **Clicar em "Avaliar"**
   - Abre módulo de avaliação
   - Dados do PMO carregados automaticamente

4. **Preencher Avaliação**
   - **Checklist de Verificação**:
     - Conformidade com legislação
     - Completude de informações
     - Coerência de dados
     - Documentação anexada

   - **Observações Gerais**
   - **Pontos Fortes**
   - **Não Conformidades** (se houver)
   - **Recomendações**
   - **Parecer Técnico**

5. **Definir Status**
   - ✅ Aprovado
   - ⚠️ Aprovado com ressalvas
   - ❌ Não aprovado
   - ⏳ Pendente de documentação

6. **Salvar Avaliação**
7. **Exportar Relatório** (opcional)

#### Visualizar Dados do PMO

- Todos formulários ficam visíveis no modo leitura
- Navegue pelas seções usando menu lateral
- Veja documentos anexados
- Verifique histórico de alterações (futuro)

### Para Administradores

#### Configurações do Sistema

**Variáveis CSS** (em `framework/styles/_variables.css`):
```css
:root {
  --primary: #2E7D32;         /* Cor primária */
  --secondary: #558B2F;       /* Cor secundária */
  --success: #66BB6A;         /* Sucesso */
  --error: #E57373;           /* Erro */
  --warning: #FFB74D;         /* Aviso */
  --info: #64B5F6;            /* Info */

  --spacing-md: 16px;         /* Espaçamento padrão */
  --radius-md: 8px;           /* Bordas arredondadas */
  --shadow-md: 0 2px 8px rgba(0,0,0,0.1); /* Sombra */
}
```

**Configurações JS** (em `config/app.config.js`):
```javascript
{
  sistema: {
    nome: "Sistema PMO Digital - ANC",
    versao: "1.0.0",
    grupo_padrao: "ANC"
  },
  autosave: {
    intervalo: 30000, // 30 segundos
    ativo: true
  },
  validacao: {
    modo: "completo", // "completo" ou "basico"
    bloquear_envio_com_erros: true
  },
  upload: {
    tamanho_maximo: 10485760, // 10MB em bytes
    formatos_permitidos: ['pdf', 'jpg', 'jpeg', 'png']
  }
}
```

#### Gerenciar Usuários (Futuro)

- Criar/editar usuários
- Definir permissões (produtor/avaliador/admin)
- Resetar senhas
- Auditar ações

#### Relatórios do Sistema (Futuro)

- Total de PMOs por período
- Taxa de aprovação
- Tempo médio de preenchimento
- Formulários mais problemáticos
- Produtores por grupo SPG

---

## 🔒 Segurança e Privacidade

### Dados Locais

#### Armazenamento no Navegador
- **localStorage**: Dados em texto puro (JSON)
- **Não criptografado**: Qualquer script no domínio pode acessar
- **Risco**: Se computador for comprometido, dados podem ser lidos

#### Recomendações
1. **Não usar em computadores públicos**
2. **Fazer logout** em computadores compartilhados
3. **Backup regular** via exportação JSON
4. **Limpar dados** ao desinstalar

### Dados no Backend (Futuro)

#### Autenticação
- **JWT (JSON Web Tokens)**
- **Senha hash** com bcrypt (custo 12)
- **Expiração de sessão**: 2 horas de inatividade
- **2FA** (autenticação de dois fatores) - opcional

#### Autorização
- **RBAC** (Role-Based Access Control):
  - `produtor`: Pode criar e editar seus PMOs
  - `avaliador`: Pode visualizar e avaliar PMOs
  - `admin`: Acesso total

#### Criptografia
- **Em trânsito**: HTTPS (TLS 1.3)
- **Em repouso**: Criptografia de disco no servidor
- **Dados sensíveis**: Criptografia adicional (AES-256)

#### Conformidade LGPD

1. **Consentimento**
   - Termo de aceite explícito
   - Finalidade clara dos dados

2. **Direitos do Titular**
   - Acesso aos dados
   - Correção de dados
   - Exclusão de dados (direito ao esquecimento)
   - Portabilidade de dados

3. **Minimização de Dados**
   - Coletar apenas o necessário
   - Reter apenas pelo tempo necessário

4. **Segurança**
   - Controles de acesso
   - Logs de auditoria
   - Backup e recuperação

### Backup e Recuperação

#### Backup Local (Manual)
1. Exportar JSON de cada PMO
2. Salvar em local seguro
3. Periodicidade recomendada: Semanal

#### Backup Automático (Futuro)
- **Cloud sync**: Google Drive, Dropbox, OneDrive
- **Frequência**: Diária
- **Versionamento**: Últimas 30 versões
- **Criptografia**: Antes de enviar para nuvem

---

## 🚀 Roadmap e Melhorias Futuras

### Curto Prazo (1-3 meses)

#### 1. Backend REST API
- [ ] Servidor Node.js + Express
- [ ] Banco de dados MongoDB
- [ ] Autenticação JWT
- [ ] API endpoints CRUD para PMOs

#### 2. Sincronização Cloud
- [ ] Upload/download automático
- [ ] Resolução de conflitos
- [ ] Trabalho offline com sync posterior

#### 3. Geração de PDF Melhorada
- [ ] Template oficial da ANC
- [ ] Assinatura digital
- [ ] QR Code de validação
- [ ] Marca d'água para rascunhos

#### 4. Notificações
- [ ] E-mail quando PMO é avaliado
- [ ] Lembrete de renovação anual
- [ ] Alertas de documentos vencidos

### Médio Prazo (3-6 meses)

#### 5. Módulo de Relatórios Avançado
- [ ] Dashboard de indicadores
- [ ] Gráficos interativos (Chart.js)
- [ ] Exportação de relatórios gerenciais
- [ ] Comparativos entre períodos

#### 6. Integração com Sistemas Externos
- [ ] API Receita Federal (validação CNPJ)
- [ ] API SICAR (validação CAR)
- [ ] Google Maps (validação GPS)
- [ ] Integração com sistema de rastreabilidade

#### 7. Versionamento de PMOs
- [ ] Histórico de alterações
- [ ] Comparação entre versões
- [ ] Reverter para versão anterior
- [ ] Auditoria completa

#### 8. Mobile App
- [ ] PWA (Progressive Web App)
- [ ] Instalável no smartphone
- [ ] Câmera para scan de documentos
- [ ] GPS para coordenadas automáticas
- [ ] Funciona offline

### Longo Prazo (6-12 meses)

#### 9. Inteligência Artificial
- [ ] Preenchimento automático via OCR
- [ ] Sugestões de melhoria
- [ ] Detecção de inconsistências
- [ ] Chatbot de ajuda

#### 10. Marketplace de Insumos
- [ ] Catálogo de insumos permitidos
- [ ] Fornecedores certificados
- [ ] Comparação de preços
- [ ] Pedidos diretos

#### 11. Sistema de Visitas
- [ ] Agendamento de visitas de verificação
- [ ] Checklist digital para avaliadores
- [ ] Fotos georreferenciadas
- [ ] Assinatura digital in loco

#### 12. Comunidade e Suporte
- [ ] Fórum de produtores
- [ ] Base de conhecimento
- [ ] Tutoriais em vídeo
- [ ] Webinars periódicos

### Recursos Adicionais Planejados

#### 13. Multilíngue
- [ ] Português (✅ já implementado)
- [ ] Espanhol
- [ ] Inglês

#### 14. Acessibilidade
- [ ] Modo alto contraste
- [ ] Tamanho de fonte ajustável
- [ ] Navegação por voz
- [ ] Compatibilidade total com screen readers

#### 15. Gamificação
- [ ] Badges por conquistas
- [ ] Ranking de melhores práticas
- [ ] Pontos por conclusão de etapas
- [ ] Incentivos para renovação

---

## 📞 Suporte e Contato

### Documentação

- **README Principal**: `README.md`
- **Framework**: `framework/README.md`
- **Formulários Individuais**: Cada pasta tem seu `README.md`
- **Adaptação**: `pmo/ADAPTACAO-FORMULARIOS.md`

### Contato ANC

- **Website**: [www.anc.org.br](https://www.anc.org.br)
- **E-mail**: contato@anc.org.br
- **Telefone**: (19) XXXX-XXXX
- **Endereço**: Campinas, SP

### Reportar Bugs

1. Verificar se já não foi reportado
2. Coletar informações:
   - Navegador e versão
   - Sistema operacional
   - Passos para reproduzir
   - Screenshots (se aplicável)
3. Abrir issue no repositório

### Solicitar Funcionalidades

1. Descrever caso de uso
2. Explicar benefício esperado
3. Sugerir implementação (se possível)

---

## 📄 Licença

**Desenvolvido para**:
**ANC - Associação de Agricultura Natural de Campinas e Região**

**Versão**: 1.0.0
**Última atualização**: 30 de Janeiro de 2025
**Autor**: Sistema desenvolvido com assistência de IA (Claude Code)

---

## 📚 Glossário

**ANC**: Associação de Agricultura Natural de Campinas e Região

**APP**: Área de Preservação Permanente

**CAF**: Cadastro de Agricultor Familiar

**CAR**: Cadastro Ambiental Rural

**CPF**: Cadastro de Pessoa Física

**CNPJ**: Cadastro Nacional de Pessoa Jurídica

**IN**: Instrução Normativa

**LGPD**: Lei Geral de Proteção de Dados

**MAPA**: Ministério da Agricultura, Pecuária e Abastecimento

**OCS**: Organização de Controle Social

**OPAC**: Organismo Participativo de Avaliação da Conformidade

**PMO**: Plano de Manejo Orgânico

**PPHO**: Procedimentos Padrão de Higiene Operacional

**SPG**: Sistema Participativo de Garantia

**UI**: User Interface (Interface do Usuário)

**UX**: User Experience (Experiência do Usuário)

---

## 🎓 Referências e Legislação

### Legislação Brasileira

1. **Lei 10.831/2003** - Lei de Orgânicos
   - Dispõe sobre a agricultura orgânica

2. **Decreto 6.323/2007** - Regulamenta a Lei de Orgânicos
   - Estabelece SPG, OCS, OPAC

3. **Portaria 52/2021 MAPA** - Plano de Manejo Orgânico
   - Define estrutura e conteúdo do PMO

4. **IN 19/2011 MAPA** - Rastreabilidade
   - Estabelece mecanismos de rastreabilidade

5. **Lei 12.651/2012** - Código Florestal
   - CAR obrigatório

6. **Lei 13.709/2018** - LGPD
   - Proteção de dados pessoais

### Normas Técnicas

- **ABNT NBR 16850** - Orgânicos: Controle Social
- **Codex Alimentarius** - Diretrizes internacionais

### Recursos Online

- [Portal MAPA](https://www.gov.br/agricultura)
- [Cadastro Nacional de Produtores Orgânicos](https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos/cadastro-nacional-produtores-organicos)

---

**FIM DA DOCUMENTAÇÃO**

*Este documento é vivo e será atualizado conforme o sistema evolui.*
