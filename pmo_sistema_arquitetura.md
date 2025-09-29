# 📋 Sistema PMO - Arquitetura e Estrutura de Arquivos

## 🏗️ ARQUITETURA GERAL DO SISTEMA

```
PMO-SYSTEM/
│
├── 📁 framework/                    # Framework unificado (Core do sistema)
├── 📁 modules/                      # Módulos principais do PMO
├── 📁 assets/                       # Recursos estáticos
├── 📁 database/                     # Estrutura de dados
├── 📁 api/                          # Backend/Integrações
├── 📁 config/                       # Configurações
├── 📁 docs/                         # Documentação
├── 📁 tests/                        # Testes automatizados
└── 📁 dist/                         # Build de produção
```

---

## 📂 ESTRUTURA DETALHADA DE ARQUIVOS

### 1️⃣ **FRAMEWORK/** (Sistema Core Reutilizável)

```
framework/
│
├── core/
│   ├── pmo-framework.css            # CSS unificado do design system
│   ├── pmo-framework.js             # JavaScript do framework
│   ├── pmo-framework.min.css        # Versão minificada CSS
│   └── pmo-framework.min.js         # Versão minificada JS
│
├── components/
│   ├── validators.js                # Validadores (CPF, CNPJ, CEP, etc)
│   ├── dynamic-fields.js            # Campos dinâmicos
│   ├── tables.js                    # Tabelas dinâmicas
│   ├── upload.js                    # Sistema de upload
│   ├── storage.js                   # Auto-save e localStorage
│   ├── progress.js                  # Barra de progresso
│   ├── export.js                    # Exportação (JSON, PDF, CSV)
│   ├── import.js                    # Importação JSON
│   ├── navigation.js                # Sistema de navegação
│   └── notifications.js             # Sistema de mensagens
│
├── styles/
│   ├── _variables.css               # Variáveis CSS (cores, espaçamentos)
│   ├── _base.css                    # Reset e estilos base
│   ├── _components.css              # Estilos de componentes
│   ├── _utilities.css               # Classes utilitárias
│   ├── _responsive.css              # Media queries
│   └── _print.css                   # Estilos para impressão
│
└── utils/
    ├── api-client.js                 # Cliente para APIs externas
    ├── date-helpers.js               # Funções de data
    ├── formatters.js                 # Formatadores de dados
    └── constants.js                  # Constantes do sistema
```

### 2️⃣ **MODULES/** (Módulos do PMO)

```
modules/
│
├── 📁 dashboard/
│   ├── index.html                   # Página inicial/Dashboard
│   ├── dashboard.js                 # Lógica do dashboard
│   └── dashboard.css                # Estilos específicos
│
├── 📁 pmo-principal/
│   ├── index.html                   # Formulário PMO Principal
│   ├── pmo-principal.js             # Lógica específica
│   ├── sections/
│   │   ├── dados-fornecedores.html  # Seção 1
│   │   ├── dados-empresa.html       # Seção 2
│   │   ├── endereco-unidade.html    # Seção 3
│   │   ├── propriedade.html         # Seção 4
│   │   ├── historico.html           # Seção 5
│   │   ├── produtos.html            # Seção 6
│   │   ├── comercializacao.html     # Seção 7
│   │   └── declaracoes.html         # Seção 8
│   └── validation-rules.js          # Regras de validação específicas
│
├── 📁 anexo-vegetal/
│   ├── index.html                   # Anexo Produção Vegetal
│   ├── vegetal.js                   # Lógica específica
│   ├── sections/
│   │   ├── preparo-solo.html
│   │   ├── praticas-conserv.html
│   │   ├── barreiras-riscos.html
│   │   ├── adubacao.html
│   │   ├── substrato.html
│   │   ├── receitas.html
│   │   ├── produtos-comerciais.html
│   │   └── equipamentos.html
│   └── vegetal-validators.js
│
├── 📁 anexo-animal/
│   ├── index.html                   # Anexo Produção Animal
│   ├── animal.js
│   ├── sections/
│   │   ├── especies.html
│   │   ├── alimentacao.html
│   │   ├── bem-estar.html
│   │   ├── sanidade.html
│   │   ├── instalacoes.html
│   │   └── manejo-esterco.html
│   └── animal-validators.js
│
├── 📁 anexo-cogumelos/
│   ├── index.html                   # Anexo Cogumelos
│   ├── cogumelos.js
│   ├── sections/
│   │   ├── tipos-cogumelos.html
│   │   ├── substrato.html
│   │   ├── inoculo.html
│   │   ├── ambiente-cultivo.html
│   │   ├── controle-pragas.html
│   │   └── colheita.html
│   └── cogumelos-validators.js
│
├── 📁 anexo-apicultura/
│   ├── index.html                   # Anexo Apicultura
│   ├── apicultura.js
│   ├── sections/
│   │   ├── colmeias.html
│   │   ├── floradas.html
│   │   ├── alimentacao.html
│   │   ├── sanidade.html
│   │   └── produtos-mel.html
│   └── apicultura-validators.js
│
├── 📁 anexo-processamento/
│   ├── index.html                   # Anexo Processamento
│   ├── processamento.js
│   ├── sections/
│   │   ├── dados-empresa.html
│   │   ├── situacao-legal.html
│   │   ├── produtos.html
│   │   ├── fornecedores.html
│   │   ├── higienizacao.html
│   │   └── controles.html
│   └── processamento-validators.js
│
├── 📁 anexo-processamento-minimo/
│   ├── index.html                   # Anexo Processamento Mínimo
│   ├── proc-minimo.js
│   └── proc-minimo-validators.js
│
└── 📁 relatorios/
    ├── index.html                   # Central de Relatórios
    ├── visualizar.html              # Visualização completa
    ├── exportar.html                # Exportação
    ├── importar.html                # Importação JSON
    └── relatorios.js                # Lógica de relatórios
```

### 3️⃣ **ASSETS/** (Recursos Estáticos)

```
assets/
│
├── images/
│   ├── logo-anc.png                # Logo da ANC
│   ├── selo-organico.svg           # Selo de certificação
│   └── icons/                      # Ícones do sistema
│       ├── vegetal.svg
│       ├── animal.svg
│       ├── cogumelos.svg
│       └── ...
│
├── fonts/
│   ├── Inter-Regular.woff2         # Fonte principal
│   ├── Inter-Bold.woff2
│   └── Inter-Light.woff2
│
├── templates/
│   ├── pmo-template-hortalicas.json
│   ├── pmo-template-frutas.json
│   ├── pmo-template-cogumelos.json
│   └── pmo-template-apicultura.json
│
└── data/
    ├── municipios-sp.json          # Lista de municípios
    ├── produtos-organicos.json     # Base de produtos
    ├── insumos-permitidos.json     # Lista MAPA
    └── grupos-spg.json              # Grupos SPG cadastrados
```

### 4️⃣ **DATABASE/** (Estrutura de Dados)

```
database/
│
├── schemas/
│   ├── pmo-principal.schema.json   # Schema do PMO principal
│   ├── anexo-vegetal.schema.json   # Schema anexo vegetal
│   ├── anexo-animal.schema.json    # Schema anexo animal
│   └── ...
│
├── migrations/
│   ├── 001_initial_structure.sql
│   ├── 002_add_anexos.sql
│   └── ...
│
└── seeds/
    ├── sample-data.json            # Dados de exemplo
    └── test-data.json              # Dados para testes
```

### 5️⃣ **API/** (Backend e Integrações)

```
api/
│
├── endpoints/
│   ├── auth.js                     # Autenticação
│   ├── pmo.js                      # CRUD PMO
│   ├── validation.js               # Validações server-side
│   ├── export.js                   # Geração de PDFs
│   └── sync.js                     # Sincronização
│
├── services/
│   ├── cep-service.js              # Integração ViaCEP
│   ├── receita-service.js          # Validação Receita Federal
│   ├── pdf-generator.js            # Geração de PDF
│   └── email-service.js            # Envio de emails
│
└── middleware/
    ├── auth-middleware.js           # Autenticação
    ├── validation-middleware.js     # Validação
    └── error-handler.js             # Tratamento de erros
```

### 6️⃣ **CONFIG/** (Configurações)

```
config/
│
├── app.config.js                   # Configurações da aplicação
├── routes.config.js                # Rotas e navegação
├── validation.config.js            # Regras de validação
├── storage.config.js               # Configurações de armazenamento
└── env/
    ├── development.env              # Ambiente desenvolvimento
    ├── production.env               # Ambiente produção
    └── staging.env                  # Ambiente staging
```

### 7️⃣ **DOCS/** (Documentação)

```
docs/
│
├── 📁 user-guide/
│   ├── 01-introducao.md
│   ├── 02-cadastro-inicial.md
│   ├── 03-pmo-principal.md
│   ├── 04-anexos.md
│   └── 05-exportacao.md
│
├── 📁 technical/
│   ├── architecture.md             # Arquitetura do sistema
│   ├── api-reference.md            # Referência da API
│   ├── component-library.md        # Biblioteca de componentes
│   └── deployment.md               # Guia de implantação
│
└── 📁 legal/
    ├── portaria-52-2021.pdf        # Legislação MAPA
    ├── lei-10831-2003.pdf          # Lei orgânicos
    └── normas-opac.pdf             # Normas OPAC
```

### 8️⃣ **TESTS/** (Testes)

```
tests/
│
├── unit/
│   ├── validators.test.js          # Testes de validadores
│   ├── components.test.js          # Testes de componentes
│   └── ...
│
├── integration/
│   ├── form-submission.test.js     # Teste de envio
│   ├── data-persistence.test.js    # Teste de persistência
│   └── ...
│
└── e2e/
    ├── complete-flow.test.js       # Fluxo completo
    └── ...
```

---

## 🔄 FLUXO DE NAVEGAÇÃO HIERÁRQUICA

### **Menu Principal (index.html)**

```
Sistema PMO - ANC
│
├── 🏠 Dashboard
│   ├── Resumo Geral
│   ├── PMOs em Andamento
│   ├── PMOs Finalizados
│   └── Alertas e Notificações
│
├── 📋 PMO Principal [OBRIGATÓRIO]
│   ├── 1. Dados dos Fornecedores
│   ├── 2. Dados da Empresa/Produtor
│   ├── 3. Endereço da Unidade
│   ├── 4. Croqui da Propriedade
│   ├── 5. Histórico da Área
│   ├── 6. Lista de Produtos
│   ├── 7. Comercialização
│   └── 8. Declarações
│
├── 📦 Anexos de Produção
│   ├── 🌱 Anexo I - Produção Vegetal
│   │   ├── Preparo do Solo
│   │   ├── Práticas Conservacionistas
│   │   ├── Adubação e Nutrição
│   │   ├── Controle de Pragas
│   │   └── Produtos e Insumos
│   │
│   ├── 🐄 Anexo III - Produção Animal
│   │   ├── Espécies Criadas
│   │   ├── Alimentação
│   │   ├── Bem-estar Animal
│   │   ├── Manejo Sanitário
│   │   └── Instalações
│   │
│   ├── 🍄 Anexo II - Cogumelos
│   │   ├── Tipos de Cogumelos
│   │   ├── Substrato
│   │   ├── Inóculo
│   │   ├── Ambiente de Cultivo
│   │   └── Controle de Contaminação
│   │
│   └── 🐝 Anexo IV - Apicultura
│       ├── Colmeias e Apiários
│       ├── Floradas
│       ├── Alimentação Artificial
│       ├── Sanidade
│       └── Produtos Apícolas
│
├── 🏭 Anexos de Processamento
│   ├── Processamento Completo
│   │   ├── Dados da Empresa
│   │   ├── Situação Legal
│   │   ├── Produtos Processados
│   │   └── Controles de Qualidade
│   │
│   └── Processamento Mínimo
│       ├── Operações Realizadas
│       ├── Higienização
│       └── Rastreabilidade
│
└── 📊 Relatórios e Exportação
    ├── Visualizar PMO Completo
    ├── Validar Formulário
    ├── Exportar
    │   ├── PDF Completo
    │   ├── JSON (Backup)
    │   └── CSV (Dados)
    ├── Importar JSON
    └── Enviar para Certificação
```

---

## 💾 ESTRUTURA DE DADOS (JSON)

### **Arquivo PMO Completo (pmo-completo.json)**

```json
{
  "metadata": {
    "versao": "2.0",
    "data_criacao": "2024-01-15",
    "ultima_atualizacao": "2024-01-20",
    "status": "em_andamento",
    "progresso_total": 65
  },
  
  "pmo_principal": {
    "dados_fornecedores": [],
    "dados_empresa": {},
    "endereco": {},
    "propriedade": {},
    "historico": {},
    "produtos": [],
    "comercializacao": {},
    "declaracoes": {}
  },
  
  "anexos": {
    "vegetal": {
      "ativo": true,
      "progresso": 80,
      "dados": {}
    },
    "animal": {
      "ativo": false,
      "progresso": 0,
      "dados": null
    },
    "cogumelos": {
      "ativo": true,
      "progresso": 45,
      "dados": {}
    },
    "apicultura": {
      "ativo": false,
      "progresso": 0,
      "dados": null
    },
    "processamento": {
      "ativo": false,
      "progresso": 0,
      "dados": null
    },
    "processamento_minimo": {
      "ativo": true,
      "progresso": 100,
      "dados": {}
    }
  },
  
  "documentos": {
    "croqui": [],
    "car": [],
    "analises": [],
    "certificados": [],
    "outros": []
  },
  
  "validacao": {
    "erros": [],
    "avisos": [],
    "aprovado": false
  }
}
```

---

## 🚀 COMANDOS DE BUILD E DEPLOY

### **Package.json**

```json
{
  "name": "pmo-system",
  "version": "2.0.0",
  "scripts": {
    "dev": "Servidor desenvolvimento",
    "build": "Build produção",
    "test": "Executar testes",
    "deploy": "Deploy para produção",
    "backup": "Backup dos dados",
    "restore": "Restaurar backup"
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Framework Base**
- [ ] Implementar CSS unificado
- [ ] Implementar JavaScript core
- [ ] Criar componentes reutilizáveis
- [ ] Sistema de validação
- [ ] Sistema de navegação

### **Fase 2: PMO Principal**
- [ ] Formulário principal
- [ ] Todas as seções
- [ ] Upload de croqui
- [ ] Validações específicas

### **Fase 3: Anexos**
- [ ] Anexo Produção Vegetal
- [ ] Anexo Produção Animal
- [ ] Anexo Cogumelos
- [ ] Anexo Apicultura
- [ ] Anexo Processamento
- [ ] Anexo Processamento Mínimo

### **Fase 4: Integrações**
- [ ] API ViaCEP
- [ ] Gerador de PDF
- [ ] Sistema de backup
- [ ] Sincronização online

### **Fase 5: Testes e Deploy**
- [ ] Testes unitários
- [ ] Testes integração
- [ ] Deploy staging
- [ ] Deploy produção

---

## 🔐 SEGURANÇA E PERMISSÕES

### **Níveis de Acesso**

```
ADMINISTRADOR
├── Acesso total
├── Gerenciar usuários
├── Aprovar PMOs
└── Configurações sistema

TÉCNICO/CONSULTOR
├── Visualizar múltiplos PMOs
├── Editar PMOs atribuídos
├── Gerar relatórios
└── Validar formulários

PRODUTOR
├── Editar próprio PMO
├── Visualizar próprio histórico
├── Exportar dados
└── Enviar para certificação

VISITANTE
└── Visualizar demonstração
```

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **Modularidade**: Cada anexo é independente mas compartilha o framework base
2. **Escalabilidade**: Fácil adicionar novos anexos seguindo o padrão
3. **Manutenibilidade**: Código organizado por funcionalidade
4. **Performance**: Assets minificados, lazy loading de anexos
5. **Offline-first**: LocalStorage + Service Workers
6. **Responsividade**: Mobile, tablet e desktop
7. **Acessibilidade**: WCAG 2.1 AA compliance
8. **Versionamento**: Git com branches para cada módulo