# Sistema PMO - ANC (Plano de Manejo Orgânico)

## Visão Geral
Sistema web para gerenciamento de Planos de Manejo Orgânico (PMO) da Associação de Agricultura Natural de Campinas e Região (ANC). O sistema permite cadastro, validação e exportação de PMOs conforme legislação MAPA (Portaria 52/2021).

**🌐 Hospedagem: GitHub Pages (Site Estático)**
- Sistema 100% client-side (HTML, CSS, JavaScript)
- Sem necessidade de servidor backend
- Dados armazenados localmente no navegador (localStorage)
- Deploy automático via GitHub Actions

## Arquitetura do Sistema

### Estrutura de Diretórios (GitHub Pages)
```
PMO-SYSTEM/
├── framework/          # Framework unificado (Core)
├── pmo/               # Módulos principais do PMO
├── assets/            # Recursos estáticos
├── database/          # Estrutura de dados e schemas (JSON client-side)
├── config/            # Configurações (JavaScript modules)
├── tests/             # Testes automatizados
├── dist/              # Build de produção (servido pelo GitHub Pages)
├── .github/           # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml # Deploy automático para GitHub Pages
└── index.html         # Página inicial (ponto de entrada)
```

**⚠️ Nota sobre API**: A pasta `api/` contém apenas código de referência para integrações client-side. Não há servidor backend nesta versão estática.

## Módulos Principais

### 1. Framework Core (`framework/`)
Sistema reutilizável com componentes base:

- **core/**: CSS e JS unificado do design system
- **components/**: Validadores, campos dinâmicos, tabelas, upload, storage, exportação
- **styles/**: Variáveis CSS, base, componentes, utilitários, responsive, print
- **utils/**: API client, helpers de data, formatadores, constantes

### 2. Módulos ANC (`anc/`)
Aplicações específicas do PMO:

- **dashboard/**: Página inicial com resumo de PMOs
- **pmo-principal/**: Formulário PMO Principal (obrigatório)
- **anexo-vegetal/**: Anexo I - Produção Vegetal
- **relatorios/**: Visualização, exportação e importação

### 3. Schemas de Dados (`database/schemas/`)

#### PMO Principal
- Dados dos fornecedores
- Dados da empresa/produtor
- Endereço da unidade
- Histórico da área
- Lista de produtos
- Comercialização
- Declarações

#### Anexo Vegetal (`anexo-vegetal.schema.json`)
- Preparo do solo
- Práticas conservacionistas
- Barreiras de proteção
- Adubação e nutrição
- Substratos e receitas
- Produtos comerciais
- Equipamentos e armazenamento

#### Anexo Animal (`anexo-animal.schema.json`)
- Inspeção sanitária
- Espécies criadas
- Alimentação (ração, pastagem, forragens)
- Bem-estar animal
- Manejo sanitário
- Vacinação
- Reprodução
- Instalações
- Rastreabilidade

### 4. Serviços Client-Side (`framework/utils/`)
**Nota**: Como este é um site estático (GitHub Pages), não há API backend. Todas as operações são realizadas no navegador:

- **api-client.js**: Cliente para APIs externas (ViaCEP, BrasilAPI)
- **cep-service.js**: Busca de endereços via ViaCEP
- **cnpj-validator.js**: Validação algorítmica de CNPJ
- **pdf-generator.js**: Geração de PDF usando jsPDF
- **export-service.js**: Exportação JSON/CSV no browser
- **storage-service.js**: Gerenciamento de localStorage/IndexedDB

## Fluxo de Navegação

### Menu Principal
```
🏠 Dashboard
  ├── Resumo Geral
  ├── PMOs em Andamento
  ├── PMOs Finalizados
  └── Alertas e Notificações

📋 PMO Principal [OBRIGATÓRIO]
  ├── 1. Dados dos Fornecedores
  ├── 2. Dados da Empresa/Produtor
  ├── 3. Endereço da Unidade
  ├── 4. Croqui da Propriedade
  ├── 5. Histórico da Área
  ├── 6. Lista de Produtos
  ├── 7. Comercialização
  └── 8. Declarações

📦 Anexos de Produção
  ├── 🌱 Anexo I - Produção Vegetal
  ├── 🐄 Anexo III - Produção Animal
  ├── 🍄 Anexo II - Cogumelos
  └── 🐝 Anexo IV - Apicultura

🏭 Anexos de Processamento
  ├── Processamento Completo
  └── Processamento Mínimo

📊 Relatórios e Exportação
  ├── Visualizar PMO Completo
  ├── Validar Formulário
  ├── Exportar (PDF, JSON, CSV)
  ├── Importar JSON
  └── Enviar para Certificação
```

## Funcionalidades Principais

### Validação (Client-Side)
- Validadores de CPF, CNPJ, CEP (algoritmos JavaScript)
- Validação de campos obrigatórios em tempo real
- Regras de negócio específicas por módulo
- Validação de schema JSON usando JSON Schema
- Feedback visual imediato ao usuário

### Auto-save
- Salvamento automático em localStorage
- Recuperação de dados em caso de perda de sessão
- Indicador de progresso de preenchimento

### Exportação
- **PDF**: Documento completo formatado
- **JSON**: Backup estruturado dos dados
- **CSV**: Dados tabulares para análise

### Importação
- Carregamento de PMO via JSON
- Validação de schema na importação
- Mesclagem de dados

### Upload (Client-Side)
- Upload de documentos (croqui, CAR, análises)
- Arquivos convertidos para Base64 e armazenados no localStorage/IndexedDB
- Suporte a imagens (PNG, JPG) e PDFs
- Validação de tipo e tamanho (limite: 5MB por arquivo)
- **Limitação**: Dados permanecem apenas no navegador local

### Campos Dinâmicos
- Adição/remoção de linhas em tabelas
- Campos condicionais baseados em seleção
- Templates pré-configurados

## Estrutura de Dados JSON

### Metadata
```json
{
  "metadata": {
    "versao": "2.0",
    "data_criacao": "2024-01-15",
    "ultima_atualizacao": "2024-01-20",
    "status": "em_andamento",
    "progresso_total": 65
  }
}
```

### Status do PMO
```json
{
  "pmo_principal": {
    "id_pmo": "PMO-2024-001",
    "fase_atual": "validação de documentos",
    "status": "parcial",
    "progresso": 65,
    "escopos_ativos": [
      {"sigla": "PPV", "nome": "Produção vegetal", "progresso": 80}
    ]
  }
}
```

### Validação
```json
{
  "validacao": {
    "campos_obrigatorios_completos": false,
    "possui_erros": false,
    "erros": [],
    "avisos": [],
    "percentual_preenchimento": 65
  }
}
```

## Tecnologias (GitHub Pages - Site Estático)

### Frontend
- **HTML5** semântico
- **CSS3** com variáveis customizáveis
- **JavaScript vanilla (ES6+)** - Sem frameworks pesados
- Design system unificado
- **SPA (Single Page Application)** - Navegação sem recarregar página

### Armazenamento (Client-Side)
- **localStorage**: Persistência local dos dados do PMO
- **IndexedDB**: (opcional) Para armazenar documentos/imagens maiores
- **JSON**: Formato de intercâmbio e backup
- Schemas JSON para validação de dados no browser

### APIs Externas (CORS-friendly)
- **ViaCEP**: Busca de endereços (https://viacep.com.br)
- **BrasilAPI**: Validação de CNPJ, CEP (https://brasilapi.com.br)
- APIs públicas com suporte CORS para integração client-side

### Ferramentas de Build (Opcional)
- **Vite** ou **Parcel**: Bundler leve para otimização
- **PostCSS**: Otimização e autoprefixer CSS
- **Terser**: Minificação de JavaScript
- **GitHub Actions**: CI/CD automatizado

### Exportação (Client-Side)
- **jsPDF**: Geração de PDF no browser
- **html2canvas**: Captura de telas para PDF
- **FileSaver.js**: Download de arquivos JSON/CSV
- **PapaParse**: Conversão para CSV

## Regras de Negócio

### PMO Principal
- Obrigatório para todos os produtores
- Deve ser preenchido antes dos anexos
- Informações básicas sobre a unidade de produção

### Anexos
- Condicionais baseados no tipo de produção
- Vegetal: obrigatório para produção de hortaliças, frutas, grãos
- Animal: obrigatório para criação de animais
- Múltiplos anexos podem ser ativos simultaneamente

### Validação
- Campos obrigatórios por tipo de anexo
- Validação de formatos (CPF, CNPJ, CEP, email)
- Regras específicas da legislação MAPA
- Avisos para campos recomendados

### Progresso
- Calculado por seção e total
- Baseado em campos obrigatórios preenchidos
- Indicador visual em tempo real

## Configuração (GitHub Pages)

### Desenvolvimento Local
```javascript
// config/app.config.js
export const CONFIG = {
  MODE: 'development',
  STORAGE_TYPE: 'localStorage',
  AUTO_SAVE_INTERVAL: 30000, // 30 segundos
  VALIDATION_MODE: 'strict',
  API_ENDPOINTS: {
    CEP: 'https://viacep.com.br/ws',
    BRASIL_API: 'https://brasilapi.com.br/api'
  }
};
```

### Produção (GitHub Pages)
```javascript
// config/app.config.js
export const CONFIG = {
  MODE: 'production',
  STORAGE_TYPE: 'localStorage',
  AUTO_SAVE_INTERVAL: 60000, // 60 segundos
  VALIDATION_MODE: 'strict',
  BASE_URL: 'https://[usuario].github.io/formulario/',
  API_ENDPOINTS: {
    CEP: 'https://viacep.com.br/ws',
    BRASIL_API: 'https://brasilapi.com.br/api'
  }
};
```

### Servidor Local de Desenvolvimento
```bash
# Opção 1: Python (recomendado)
python -m http.server 8000

# Opção 2: Node.js http-server
npx http-server -p 8000

# Opção 3: VS Code Live Server extension
# (Abrir com botão "Go Live")

# Acesse: http://localhost:8000
```

## Templates de Produtos

### Hortaliças
- Lista pré-configurada de hortaliças comuns
- Variedades típicas
- Épocas de plantio

### Frutas
- Frutas de clima temperado e tropical
- Variedades comerciais
- Ciclo de produção

### Cogumelos
- Espécies cultiváveis
- Tipos de substrato
- Condições de cultivo

### Apicultura
- Produtos apícolas (mel, própolis, pólen)
- Tipos de colmeias
- Manejo sanitário

## Integrações

### CEP (ViaCEP)
```javascript
// framework/utils/api-client.js
async function buscarCEP(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(url);
  return response.json();
}
```

### Validação CNPJ (Client-Side)
```javascript
// framework/utils/api-client.js
async function validarCNPJ(cnpj) {
  // Validação algorítmica (dígitos verificadores)
  if (!validarDigitosCNPJ(cnpj)) return { valido: false };

  // Consulta BrasilAPI (opcional)
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
    const dados = await response.json();
    return { valido: true, razaoSocial: dados.razao_social };
  } catch {
    return { valido: true }; // Validação algorítmica apenas
  }
}
```

## Testes

### Unitários (`tests/unit/`)
- Validadores de CPF, CNPJ, CEP
- Formatadores de dados
- Funções de cálculo

### Integração (`tests/integration/`)
- Fluxo de preenchimento de formulário
- Persistência de dados
- Exportação/importação

### E2E (`tests/e2e/`)
- Fluxo completo de cadastro de PMO
- Validação e exportação
- Múltiplos anexos

## Legislação de Referência

- **Lei 10.831/2003**: Lei de Orgânicos
- **Portaria 52/2021**: Normas para PMO
- **IN 19/2011**: Rastreabilidade
- Normas OPAC (Organismo Participativo de Avaliação da Conformidade)

## Deploy no GitHub Pages

### Passo 1: Criar Repositório
```bash
git init
git add .
git commit -m "Initial commit: PMO System"
git branch -M main
git remote add origin https://github.com/[usuario]/formulario.git
git push -u origin main
```

### Passo 2: Configurar GitHub Pages
1. Vá em **Settings** > **Pages**
2. Em **Source**, selecione:
   - Branch: `main`
   - Folder: `/` (root) ou `/dist` (se usar build)
3. Clique em **Save**
4. Aguarde alguns minutos
5. Acesse: `https://[usuario].github.io/formulario/`

### Passo 3: GitHub Actions (Deploy Automático)
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies (se usar build tools)
        run: npm install

      - name: Build (opcional)
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Alternativa: Deploy Manual (Sem Build)
Se não usar ferramentas de build, basta:
1. Fazer push do código para `main`
2. GitHub Pages servirá os arquivos direto da raiz
3. Certifique-se que há um `index.html` na raiz

### Estrutura Recomendada para GitHub Pages
```
/
├── index.html              # Página inicial (obrigatório)
├── framework/
├── anc/
├── assets/
├── database/
├── config/
└── README.md
```

### Configuração de Base Path
Se o repositório não estiver na raiz (`/`), ajuste:

```javascript
// config/app.config.js
export const CONFIG = {
  BASE_PATH: '/formulario/', // Nome do repositório
  // ...
};
```

## Próximos Passos

### Fase 1: MVP (Site Estático)
1. ✅ Criar estrutura de pastas e arquivos
2. Implementar PMO Principal (formulário base)
3. Criar validadores client-side (CPF, CNPJ, CEP)
4. Implementar auto-save com localStorage
5. Adicionar exportação JSON/PDF (jsPDF)
6. Deploy inicial no GitHub Pages

### Fase 2: Anexos de Produção
1. Implementar Anexo I - Produção Vegetal
2. Implementar Anexo III - Produção Animal
3. Implementar Anexo II - Cogumelos
4. Implementar Anexo IV - Apicultura

### Fase 3: Processamento e Relatórios
1. Anexos de Processamento (Completo e Mínimo)
2. Dashboard com resumo de PMOs
3. Relatórios de validação
4. Exportação para CSV

### Fase 4: Melhorias (Futuro)
1. Modo offline (Service Worker/PWA)
2. Sincronização com backend (se necessário)
3. Assinatura digital
4. Integração com certificadoras
5. App mobile (PWA ou React Native)

## Limitações do Site Estático (GitHub Pages)

### O que NÃO é possível:
- ❌ **Autenticação de usuários**: Não há servidor para gerenciar login
- ❌ **Banco de dados centralizado**: Dados ficam apenas no navegador local
- ❌ **Compartilhamento de PMOs**: Não há servidor para sincronizar entre usuários
- ❌ **Envio de emails**: Sem backend para processar emails
- ❌ **Processamento server-side**: Tudo roda no navegador

### Soluções Alternativas:
- ✅ **Dados locais**: localStorage + IndexedDB (até 50MB)
- ✅ **Exportação/Importação**: JSON para backup e compartilhamento manual
- ✅ **Validações**: Todas no client-side (JavaScript)
- ✅ **PDFs**: Gerados no navegador com jsPDF
- ✅ **APIs externas**: ViaCEP, BrasilAPI (via CORS)

### Quando Migrar para Backend:
Se precisar de:
- Sistema multi-usuário com autenticação
- Banco de dados centralizado
- Sincronização em nuvem
- Envio de emails automatizados
- Integração com sistemas externos privados

Considere migrar para:
- **Vercel/Netlify**: Serverless functions
- **Firebase**: Backend-as-a-Service
- **Node.js + Heroku/Railway**: Backend completo

## Bibliotecas JavaScript Recomendadas (CDN)

```html
<!-- Exportação PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>

<!-- Exportação CSV -->
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>

<!-- Download de arquivos -->
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>

<!-- Validação de schemas JSON -->
<script src="https://cdn.jsdelivr.net/npm/ajv@8.12.0/dist/ajv7.min.js"></script>

<!-- Data/Hora em português -->
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/pt-br.js"></script>
```

## Contato

- **Organização**: ANC - Associação de Agricultura Natural de Campinas e Região
- **Sistema**: PMO Digital
- **Versão**: 2.0 (Static Site - GitHub Pages)
- **Licença**: A definir
- **Repositório**: https://github.com/[usuario]/formulario