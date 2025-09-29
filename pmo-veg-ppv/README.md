# Anexo Produção Primária Vegetal - PMO ANC

## Descrição

Este é o formulário digital do Anexo de Produção Primária Vegetal do Plano de Manejo Orgânico (PMO) da Associação de Agricultura Natural de Campinas (ANC). O formulário foi desenvolvido para facilitar o preenchimento e validação das práticas agrícolas orgânicas conforme a Portaria 52/2021 do MAPA.

## Estrutura do Projeto

```
pmo-veg-ppv/
├── anexo-producao-vegetal.html     # Página principal do formulário
├── secoes-complementares.html      # Seções adicionais
├── anexo-styles.css               # Estilos específicos do anexo
├── anexo-producao-vegetal.js       # JavaScript de validação e interatividade
└── README.md                      # Documentação do projeto
```

## Funcionalidades

### ✅ Seções Implementadas

1. **Preparo do Solo**
   - Métodos de preparo (roçada, aração, gradagem)
   - Sistema de plantio direto
   - Validação de práticas

2. **Práticas Conservacionistas**
   - Rotação de culturas
   - Adubação verde
   - Consórcios
   - Outras práticas (quebra-ventos, cobertura de solo, etc.)

3. **Barreiras Verdes e Gestão de Riscos**
   - Estado de conservação das barreiras
   - Análise de vizinhos
   - Risco de deriva de agrotóxicos
   - Risco de contaminação por transgênicos

4. **Controle de Formigas**
   - Níveis de infestação
   - Métodos de controle (cultural, mecânico, biológico)
   - Avaliação de eficácia

5. **Substrato para Mudas**
   - Composição detalhada
   - Validação de percentuais (deve somar 100%)
   - Tratamentos aplicados

### 🔧 Funcionalidades Técnicas

- **Auto-save**: Salva automaticamente a cada 30 segundos
- **Validação em tempo real**: Valida campos conforme preenchimento
- **Cálculos automáticos**: Necessidade de insumos, totais de substrato
- **Análise de riscos**: Avalia automaticamente riscos de contaminação
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Integração**: Reutiliza recursos CSS/JS do pmo-geral

## Como Usar

### 1. Estrutura de Diretórios

Certifique-se de que a estrutura esteja organizada assim:

```
projects/anc/
├── pmo-geral/          # Projeto principal
│   ├── css/
│   ├── js/
│   └── assets/
└── pmo-veg-ppv/        # Este anexo
    ├── anexo-producao-vegetal.html
    ├── secoes-complementares.html
    ├── anexo-styles.css
    └── anexo-producao-vegetal.js
```

### 2. Abrir o Formulário

1. Abra o arquivo `anexo-producao-vegetal.html` no navegador
2. O formulário carregará com integração aos recursos do pmo-geral
3. Preencha as seções conforme suas práticas agrícolas

### 3. Navegação

- Use a barra de navegação para pular entre seções
- A barra de progresso mostra o percentual de preenchimento
- Campos obrigatórios são marcados visualmente

### 4. Validação

- Campos são validados em tempo real
- Erros são exibidos em vermelho
- Avisos aparecem em amarelo
- Campos válidos ficam em verde

### 5. Salvamento

- **Auto-save**: Dados salvos automaticamente no localStorage
- **Salvar manual**: Use o botão "💾 Salvar Rascunho"
- **Exportar**: Gere PDF com o botão "📄 Exportar PDF"

## Seções do Formulário

### 1. Preparo do Solo
Documenta todas as práticas de preparo utilizadas na propriedade.

**Campos principais:**
- Métodos de preparo (roçada, aração, gradagem, outros)
- Sistema de plantio direto (se utilizado)
- Detalhes de equipamentos e frequência

### 2. Práticas Conservacionistas
Registra práticas que conservam e melhoram o solo.

**Inclui:**
- Rotação de culturas com ciclos e benefícios
- Adubação verde com espécies e manejo
- Consórcios entre culturas
- Outras práticas (quebra-ventos, cobertura, etc.)

### 3. Barreiras Verdes e Riscos
Avalia proteções contra contaminação externa.

**Avalia:**
- Estado das barreiras vegetais
- Análise detalhada de vizinhos (4 direções)
- Riscos de deriva de agrotóxicos
- Riscos de contaminação por transgênicos
- Medidas de mitigação

### 4. Controle de Formigas
Documenta estratégias de manejo de formigas cortadeiras.

**Métodos:**
- Controle cultural (plantas repelentes, manejo)
- Controle mecânico (escavação, inundação)
- Controle biológico (fungos, extratos)
- Métodos alternativos (homeopatia, cal, etc.)

### 5. Substrato para Mudas
Detalha composição e preparo de substratos orgânicos.

**Especifica:**
- Ingredientes com proporções exatas
- Origem de cada componente
- Tratamentos aplicados
- Validação automática (total = 100%)

## Integrações

### Com PMO-Geral
- Reutiliza CSS base do sistema principal
- Integra com funções JavaScript existentes
- Mantém consistência visual e funcional
- Compartilha sistema de validação

### Validações MAPA
- Conformidade com Portaria 52/2021
- Verificação de produtos permitidos
- Declarações obrigatórias
- Rastreabilidade de insumos

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design responsivo com CSS Grid/Flexbox
- **JavaScript ES6+**: Funcionalidades interativas e validação
- **LocalStorage**: Persistência de dados local
- **Web APIs**: FileReader, FormData, etc.

## Recursos Especiais

### 🤖 Validação Inteligente
- Detecta inconsistências entre práticas
- Sugere melhorias baseadas em boas práticas
- Calcula automaticamente necessidades de insumos
- Analisa riscos de contaminação

### 📊 Cálculos Automáticos
- Necessidade total de esterco/composto
- Composição percentual de substratos
- Estimativas de custo de insumos
- Análise de risco por direção geográfica

### 🎨 Interface Intuitiva
- Design limpo e profissional
- Ícones explicativos para cada seção
- Feedback visual em tempo real
- Responsivo para mobile/tablet/desktop

### 💾 Persistência de Dados
- Auto-save a cada 30 segundos
- Recuperação de dados em caso de fechamento acidental
- Exportação em múltiplos formatos
- Integração com formulário principal

## Conformidade Regulatória

✅ **Portaria 52/2021 MAPA**
- Lista de produtos permitidos
- Práticas obrigatórias documentadas
- Declarações conforme regulamentação
- Rastreabilidade completa

✅ **Agricultura Orgânica**
- Foco em práticas sustentáveis
- Validação de insumos orgânicos
- Controle de contaminação
- Manejo ecológico

## Próximos Passos

### Expansões Futuras
- [ ] Integração com banco de dados
- [ ] Sistema de notificações
- [ ] Relatórios automáticos
- [ ] Mobile app nativo
- [ ] Integração com certificadoras

### Melhorias Planejadas
- [ ] Validações mais específicas por região
- [ ] Sugestões baseadas em IA
- [ ] Integração com dados climáticos
- [ ] Sistema de alertas sazonais

## Suporte

Para dúvidas ou problemas:

- **ANC**: Associação de Agricultura Natural de Campinas
- **OPAC**: BR-SP-001-OPAC
- **Email**: [inserir email de contato]
- **Site**: [inserir site da ANC]

## Licença

Este projeto foi desenvolvido para uso da ANC e produtores orgânicos certificados.

---

**Desenvolvido para ANC - Associação de Agricultura Natural de Campinas**
*Promovendo a agricultura orgânica através de tecnologia acessível*