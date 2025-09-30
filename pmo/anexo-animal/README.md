# Anexo III - Produção Animal

## 📋 Visão Geral

Formulário do Anexo III - Produção Animal do Plano de Manejo Orgânico (PMO) da ANC - Associação de Agricultura Natural de Campinas e Região.

Este anexo é **obrigatório** para produtores que criam animais para fins comerciais ou de subsistência, seguindo as normas da **Portaria 52/2021 do MAPA** e legislação aplicável.

## 📁 Estrutura de Arquivos

```
anexo-animal/
├── index.html              # Formulário principal HTML5
├── anexo-animal.js         # Lógica JavaScript específica
├── anexo-animal.css        # Estilos customizados
├── validation-rules.js     # Regras de validação
└── README.md              # Documentação (este arquivo)
```

## 🎯 Funcionalidades

### ✅ Implementadas

1. **Auto-save** - Salvamento automático a cada 30 segundos no localStorage
2. **Validação em tempo real** - Campos obrigatórios e regras de negócio
3. **Tabelas dinâmicas** - Adicionar/remover/duplicar linhas
4. **Campos condicionais** - Mostrar/ocultar seções conforme seleção
5. **Barra de progresso** - Indicador visual do preenchimento
6. **Exportação JSON** - Backup estruturado dos dados
7. **Máscaras de campos** - CPF formatado automaticamente
8. **Integração PMO Principal** - Carrega dados básicos do produtor
9. **Validações específicas** - Densidade de animais, alimentação orgânica, etc.
10. **Mensagens de feedback** - Alertas, avisos e confirmações

### 🔄 A Implementar (Futuro)

- Geração de PDF completo
- Upload de documentos (fotos, laudos)
- Sincronização com backend
- Importação de JSON
- Modo offline (PWA)

## 📊 Seções do Formulário

### 1. Identificação do Produtor
- Nome do fornecedor/produtor
- Nome da unidade de produção
- Data de preenchimento
- Grupo SPG/ANC

### 2. Inspeção Sanitária
- Tipo de inspeção (SIM, SIE, SIF)
- Órgão responsável
- Número de registro
- Data de validade

**⚠️ Obrigatório para comercialização de produtos de origem animal**

### 3. Espécies Criadas
- Tabela dinâmica com:
  - Espécie (bovinos, ovinos, aves, etc.)
  - Raça/linhagem
  - Área utilizada (ha)
  - Número de animais
  - Finalidade (comercial, subsistência, reprodução)
  - Sistema de criação
  - Status de transição orgânica

**Validação**: Densidade de animais por área conforme espécie

### 4. Alimentação Animal
- **Plano alimentar** (tabela dinâmica):
  - Tipo de alimento (ração, pastagem, concentrados)
  - Origem (própria, comprada)
  - % de composição orgânica
  - Quantidade mensal
  - Frequência de fornecimento

- **Pastagem**:
  - Área total
  - Tipos de forrageiras
  - Sistema de pastejo
  - Rotação de pastos
  - Adubação e controle de invasoras

**⚠️ Regra importante**: Mínimo 80% da alimentação deve ser orgânica (em matéria seca)

### 5. Bem-Estar Animal
- Condições fornecidas (água, alimento, instalações adequadas)
- Densidade máxima respeitada
- Área mínima por animal
- Tempo de confinamento
- Acesso a áreas abertas e pastagem
- Enriquecimento ambiental

**Validação**: Tempo de confinamento não pode exceder limites

### 6. Manejo Sanitário
- **Prevenção de doenças** (tabela):
  - Métodos preventivos
  - Homeopatia, fitoterapia, probióticos
  - Manejo adequado, higiene

- **Tratamentos curativos** (tabela):
  - Doença/enfermidade
  - Medicamento utilizado
  - Período de carência (deve ser dobrado)
  - Condições de uso

**⚠️ Princípio**: Priorizar prevenção. Medicamentos alopáticos só em emergências.

### 7. Programa de Vacinação
- Tabela de vacinas:
  - Nome da vacina
  - Espécies alvo
  - Obrigatória ou não
  - Calendário de aplicação
  - Fabricante
  - Registros atualizados

**⚠️ Obrigatório**: Vacinas exigidas por lei (ex: Febre Aftosa)

### 8. Reprodução
- **Origem dos animais**:
  - Nascidos na propriedade
  - Comprados orgânicos
  - Comprados convencionais
  - Documentação

- **Reprodução artificial**:
  - Inseminação Artificial (IA)
  - Transferência de Embrião (TE)
  - Origem do sêmen/embrião
  - Certificação orgânica

### 9. Instalações para Animais
- Tabela de instalações:
  - Tipo (estábulo, galinheiro, pocilga, etc.)
  - Espécies alojadas
  - Tamanho (m²)
  - Capacidade máxima
  - Lotação atual
  - Tipo de piso, ventilação
  - Frequência de limpeza
  - Produtos de limpeza

**Validação**: Lotação atual não pode exceder capacidade máxima

### 10. Manejo de Esterco e Resíduos
- Método de manejo (compostagem, biodigestor, esterqueira)
- Volume mensal estimado
- Tempo de maturação
- Destinação (uso próprio, comercialização, doação)
- Condições de armazenamento:
  - Local adequado
  - Cobertura
  - Impermeabilização
  - Drenagem de chorume

### 11. Rastreabilidade e Registros
- **Sistema de identificação**:
  - Método (brinco, tatuagem, chip, anilha, lote)
  - Rastreabilidade individual ou por lote

- **Registros mantidos**:
  - Nascimentos
  - Mortes
  - Tratamentos veterinários
  - Vacinações
  - Alimentação
  - Produção (leite, ovos, carne)
  - Movimentação de animais
  - Reprodução

- **Método de registro**:
  - Caderno de campo
  - Planilha eletrônica
  - Software de gestão
  - Fichas individuais

**⚠️ Obrigatório**: Rastreabilidade conforme IN 19/2011 MAPA
**⚠️ Período de retenção**: Mínimo 5 anos

### 12. Declarações do Produtor
Compromissos obrigatórios:
- ✅ Conheço a legislação de produção orgânica
- ✅ Cumpro as normas de bem-estar animal
- ✅ NÃO uso hormônios de crescimento
- ✅ NÃO uso antibióticos preventivos
- ✅ NÃO uso ureia sintética
- ✅ NÃO uso transgênicos
- ✅ Respeito período de carência dobrado
- ✅ Mantenho registros atualizados
- ✅ Autorizo visitas de verificação
- ✅ Declaro veracidade das informações

## 🔧 Uso do Formulário

### Inicialização
O formulário é inicializado automaticamente quando a página carrega:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    AnexoAnimal.init();
});
```

### Funcionalidades JavaScript

#### Salvar Dados
```javascript
AnexoAnimal.salvar(); // Salva manualmente
// Auto-save ocorre automaticamente a cada 30s
```

#### Validar Formulário
```javascript
AnexoAnimal.validar(); // Retorna true/false e exibe relatório
```

#### Exportar JSON
```javascript
AnexoAnimal.exportarJSON(); // Download do arquivo JSON
```

#### Tabelas Dinâmicas
```javascript
// Adicionar linha
AnexoAnimal.table.addRow('tabela-especies');

// Remover linha (pelo botão na tabela)
AnexoAnimal.table.removeRow(button);

// Duplicar linha
AnexoAnimal.table.duplicateRow(button);
```

#### Campos Condicionais
```javascript
// Alternar exibição de campos
AnexoAnimal.toggleInspecao(radio);
AnexoAnimal.togglePastagem(radio);
AnexoAnimal.toggleReproducaoArtificial(radio);
```

## 📐 Validações Implementadas

### Validações Nativas HTML5
- `required` - Campos obrigatórios
- `type="email"` - Formato de email
- `type="number"` - Valores numéricos
- `min`, `max` - Limites de valores
- `pattern` - Expressões regulares

### Validações JavaScript Customizadas

#### CPF
- Dígitos verificadores
- CPFs inválidos conhecidos

#### Densidade de Animais
Limites por espécie (animais/ha):
- Bovinos: 2.5
- Ovinos/Caprinos: 15
- Suínos: 10
- Galinhas: 4000

#### Alimentação Orgânica
- Mínimo 80% de alimentação orgânica (em matéria seca)
- Cálculo automático do percentual total

#### Bem-Estar Animal
- Tempo de confinamento máximo: 16 horas/dia
- Área mínima por animal conforme espécie

#### Rastreabilidade
- Período de retenção mínimo: 5 anos
- Pelo menos um método de rastreabilidade ativo

#### Instalações
- Lotação atual não pode exceder capacidade máxima

## 🎨 Estilos CSS

### Classes Principais
- `.form-section` - Seção do formulário
- `.form-grid` - Grid responsivo de campos
- `.field-wrapper` - Container de campo
- `.dynamic-table` - Tabela dinâmica
- `.checkbox-enhanced` - Checkbox estilizado
- `.alert` - Mensagens de alerta
- `.validation-report` - Relatório de validação

### Cores (variáveis CSS)
- `--primary`: Verde ANC (#10b981)
- `--success`: Verde sucesso (#10b981)
- `--error`: Vermelho erro (#ef4444)
- `--warning`: Laranja aviso (#f59e0b)
- `--info`: Azul informação (#3b82f6)

## 💾 Armazenamento de Dados

### localStorage
Os dados são salvos em:
```javascript
localStorage.setItem('pmo_anexo_animal', JSON.stringify(data));
```

### Estrutura JSON
```json
{
  "metadata": {
    "data_preenchimento": "2024-01-15",
    "ultima_atualizacao": "2024-01-15T14:30:00.000Z",
    "versao": "1.0"
  },
  "dados": {
    "nome_fornecedor": "João Silva",
    "nome_unidade_producao": "Sítio Boa Vista",
    "especie[]": ["bovinos", "aves_galinhas"],
    ...
  }
}
```

## 📱 Responsividade

### Desktop (>1024px)
- Grid de 4 colunas
- Tabelas completas

### Tablet (768px - 1024px)
- Grid de 2 colunas
- Tabelas ajustadas

### Mobile (<768px)
- Grid de 1 coluna
- Tabelas com scroll horizontal
- Botões empilhados

## 🔗 Integração

### Com PMO Principal ✅
O formulário **carrega automaticamente** dados do PMO Principal quando disponíveis:

**Campos preenchidos automaticamente:**
- ✅ Nome do fornecedor/produtor (nome_completo ou razao_social)
- ✅ Nome da unidade de produção
- ✅ Data de preenchimento (data atual)
- ✅ Grupo SPG (se disponível)

**Como funciona:**
1. Quando o Anexo Animal é aberto, busca dados salvos no localStorage
2. Chave do localStorage: `pmo_principal_data`
3. Preenche automaticamente os campos de identificação (Seção 1)
4. Exibe mensagem: "Dados carregados do PMO Principal!"
5. **Não sobrescreve** campos já preenchidos manualmente

**Console do navegador (F12):**
```javascript
// Logs de depuração:
"Nome do fornecedor preenchido: João Silva"
"Nome da unidade preenchido: Sítio Boa Vista"
"Dados carregados do PMO Principal!"
```

**Fluxo recomendado:**
1. 📋 Preencher e salvar o **PMO Principal** primeiro
2. 🐄 Depois abrir o **Anexo Animal**
3. ✅ Dados básicos serão preenchidos automaticamente

**Troubleshooting:**
- Se não carregar: Verifique se o PMO Principal foi salvo
- Verificar no localStorage: `localStorage.getItem('pmo_principal_data')`
- Console mostrará: "Nenhum dado do PMO Principal encontrado" se não houver dados

### Com Framework Unificado
Usa o PMO Framework global:
```html
<script src="../../framework/core/pmo-framework.js"></script>
```

## 🧪 Testes

### Checklist de Teste
- [ ] Auto-save funciona a cada 30s
- [ ] Validação de campos obrigatórios
- [ ] Tabelas dinâmicas (adicionar, remover, duplicar)
- [ ] Campos condicionais aparecem/escondem corretamente
- [ ] Máscaras de CPF aplicadas
- [ ] Cálculo de progresso atualiza
- [ ] Exportação JSON gera arquivo correto
- [ ] Validações específicas funcionam
- [ ] Responsividade em mobile/tablet
- [ ] Mensagens de feedback aparecem

### Teste Manual
1. Preencher seção de identificação
2. Adicionar pelo menos 1 espécie
3. Preencher plano alimentar
4. Marcar declarações obrigatórias
5. Clicar em "Validar Formulário"
6. Verificar se não há erros
7. Salvar rascunho
8. Exportar JSON

## 📚 Legislação de Referência

- **Lei 10.831/2003** - Lei de Orgânicos
- **Portaria 52/2021 MAPA** - Normas para PMO
- **IN 19/2011 MAPA** - Rastreabilidade
- **Instrução Normativa 46/2011** - Produção Animal Orgânica
- Normas OPAC (Organismo Participativo de Avaliação da Conformidade)

## 🐛 Troubleshooting

### Auto-save não funciona
- Verificar se há espaço no localStorage
- Verificar console do navegador para erros

### Validação não bloqueia envio
- Verificar se `event.preventDefault()` está sendo chamado
- Verificar validação HTML5 nativa

### Tabelas dinâmicas não aparecem
- Verificar se template está definido no HTML
- Verificar ID do template corresponde ao da tabela

### Dados não carregam
- Verificar se há dados salvos no localStorage
- Limpar cache e recarregar página

### Dados do PMO Principal não carregam
1. **Verificar se PMO Principal foi salvo:**
   - Abra o console (F12)
   - Digite: `localStorage.getItem('pmo_principal_data')`
   - Deve retornar um JSON, não `null`

2. **Verificar console de erros:**
   - Procure por: "Nenhum dado do PMO Principal encontrado"
   - Ou erros de parsing JSON

3. **Forçar recarga:**
   - Salve o PMO Principal novamente
   - Recarregue o Anexo Animal (Ctrl+F5)
   - Verifique se aparece: "Dados carregados do PMO Principal!"

4. **Limpar e recarregar:**
   ```javascript
   // No console:
   localStorage.removeItem('pmo_anexo_animal');
   location.reload();
   ```

## 👨‍💻 Desenvolvimento

### Adicionar Nova Validação
1. Abrir `validation-rules.js`
2. Adicionar regra em `AnexoAnimalValidation.rules`
3. Testar no navegador

### Adicionar Nova Seção
1. Adicionar HTML no `index.html`
2. Adicionar lógica no `anexo-animal.js` se necessário
3. Adicionar estilos no `anexo-animal.css` se necessário
4. Adicionar validações no `validation-rules.js`

### Debug
Abrir console do navegador (F12) e verificar logs:
```javascript
console.log('Inicializando Anexo Animal...');
console.log('Dados carregados com sucesso!');
```

## 📝 Notas Importantes

- ⚠️ **Backup**: Sempre exportar JSON antes de limpar navegador
- ⚠️ **Navegadores**: Testar em Chrome, Firefox, Edge
- ⚠️ **Privacidade**: Dados ficam apenas no navegador local
- ⚠️ **Inspeção Sanitária**: Obrigatória para comercialização
- ⚠️ **80% Orgânico**: Alimentação deve ser 80% orgânica mínimo
- ⚠️ **Rastreabilidade**: Obrigatória por lei (IN 19/2011)

## 📞 Suporte

- **Organização**: ANC - Associação de Agricultura Natural de Campinas e Região
- **Sistema**: PMO Digital v2.0
- **Módulo**: Anexo III - Produção Animal
- **Legislação**: Portaria MAPA 52/2021

---

**Desenvolvido com ❤️ para a Agricultura Orgânica**
