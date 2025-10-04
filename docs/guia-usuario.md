# Guia do Usuário - Sistema PMO Digital

> Guia completo para produtores orgânicos criarem e gerenciarem seus Planos de Manejo Orgânico

## Índice

1. [Primeiro Acesso](#primeiro-acesso)
2. [Criar um Novo PMO](#criar-um-novo-pmo)
3. [Preencher o Cadastro Geral](#preencher-o-cadastro-geral)
4. [Preencher os Anexos Específicos](#preencher-os-anexos-específicos)
5. [Upload de Documentos](#upload-de-documentos)
6. [Validar o PMO](#validar-o-pmo)
7. [Exportar e Enviar](#exportar-e-enviar)
8. [Editar PMO Existente](#editar-pmo-existente)
9. [Gerenciar Múltiplos PMOs](#gerenciar-múltiplos-pmos)
10. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

---

## Primeiro Acesso

### Passo 1: Abrir o Sistema

1. Abra o arquivo `index.html` no seu navegador
   - Pode usar Chrome, Firefox, Safari ou Edge
2. Você verá a tela inicial do sistema
3. Clique em **"Acessar Painel PMO"**

### Passo 2: Conhecer o Painel

O painel é onde você verá todos os seus PMOs. Na primeira vez, estará vazio.

**Elementos do Painel:**
- 🔍 **Barra de busca**: Procurar PMOs por nome, CPF ou unidade
- 🎯 **Filtros**: Por grupo SPG, ano, status
- ⬆️⬇️ **Ordenação**: Mais recentes, maior progresso, alfabética
- ➕ **Botão "Novo PMO"**: Criar novo Plano de Manejo

---

## Criar um Novo PMO

### Passo 1: Iniciar Criação

1. No painel, clique em **"➕ Novo PMO"**
2. Uma janela aparecerá solicitando informações básicas

### Passo 2: Informações Iniciais

Preencha os campos:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **CPF ou CNPJ** | Seu documento (obrigatório) | 123.456.789-00 |
| **Nome Completo** | Seu nome ou razão social | João da Silva |
| **Unidade de Produção** | Nome da sua propriedade | Sítio Boa Vista |
| **Ano Vigente** | Ano do PMO (padrão: atual) | 2025 |
| **Grupo SPG** | Seu grupo (se aplicável) | ANC |

### Passo 3: Confirmar

1. Clique em **"Criar PMO"**
2. O sistema criará um ID único: `pmo_2025_12345678900_sitio-boa-vista`
3. Você será direcionado ao formulário de Cadastro Geral

---

## Preencher o Cadastro Geral

O Cadastro Geral tem **17 seções obrigatórias**. Preencha todas com atenção.

### Seção 1: Identificação do Produtor/Empresa

**Campos obrigatórios:**
- CPF ou CNPJ (já preenchido)
- Nome completo
- RG e órgão emissor
- Data de nascimento (se pessoa física)

**Dica:** Use o formato correto de CPF: `000.000.000-00`

### Seção 2: Dados de Contato

**Campos obrigatórios:**
- Telefone principal
- E-mail

**Opcional:**
- Telefone adicional

**Dica:** O sistema formata automaticamente o telefone: `(00) 00000-0000`

### Seção 3: Endereço da Unidade de Produção

**Atalho rápido:**
1. Digite o CEP no campo
2. Clique em **"Buscar CEP"**
3. O sistema preenche automaticamente:
   - Logradouro
   - Bairro
   - Cidade
   - Estado

**Campos adicionais:**
- Número
- Complemento
- **Coordenadas GPS** (latitude e longitude) - obrigatório
- **Roteiro de acesso** - descreva como chegar à propriedade

**Exemplo de Coordenadas:**
- Latitude: `-22.906847`
- Longitude: `-47.063049`

**Dica:** Use Google Maps para obter as coordenadas da sua propriedade.

### Seção 4: Dados da Propriedade

**Campos obrigatórios:**
- **Situação de posse**: Proprietário, arrendatário, parceiro, etc.
- **Área total em hectares**: Ex: 5.5
- **CAF** (Cadastro de Agricultor Familiar): Se possuir

### Seção 5: Histórico de Manejo Orgânico

**Campos obrigatórios:**
- **Anos de prática orgânica**: Ex: 3
- **Situação atual**:
  - Em conversão (menos de 12 meses sem químicos)
  - Orgânico (mais de 12 meses)

**Importante:** Se estiver em conversão, veja seção 8 sobre histórico de aplicações.

### Seção 6: Responsáveis pela Produção

Esta é uma **tabela dinâmica**. Você pode adicionar várias pessoas.

**Como adicionar:**
1. Clique em **"➕ Adicionar Responsável"**
2. Preencha:
   - Nome completo
   - CPF
   - Função (ex: proprietário, trabalhador, gerente)
   - Telefone
3. Para adicionar outro, clique novamente em **"➕ Adicionar"**

**Como remover:**
- Clique no **❌** na linha que deseja remover

**Mínimo:** Pelo menos 1 responsável

### Seção 7: Atividades Orgânicas (ESCOPO) ⭐ IMPORTANTE

Esta seção define **quais anexos você precisará preencher**.

**Marque todas as atividades que você pratica:**

- ☐ 🌱 **Hortaliças**
- ☐ 🍎 **Frutas**
- ☐ 🌾 **Grãos e cereais**
- ☐ 🌿 **Plantas medicinais e aromáticas**
- ☐ 🍄 **Cogumelos**
- ☐ 🐄 **Pecuária**
- ☐ 🐝 **Apicultura**
- ☐ 🏭 **Processamento**
- ☐ 🥗 **Processamento mínimo**

**Importante:**
- Marque **"Pretende certificar todas as atividades"** se aplicável
- O sistema habilitará automaticamente os anexos necessários

**Exemplo:**
- Se marcar "Hortaliças" + "Apicultura", terá que preencher:
  - Anexo Vegetal
  - Anexo Apicultura

### Seção 8: Histórico de Aplicações

**Se você NÃO usou produtos não permitidos nos últimos 3 anos:**
- Deixe em branco ou marque "Não houve aplicações"

**Se usou produtos químicos nos últimos 3 anos:**
1. Clique em **"➕ Adicionar Aplicação"**
2. Preencha:
   - Data da aplicação
   - Nome do produto
   - Ingrediente ativo
   - Cultura aplicada
3. Adicione todas as aplicações

**Validação automática:**
- Sistema verifica período de conversão (mínimo 12 meses)
- Se não completou 12 meses, receberá aviso

### Seção 9: Lista de Produtos a Certificar ⭐

Esta é uma **tabela obrigatória**. Liste TODOS os produtos que deseja certificar.

**Como preencher:**
1. Clique em **"➕ Adicionar Produto"**
2. Preencha:
   - Nome do produto (ex: Alface)
   - Variedade (ex: Crespa)
   - Estimativa de produção anual (kg/ano)
   - Origem das sementes/mudas

**Exemplo:**
| Produto | Variedade | Produção Anual | Origem Sementes |
|---------|-----------|----------------|-----------------|
| Alface | Crespa | 500 kg | Sementes orgânicas Isla |
| Tomate | Cereja | 300 kg | Mudas próprias |

**Mínimo:** Pelo menos 1 produto

### Seção 10: Preservação Ambiental

**Campos obrigatórios:**
- **Número do CAR** (Cadastro Ambiental Rural) - obrigatório por lei
- **Possui APP?** (Área de Preservação Permanente) Sim/Não
  - Se sim, descreva
- **Possui Reserva Legal?** Sim/Não
  - Se sim, área em hectares
- **Destinação de resíduos**: Como descarta embalagens, restos de cultura, etc.
- **Proteção de nascentes**: Se aplicável

### Seção 11: Recursos Hídricos

**Campos obrigatórios:**
- **Fonte de água**: Poço, rio, açude, rede pública, etc.
- **Riscos de contaminação**: Descreva (ex: proximidade com estradas, vizinhos)
- **Possui análise de água?** Sim/Não
- **Sistema de irrigação**: Aspersão, gotejamento, etc.

### Seção 12: Comercialização

**Campos obrigatórios:**
- **Canais de venda**: Feira, supermercado, delivery, cestas, etc.
- **Como rotula os produtos?**: Etiquetas, embalagens, etc.
- **Sistema de rastreabilidade**: Como rastreia do campo ao consumidor
- **Produção paralela**: Tem produção orgânica E convencional? Sim/Não

### Seção 13: Controles e Registros

**Campos obrigatórios:**
- **Possui caderno de campo?** Sim/Não
  - Obrigatório por legislação (IN 19/2011)
- **Como registra**:
  - Plantios
  - Tratos culturais
  - Colheitas
  - Vendas
- **Gestão de estoque**: Como controla produtos acabados
- **Controle de insumos**: Como controla compra e uso de insumos

**Dica:** Mantenha registros detalhados - são essenciais para rastreabilidade.

### Seção 14: Produção de Subsistência

**Se você tem produção NÃO orgânica para consumo próprio:**
- Descreva quais produtos
- Como separa da produção orgânica
- Áreas distintas

**Se NÃO tem:**
- Marque "Não possui produção de subsistência não orgânica"

### Seção 15: Produção Paralela

**Atenção:** Produção paralela = produzir o MESMO produto orgânico E convencional

**Exemplo:**
- Tomate orgânico + Tomate convencional = Produção paralela ❌ Não permitido
- Tomate orgânico + Alface convencional = Não é produção paralela ✅ Permitido (se bem manejado)

**Se tem produção paralela:**
- Descreva medidas de separação
- Sistema bloqueará se inadequado

**Recomendação:** Evite produção paralela para facilitar certificação.

### Seção 16: Upload de Documentos ⭐

**Documentos obrigatórios:**
- **Croqui da propriedade** (PDF, JPG ou PNG) - OBRIGATÓRIO

**Documentos recomendados:**
- CAR (Cadastro Ambiental Rural)
- Análises de solo
- Análises de água
- Notas fiscais de insumos orgânicos

**Como fazer upload:**

1. **Método 1: Arrastar e soltar**
   - Arraste o arquivo para a área de upload
   - Solte quando aparecer "Solte aqui"

2. **Método 2: Selecionar arquivo**
   - Clique em "Selecionar arquivos"
   - Escolha o arquivo no computador
   - Clique em "Abrir"

**Limites:**
- Tamanho máximo: 10MB por arquivo
- Formatos aceitos: PDF, JPG, JPEG, PNG

**Preview:**
- Imagens: Aparecem como miniatura
- PDFs: Nome e tamanho do arquivo

**Remover arquivo:**
- Clique no ❌ ao lado do arquivo

### Seção 17: Declarações e Compromissos ⭐

**Leia atentamente e marque todas as opções:**

- ☐ Declaro que todas as informações são verdadeiras
- ☐ Comprometo-me a seguir as normas de produção orgânica (Lei 10.831/2003)
- ☐ Autorizo visitas de verificação na propriedade
- ☐ Comprometo-me a manter registros atualizados

**Assinatura:**
- Digite seu nome completo
- Data: preenchida automaticamente

**Sem aceitar:** Não poderá enviar o PMO para avaliação.

---

## Preencher os Anexos Específicos

Após concluir o Cadastro Geral, preencha os anexos conforme o escopo selecionado na Seção 7.

### Anexo Vegetal 🌱

**Quando preencher:** Se marcou hortaliças, frutas, grãos, medicinais

**Seções principais:**
1. **Culturas e Variedades**: Liste todas
2. **Calendário de Plantio**: Quando planta e colhe cada cultura
3. **Manejo de Pragas**: Como controla (produtos permitidos)
4. **Manejo de Doenças**: Prevenção e tratamento
5. **Adubação**: Tipos de adubo orgânico, quantidades
6. **Controle de Invasoras**: Como maneja plantas daninhas
7. **Rotação de Culturas**: Esquema de rotação

### Anexo Animal 🐄

**Quando preencher:** Se marcou pecuária

**Seções principais:**
1. **Espécies Criadas**: Bovinos, suínos, aves, etc.
2. **Sistema de Criação**: Confinado, semi-confinado, extensivo
3. **Alimentação**: % orgânico vs. não orgânico
4. **Sanidade**: Manejo de doenças, produtos usados
5. **Bem-estar Animal**: Espaço, abrigo, condições
6. **Gestão de Dejetos**: Como maneja esterco e urina

### Anexo Cogumelo 🍄

**Quando preencher:** Se marcou cogumelos

**Seções principais:**
1. **Espécies Cultivadas**: Shiitake, champignon, etc.
2. **Substrato Utilizado**: Composição, origem
3. **Ambiente de Cultivo**: Estufa, galpão, condições
4. **Origem do Inóculo**: Fornecedor, certificação
5. **Controle de Contaminação**: Medidas de higiene

### Anexo Apicultura 🐝

**Quando preencher:** Se marcou apicultura

**Seções principais:**
1. **Número de Colmeias**: Total
2. **Localização dos Apiários**: Coordenadas, distâncias
3. **Manejo de Caixas**: Tipo, materiais
4. **Alimentação Artificial**: Se usa, quando, tipo
5. **Sanidade**: Controle de doenças e pragas
6. **Produtos Obtidos**: Mel, própolis, pólen, geleia

### Anexo Processamento 🏭

**Quando preencher:** Se marcou processamento

**Seções principais:**
1. **Produtos Processados**: Liste todos
2. **Fluxograma de Produção**: Passo a passo
3. **Ingredientes**: Todos devem ser orgânicos ou permitidos
4. **Embalagens**: Tipo, materiais
5. **Rotulagem**: Informações do rótulo
6. **Controle de Qualidade**: Análises, padrões
7. **PPHO**: Procedimentos de higiene

### Anexo Processamento Mínimo 🥗

**Quando preencher:** Se marcou processamento mínimo

**Seções principais:**
1. **Produtos**: Ex: alface lavada, cenoura ralada
2. **Higienização**: Produtos usados, procedimento
3. **Embalagem**: Tipo, material
4. **Armazenamento**: Temperatura, condições
5. **Validade**: Prazo de consumo

---

## Upload de Documentos

### Documentos Obrigatórios

**1. Croqui da Propriedade** ⭐ OBRIGATÓRIO

**O que deve conter:**
- Limites da propriedade
- Áreas de cultivo (identificadas)
- Áreas de preservação (APP, Reserva Legal)
- Construções (casa, galpões, estufas)
- Fontes de água (rios, nascentes, poços)
- Áreas de vizinhos (indicar se são convencionais)
- Pontos de referência
- Rosa dos ventos (Norte)
- Escala aproximada

**Como fazer:**
- Pode desenhar à mão e fotografar
- Pode usar Google Earth e marcar
- Pode contratar técnico para desenhar

**Formato:** PDF, JPG ou PNG

### Documentos Recomendados

**2. CAR (Cadastro Ambiental Rural)**
- Obrigatório por lei (Código Florestal)
- Comprovante de inscrição

**3. Análises de Solo**
- Últimas análises realizadas
- Ajuda a planejar adubação

**4. Análises de Água**
- Se usa água de poço ou rio
- Comprova qualidade

**5. Notas Fiscais de Insumos**
- Comprova compra de insumos permitidos
- Facilita rastreabilidade

---

## Validar o PMO

Antes de enviar para avaliação, valide seu PMO.

### Passo 1: Clicar em Validar

1. No formulário, procure o botão **"✓ Validar Formulário"**
2. Clique nele
3. Aguarde o processamento

### Passo 2: Analisar o Relatório

O sistema mostrará um relatório com:

**❌ ERROS (em vermelho)**
- Campos obrigatórios não preenchidos
- Dados inválidos (CPF errado, e-mail incorreto)
- Documentos obrigatórios faltando
- **Ação:** DEVE corrigir antes de enviar

**⚠️ AVISOS (em amarelo)**
- Recomendações
- Documentos recomendados faltando
- Períodos de conversão incompletos
- **Ação:** Recomenda-se corrigir, mas não impede envio

**✅ SUCESSO (em verde)**
- Campos completos
- Validações aprovadas

### Passo 3: Corrigir Erros

1. Clique no erro para ir direto à seção
2. Corrija o campo
3. Salve
4. Valide novamente

**Repita até não haver mais erros.**

### Exemplo de Relatório

```
Validação do PMO

❌ ERROS ENCONTRADOS (2):
1. Seção 16 - Upload: Croqui da propriedade é obrigatório
2. Seção 1 - Identificação: CPF inválido

⚠️ AVISOS (1):
1. Seção 10 - Preservação: CAR não anexado. É obrigatório por lei.

✅ COMPLETUDE: 95%
Total de campos: 45
Preenchidos: 43
Faltantes: 2
```

---

## Exportar e Enviar

### Exportar JSON (Backup)

**Para que serve:** Backup completo dos seus dados

**Como fazer:**
1. Clique em **"📥 Exportar JSON"**
2. Arquivo será baixado: `pmo_2025_12345678900_sitio.json`
3. Salve em local seguro (pen drive, nuvem)

**Quando usar:**
- Backup semanal
- Antes de limpar navegador
- Para transferir para outro computador

**Como importar depois:**
1. No painel, clique em **"Importar PMO"**
2. Selecione o arquivo JSON
3. Sistema restaura todos dados

### Exportar PDF

**Para que serve:** Documento formatado para impressão ou envio

**Como fazer:**
1. Clique em **"📄 Exportar PDF"**
2. Escolha qual formulário:
   - Cadastro Geral PMO
   - Anexo Vegetal
   - Anexo Animal
   - etc.
3. PDF será gerado e baixado

**Conteúdo:**
- Cabeçalho da ANC
- Dados formatados
- Marca d'água "RASCUNHO" (se não aprovado)

### Enviar para Avaliação

**Pré-requisitos:**
- ✅ Validação sem erros
- ✅ Todos formulários obrigatórios preenchidos
- ✅ Croqui anexado

**Como fazer:**
1. Clique em **"✉️ Enviar PMO"**
2. Confirme o envio
3. Sistema mudará status para "Aguardando Avaliação"
4. Avaliador será notificado (futuro)

**Após envio:**
- Ainda pode editar
- Mas avaliador verá as alterações
- Recomenda-se não alterar muito

---

## Editar PMO Existente

### Como Abrir um PMO

1. Acesse o **Painel PMO**
2. Localize seu PMO:
   - Use a busca (nome, CPF, unidade)
   - Ou navegue pelos cards
3. Clique em **"Editar"** no card do PMO
4. Sistema carrega todos os dados salvos

### Fazendo Alterações

1. Navegue pelas seções
2. Altere os campos desejados
3. **Sistema salva automaticamente a cada 30s**
4. Ou clique em **"💾 Salvar Rascunho"** para salvar manualmente

### Indicador de Salvamento

No canto superior direito, você verá:
- **"Salvando..."** quando estiver salvando
- **"Última gravação às 14:35"** quando salvo

### Revalidar Após Alterações

Após fazer alterações importantes:
1. Clique em **"✓ Validar Formulário"** novamente
2. Verifique se não introduziu novos erros
3. Corrija se necessário

---

## Gerenciar Múltiplos PMOs

### Quando Criar Vários PMOs?

**Situações comuns:**
1. **Várias unidades de produção**: Cada uma precisa de um PMO
2. **Diferentes anos**: PMO 2024, PMO 2025, etc.
3. **Diferentes produtores**: Se você gerencia PMOs de outros

### Criar Novo PMO

1. No painel, clique **"➕ Novo PMO"**
2. Preencha dados do novo PMO
3. Sistema cria com ID único

**Exemplo:**
- PMO 1: `pmo_2025_12345678900_sitio-boa-vista`
- PMO 2: `pmo_2025_12345678900_chacara-feliz`

### Alternar Entre PMOs

**Método 1: Busca**
1. Digite nome da unidade na busca
2. Clique em "Editar" no PMO desejado

**Método 2: Filtros**
1. Filtre por ano: 2025
2. Filtre por status: Rascunho
3. Veja apenas PMOs filtrados

**Método 3: Ordenação**
1. Ordene por "Mais recentes"
2. Veja os PMOs mais novos primeiro

### Visualizar Progresso

Cada card mostra:
- Nome do produtor
- Unidade de produção
- **Progresso geral**: Ex: 75% completo
- Status: Rascunho ou Completo
- Data de última modificação

### Excluir PMO

⚠️ **Atenção:** Ação irreversível!

1. No card do PMO, clique em **"🗑️ Excluir"**
2. Confirme a exclusão
3. PMO será removido permanentemente

**Recomendação:** Exporte JSON antes de excluir (backup de segurança).

---

## Dicas e Boas Práticas

### 1. Salvamento e Backup

✅ **Faça backup semanalmente**
- Exporte JSON toda semana
- Guarde em local seguro (nuvem ou pen drive)

✅ **Confie no auto-save**
- Sistema salva a cada 30s automaticamente
- Mas você pode salvar manualmente também

❌ **Não limpe cache do navegador sem backup**
- Dados são armazenados localmente
- Limpar cache = perder dados

### 2. Preenchimento

✅ **Preencha com calma**
- Não precisa preencher tudo de uma vez
- Sistema salva seu progresso

✅ **Revise antes de validar**
- Leia tudo que preencheu
- Verifique se está correto

✅ **Mantenha documentos organizados**
- Tenha análises, notas fiscais, CAR em mãos
- Facilita upload

### 3. Validação

✅ **Valide frequentemente**
- Não deixe para validar só no final
- Valide após cada seção importante

✅ **Corrija erros imediatamente**
- Não acumule erros
- Mais fácil corrigir no momento

⚠️ **Atenção aos avisos**
- Avisos não impedem, mas são importantes
- Tente resolver quando possível

### 4. Documentos

✅ **Croqui detalhado**
- Invista tempo no croqui
- É o documento mais importante
- Facilitará muito a visita de verificação

✅ **Fotos de qualidade**
- Se fotografar documentos, use boa iluminação
- Evite sombras e reflexos
- Deixe legível

✅ **PDFs leves**
- Comprima PDFs grandes antes de subir
- Máximo 10MB por arquivo

### 5. Escopo

✅ **Seja realista**
- Marque apenas atividades que realmente pratica
- Não marque "por precaução"
- Mais atividades = mais anexos para preencher

⚠️ **Mudou o escopo?**
- Se adicionar/remover atividades na Seção 7
- Lembre de preencher/remover anexos correspondentes

### 6. Rastreabilidade

✅ **Mantenha caderno de campo**
- É obrigatório por lei (IN 19/2011)
- Registre TUDO:
  - Plantios (data, área, variedade)
  - Tratos (adubação, controle de pragas)
  - Colheitas (data, quantidade)
  - Vendas (data, quantidade, comprador)

✅ **Guarde notas fiscais**
- De insumos comprados
- Comprova origem orgânica
- Essencial para certificação

### 7. Navegadores

✅ **Use navegadores atualizados**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

❌ **Evite Internet Explorer**
- Não é suportado
- Use Edge em vez disso

✅ **Teste em outro navegador se tiver problemas**
- Às vezes um navegador dá problema
- Tente outro

### 8. Prazo

✅ **Comece cedo**
- PMO leva tempo para preencher bem
- Não deixe para última hora
- Média: 3-5 horas para completar

✅ **Planeje upload de documentos**
- Digitalize documentos com antecedência
- Tenha tudo pronto antes de começar

### 9. Ajuda

✅ **Consulte técnico da ANC**
- Se tiver dúvidas sobre preenchimento
- Técnico pode orientar

✅ **Leia o FAQ**
- Muitas dúvidas já estão respondidas
- Veja: [FAQ](faq.md)

✅ **Anote suas dúvidas**
- Durante preenchimento, anote dúvidas
- Pergunte tudo de uma vez ao técnico

### 10. Privacidade

⚠️ **Dados sensíveis**
- PMO contém dados pessoais
- Não use em computadores públicos
- Sempre faça logout ao terminar

✅ **Computador pessoal**
- Prefira seu próprio computador
- Mais seguro e prático

---

## Próximos Passos

1. **[Consulte o FAQ](faq.md)** para dúvidas rápidas
2. **[Veja o Troubleshooting](troubleshooting.md)** se tiver problemas
3. **Entre em contato com a ANC** para suporte: contato@anc.org.br

---

**Bom trabalho com seu PMO!**

Desenvolvido para **ANC - Associação de Agricultura Natural de Campinas e Região**
