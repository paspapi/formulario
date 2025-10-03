# PMO Principal - Plano de Manejo Orgânico

## 📋 Descrição

Formulário principal e obrigatório do Plano de Manejo Orgânico (PMO) conforme **Portaria 52/2021 do MAPA**. Este é o documento base que deve ser preenchido por todos os produtores que buscam certificação orgânica participativa pela ANC.

## 📁 Arquivos

```
pmo-principal/
├── index.html              # Formulário HTML5 completo (17 seções)
├── pmo-principal.js        # Lógica JavaScript (auto-save, validação, máscaras)
├── pmo-principal.css       # Estilos específicos do módulo
├── validation-rules.js     # Regras de validação conforme legislação
└── README.md              # Documentação
```

## 🎯 Funcionalidades

### ✅ Formulário Completo (17 Seções)

1. **Identificação do Produtor/Empresa**
   - CPF ou CNPJ
   - Dados cadastrais básicos
   - Nome da unidade de produção

2. **Dados de Contato**
   - Telefone (com máscara)
   - E-mail validado

3. **Endereço da Unidade de Produção**
   - Busca automática via CEP (ViaCEP API)
   - Coordenadas geográficas (GPS)
   - Roteiro de acesso

4. **Dados da Propriedade**
   - Posse da terra
   - Área total (hectares)
   - CAF (Cadastro de Agricultor Familiar)

5. **Histórico de Manejo Orgânico**
   - Anos de prática orgânica
   - Situação atual do manejo
   - Comprovações

6. **Responsáveis pela Produção**
   - Tabela dinâmica
   - CPF validado
   - Funções e contatos

7. **Atividades Orgânicas**
   - Tipos de produção (hortaliças, frutas, grãos, etc.)
   - Áreas utilizadas
   - Mão de obra

8. **Histórico de Aplicações**
   - Insumos não permitidos nos últimos 3 anos
   - Datas e ingredientes ativos
   - Validação de período de conversão

9. **Lista de Produtos a Certificar** ⭐ **Obrigatório**
   - Tabela dinâmica
   - Estimativa de produção
   - Origem de sementes/mudas

10. **Preservação Ambiental**
    - CAR (Cadastro Ambiental Rural)
    - APPs e Reserva Legal
    - Destinação de resíduos

11. **Recursos Hídricos**
    - Fontes de água
    - Riscos de contaminação
    - Análises de qualidade

12. **Comercialização**
    - Canais de venda
    - Rotulagem e rastreabilidade
    - Produção paralela (orgânica/convencional)

13. **Controles e Registros**
    - Cadernos de campo
    - Rastreabilidade (obrigatória)
    - Gestão de estoque

14. **Produção de Subsistência**
    - Produção para consumo próprio não orgânica
    - Manejos de separação

15. **Produção Paralela**
    - Mesmo produto orgânico e convencional
    - Riscos e bloqueios

16. **Upload de Documentos**
    - Croqui da propriedade ⭐ **Obrigatório**
    - CAR (recomendado)
    - Análises de solo/água

17. **Declarações e Compromissos** ⭐ **Obrigatório**
    - Veracidade das informações
    - Seguir normas de produção orgânica
    - Autorizar visitas de verificação

### 🔧 Funcionalidades Técnicas

#### Auto-save
- ✅ Salvamento automático a cada **30 segundos**
- ✅ Armazenamento em **localStorage**
- ✅ Indicador de status (última gravação)
- ✅ Prevenção de perda de dados

#### Máscaras de Entrada
- ✅ **CPF**: `000.000.000-00`
- ✅ **CNPJ**: `00.000.000/0000-00`
- ✅ **CEP**: `00000-000`
- ✅ **Telefone**: `(00) 00000-0000`

#### Validações
- ✅ **HTML5 nativo**: `required`, `type`, `pattern`
- ✅ **JavaScript customizado**: CPF, CNPJ, datas
- ✅ **Regras de negócio**: Portaria 52/2021 MAPA
- ✅ **Relatório completo**: Erros e avisos separados

#### APIs Externas
- ✅ **ViaCEP**: Busca automática de endereço
- ✅ **BrasilAPI**: Validação de CNPJ (opcional)

#### Tabelas Dinâmicas
- ✅ Adicionar/Remover linhas
- ✅ Duplicar linha (facilita preenchimento)
- ✅ Numeração automática
- ✅ Validação por linha

#### Upload de Arquivos
- ✅ Drag-and-drop
- ✅ Preview instantâneo
- ✅ Conversão para Base64 (armazenamento local)
- ✅ Validação: máx. 5MB por arquivo
- ✅ Formatos: PDF, JPG, PNG

#### Cálculo de Progresso
- ✅ Baseado em campos obrigatórios
- ✅ Atualização em tempo real
- ✅ Barra visual no topo

#### Exportação
- ✅ **JSON**: Backup completo dos dados
- ✅ **PDF**: Documento formatado (implementação futura)
- ✅ Schema compatível com `pmo-principal.schema.json`

## 🎨 Estilos CSS

### Framework Base
- `pmo-framework-full.css`: Framework completo com design system

### Estilos Específicos
- `pmo-principal.css`: Componentes únicos do PMO Principal
  - Header/Footer
  - Barra de progresso
  - Validação de relatórios
  - Action buttons
  - Mensagens flutuantes

### Responsividade
- ✅ **Mobile**: 375px+
- ✅ **Tablet**: 768px+
- ✅ **Desktop**: 1024px+
- ✅ Touch-friendly (botões 44x44px mínimo)

## 🚀 Como Usar

### 1. Abrir o Formulário
Navegue até: `http://localhost:8000/anc/pmo-principal/index.html`

### 2. Preencher as Seções
- Campos com `*` são **obrigatórios**
- Use o ícone `?` para ver dicas de preenchimento
- O progresso é salvo automaticamente

### 3. Validar
Clique em **✓ Validar Formulário** para verificar:
- ❌ **Erros**: Impedem o envio
- ⚠️ **Avisos**: Recomendações (não impedem envio)

### 4. Exportar/Salvar
- **💾 Salvar Rascunho**: Grava manualmente
- **📥 Exportar JSON**: Baixa backup completo
- **📄 Exportar PDF**: Gera documento (futuro)

### 5. Enviar
- **✉️ Enviar PMO**: Submete o formulário
- Só é possível após validação sem erros

## 📊 Estrutura de Dados

### Formato JSON
```json
{
  "metadata": {
    "id_produtor": "000.000.000-00",
    "tipo_documento": ["pmo-principal"],
    "data_extracao": "2024-01-20T10:30:00Z",
    "versao_schema": "1.0",
    "grupo_spg": "ANC",
    "status_processamento": "PREENCHIDO"
  },
  "dados_gerais": {
    "identificacao": { ... },
    "contato": { ... },
    "propriedade": { ... }
  },
  "responsaveis_producao": [...],
  "produtos_certificar": [...],
  "validacao": {
    "campos_obrigatorios_completos": true,
    "possui_erros": false,
    "percentual_preenchimento": 100
  }
}
```

## 🔒 Validações Específicas

### Portaria 52/2021 MAPA

#### Conversão Orgânica
- ⏱️ **Período mínimo**: 12 meses sem insumos proibidos
- ⚠️ Alerta se histórico recente de agrotóxicos

#### CAR (Cadastro Ambiental Rural)
- ⚠️ Obrigatório por lei (Lei 12.651/2012)
- ✅ Upload do documento recomendado

#### Produção Paralela
- ⚠️ Permitida mas não recomendada
- ✅ Exige descrição detalhada de separação

#### Rastreabilidade
- ✅ **Obrigatória** (IN 19/2011 MAPA)
- Deve marcar controles de rastreabilidade

#### Croqui da Propriedade
- ✅ **Obrigatório**
- Deve mostrar áreas orgânicas, APP, limites

## 🛠️ Desenvolvimento

### Dependências
```html
<!-- Framework CSS -->
<link rel="stylesheet" href="../../framework/core/pmo-framework-full.css">

<!-- CSS Específico -->
<link rel="stylesheet" href="./pmo-principal.css">

<!-- Framework JS -->
<script src="../../framework/core/pmo-framework.js"></script>

<!-- JS Específico -->
<script src="./pmo-principal.js"></script>
<script src="./validation-rules.js"></script>
```

### Estrutura JavaScript
```javascript
// Namespace global
const PMOPrincipal = {
    config: { ... },
    state: { ... },
    init() { ... },
    table: { ... },
    validar() { ... },
    salvar() { ... },
    exportarJSON() { ... }
};

// Validações separadas
const PMOValidationRules = {
    validateIdentificacao() { ... },
    validateContato() { ... },
    validateComplete() { ... }
};
```

### Adicionar Nova Seção
1. Adicionar HTML em `index.html`
2. Implementar lógica em `pmo-principal.js`
3. Criar validação em `validation-rules.js`
4. Atualizar schema JSON
5. Adicionar estilos se necessário

## 📖 Referências

### Legislação
- [Lei 10.831/2003](http://www.planalto.gov.br/ccivil_03/leis/2003/l10.831.htm) - Lei de Orgânicos
- [Portaria 52/2021](https://www.in.gov.br/en/web/dou/-/portaria-n-52-de-15-de-marco-de-2021-309380659) - PMO
- [IN 19/2011](https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/legislacao-1/normativos-cgqv/pocs/instrucao-normativa-no-19-de-28-de-maio-de-2009.pdf) - Rastreabilidade

### Técnicas
- [PMO Framework](../../framework/README.md)
- [Schema JSON](../../database/schemas/pmo-principal.schema.json)
- [ViaCEP API](https://viacep.com.br/)

## ✅ Checklist de Implementação

### Funcionalidades
- [x] 17 seções completas
- [x] Auto-save (30s)
- [x] Máscaras de entrada
- [x] Busca de CEP
- [x] Validação CPF/CNPJ
- [x] Tabelas dinâmicas
- [x] Upload de arquivos
- [x] Cálculo de progresso
- [x] Exportação JSON
- [ ] Exportação PDF (pendente)
- [x] Validação completa
- [x] Relatório de erros/avisos

### Qualidade
- [x] Responsivo (Mobile/Tablet/Desktop)
- [x] Acessível (labels, aria-*)
- [x] Navegação por teclado
- [x] Prevenção de perda de dados
- [x] Mensagens de feedback
- [x] Documentação completa

### Conformidade
- [x] Portaria 52/2021 MAPA
- [x] Schema JSON definido
- [x] Validações de legislação
- [x] Rastreabilidade obrigatória
- [x] CAR validado

## 🐛 Troubleshooting

### Auto-save não funciona
- Verificar console do navegador
- Confirmar que localStorage está habilitado
- Limpar cache se necessário

### Busca de CEP falha
- Verificar conexão com internet
- API ViaCEP pode estar indisponível
- Preencher manualmente se necessário

### Upload não aceita arquivo
- Tamanho máximo: 5MB por arquivo
- Formatos aceitos: PDF, JPG, PNG
- Verificar console para erros

## 📞 Suporte

- **Organização**: ANC - Associação de Agricultura Natural de Campinas e Região
- **Documentação**: [CLAUDE.md](../../CLAUDE.md)
- **Issues**: Reportar bugs no repositório

---

**Versão**: 2.0
**Última atualização**: 2024-09
**Compatibilidade**: Navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)