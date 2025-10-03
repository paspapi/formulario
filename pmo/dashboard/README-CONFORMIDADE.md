# 🏛️ Painel de Conformidade Orgânica

## Visão Geral

O **Painel de Conformidade Orgânica** é um módulo completo do sistema PMO Digital que permite acompanhar todas as etapas obrigatórias do processo de certificação orgânica de forma visual e organizada.

## Funcionalidades

### 1. **Identificação da Unidade**
- Nome do produtor/unidade de produção
- Código interno
- Número do Cadastro Nacional de Produtores Orgânicos

### 2. **Etapas Obrigatórias Monitoradas**

#### ✅ Visita de Verificação
- Data da última visita
- Alerta automático se superior a 12 meses
- Status visual (Realizada / Atrasada / Pendente)
- Previsão da próxima visita

#### ⚖️ Equilíbrio do Sistema (Visitas de Verificação Externas)
- Contador de visitas externas realizadas vs exigidas
- Barra de progresso visual
- Status (Cumprido / Não Cumprido)
- Histórico de visitas

#### 📜 Aprovação da Decisão
- Registro da aprovação formal sobre conformidade orgânica
- Data da aprovação
- Número da decisão/protocolo
- Status (Aprovado / Pendente / Em Análise / Reprovado)

#### 🏛️ Apresentação à Organização Participativa de Avaliação da Conformidade
- Data de apresentação à Comissão de Avaliação
- Status (Apresentada / Não apresentada / Agendada)
- Parecer da comissão
- Data da próxima reunião

#### 🏆 Certificado de Conformidade Orgânica
- Status (Emitido / Renovado / Pendente / Suspenso / Cancelado)
- Número do selo/certificado
- Data de emissão e validade
- Escopos certificados
- Alerta automático de vencimento (< 30 dias)

#### 📝 Cadastro Nacional de Produtores Orgânicos
- Status (Inserido / Atualizado / Pendente / Desatualizado)
- Data da última atualização
- Link para consulta

### 3. **Visualizações**

#### Timeline Visual
- Linha do tempo horizontal mostrando a progressão de todas as etapas
- Indicadores visuais de conclusão
- Responsivo para mobile (muda para layout vertical)

#### Cards de Indicadores
- **Progresso Geral**: Porcentagem de conclusão das etapas
- **Visitas em Dia**: Percentual de visitas realizadas
- **Visitas Externas**: Progresso das visitas externas
- **Pendentes**: Número de certificados aguardando emissão

#### Sistema de Alertas
- Alertas automáticos para ações pendentes
- Priorização por criticidade (Alta / Média / Baixa)
- Visualização clara de prazos

### 4. **Integração com Sistema**

#### Carregamento de Dados
- Integração automática com Plano de Manejo Orgânico Principal
- Botão para sincronizar dados
- Armazenamento em localStorage

#### Exportação
- Exportação de relatório completo em formato JSON
- Dados estruturados para auditoria
- Histórico de modificações

## Como Usar

### Acessando o Painel

1. Abra o Dashboard ([pmo/dashboard/index.html](./index.html))
2. No menu lateral, clique em **"🏛️ Conformidade Orgânica"**
3. O painel será carregado automaticamente

### Primeira Vez

Se for a primeira vez acessando o painel:

1. Clique no botão **"📥 Carregar Dados do Plano de Manejo Orgânico"**
2. Os dados de identificação serão importados automaticamente
3. O painel será renderizado com os dados básicos

### Atualizando Dados

Atualmente, os dados podem ser atualizados de duas formas:

1. **Via botão de sincronização**: Clique em "🔄 Atualizar do Plano de Manejo Orgânico"
2. **Manualmente via localStorage**: Edite os dados no console do navegador

> **Nota**: A funcionalidade de edição visual com formulário está prevista para desenvolvimento futuro.

### Exportando Relatório

1. No painel de conformidade, clique em **"📄 Exportar Relatório"**
2. Um arquivo JSON será baixado com todos os dados
3. O arquivo inclui:
   - Dados completos de conformidade
   - Progresso calculado
   - Data/hora da exportação

## Estrutura de Dados

### Schema JSON

Os dados são armazenados seguindo o schema definido em:
```
database/schemas/conformidade-organica.schema.json
```

### Exemplo de Dados

```json
{
  "identificacao": {
    "nomeProdutor": "Fazenda Exemplo",
    "codigoInterno": "FZ-001",
    "numeroCadastroNacional": "BR-ORG-123456"
  },
  "visitaVerificacao": {
    "dataUltimaVisita": "2024-06-15",
    "status": "realizada",
    "proximaVisitaPrevista": "2025-06-15"
  },
  "equilibrioSistema": {
    "visitasExternasRealizadas": 2,
    "visitasExternasMinimas": 2,
    "status": "cumprido"
  },
  // ... outros dados
}
```

## Alertas Automáticos

O sistema gera alertas automaticamente para:

### Visita Atrasada
- **Condição**: Última visita há mais de 12 meses
- **Prioridade**: Alta
- **Ação**: Agendar nova Visita de Verificação

### Certificado Vencendo
- **Condição**: Certificado vence em menos de 30 dias
- **Prioridade**: Alta (se < 15 dias) ou Média
- **Ação**: Iniciar processo de renovação

### Visitas Externas Pendentes
- **Condição**: Número de visitas menor que o mínimo
- **Prioridade**: Média
- **Ação**: Realizar visitas de verificação externas

### Apresentação Pendente
- **Condição**: Visita não apresentada à Organização Participativa
- **Prioridade**: Média
- **Ação**: Agendar apresentação à Comissão

### Decisão Pendente
- **Condição**: Aprovação ainda não foi decidida
- **Prioridade**: Média
- **Ação**: Acompanhar processo de aprovação

## Arquivos do Componente

### Estrutura
```
pmo/dashboard/
├── conformidade-organica.js      # Componente JavaScript principal
├── conformidade-organica.css     # Estilos específicos
└── README-CONFORMIDADE.md        # Esta documentação
```

### Dependências
```
framework/components/
└── timeline.js                   # Componente de linha do tempo reutilizável

database/schemas/
└── conformidade-organica.schema.json  # Schema de dados
```

## Personalização

### Cores e Estilos

As cores seguem o padrão do sistema PMO:

- **Verde ANC** (#10b981 → #059669): Cor principal, gradientes
- **Vermelho** (#ef4444): Alertas e status críticos
- **Amarelo** (#f59e0b): Avisos e status pendentes
- **Azul** (#3b82f6): Informações e status em andamento
- **Verde** (#10b981): Status positivos e concluídos

### Responsividade

O painel é totalmente responsivo:

- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Grid adaptativo (2 colunas)
- **Mobile**: Layout em coluna única, timeline vertical

## Roadmap Futuro

### Funcionalidades Planejadas

1. ✅ **Formulário de Edição Visual**
   - Interface para editar dados de conformidade
   - Validação de campos
   - Modal de edição

2. ✅ **Notificações Push**
   - Lembretes automáticos via navegador
   - E-mail para alertas críticos

3. ✅ **Relatório PDF**
   - Exportação formatada para impressão
   - Inclusão de gráficos e timeline

4. ✅ **Dashboard Analítico**
   - Gráficos de evolução temporal
   - Comparação entre unidades (para gestores)

5. ✅ **Integração com API**
   - Sincronização com Cadastro Nacional de Produtores Orgânicos
   - Consulta automática de status

## Suporte

Para questões ou sugestões sobre o Painel de Conformidade Orgânica:

- **Documentação Geral**: `pmo/PADRONIZACAO.md`
- **Schema de Dados**: `database/schemas/conformidade-organica.schema.json`
- **Componente Timeline**: `framework/components/timeline.js`

---

**Versão**: 1.0.0
**Última Atualização**: 2024
**Mantido por**: Equipe de Desenvolvimento PMO ANC
