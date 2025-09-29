# PMO 2026 - Plano de Manejo Orgânico Digital

Sistema de formulário digital para o Plano de Manejo Orgânico da ANC - Associação de Agricultura Natural de Campinas.

## 📋 Sobre o Projeto

Este formulário digital foi desenvolvido para digitalizar o processo de preenchimento do Plano de Manejo Orgânico (PMO) para certificação orgânica participativa. O sistema permite que produtores rurais preencham todas as informações necessárias de forma intuitiva e organizada.

## ✨ Funcionalidades

### 🏢 Gestão de Dados
- **Dados da Empresa**: Cadastro completo com validação de CPF/CNPJ
- **Fornecedores/Responsáveis**: Sistema dinâmico para múltiplos responsáveis
- **Endereço**: Busca automática por CEP via API ViaCEP
- **Coordenadas GPS**: Obtenção automática de localização

### 📊 Formulários Inteligentes
- **Campos Dinâmicos**: Adicione/remova produtos, fornecedores e insumos
- **Validação em Tempo Real**: Verificação automática de dados
- **Auto-save**: Salvamento automático a cada 30 segundos
- **Máscaras de Input**: CPF, telefone, CEP formatados automaticamente

### 🗺️ Croqui da Propriedade
- **Upload de Arquivos**: Suporte a JPG, PNG, PDF
- **Desenho Digital**: Canvas interativo com ferramentas de desenho
- **Google Maps**: Integração para mapas da propriedade
- **Checklist**: Verificação de elementos obrigatórios

### 📋 Gestão de Produtos
- **Lista Dinâmica**: Adicione quantos produtos necessário
- **Sugestões Automáticas**: Lista de produtos comuns na agricultura orgânica
- **Importação**: Carregue listas via CSV ou JSON
- **Duplicação**: Clone produtos similares facilmente

### 🧪 Controle de Insumos
- **Categorização**: Fertilizantes, fitossanitários, sementes, substratos
- **Upload de Certificados**: Anexe notas fiscais e certificações
- **Rastreabilidade**: Controle completo de origem e uso

### 💼 Comercialização
- **Canais de Venda**: Mapeamento completo dos canais
- **Feiras**: Gestão detalhada de participação em feiras
- **Rastreabilidade**: Sistema de controle de produtos

### 📤 Exportação
- **JSON**: Exportação completa dos dados
- **PDF**: Geração automática de documento formatado
- **Backup Local**: Armazenamento no navegador

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design responsivo com Grid e Flexbox
- **JavaScript ES6+**: Funcionalidades interativas
- **Canvas API**: Sistema de desenho do croqui
- **Geolocation API**: Obtenção de coordenadas
- **File API**: Upload e manipulação de arquivos
- **html2pdf.js**: Geração de PDFs

## 📱 Responsividade

O sistema é totalmente responsivo, funcionando em:
- **Desktop**: Experiência completa
- **Tablets**: Interface adaptada para toque
- **Smartphones**: Layout otimizado para telas pequenas

## 🔧 Como Usar

### Instalação
1. Baixe todos os arquivos para uma pasta local
2. Abra `index.html` em um navegador moderno
3. Não é necessário servidor web para funcionalidades básicas

### Preenchimento
1. **Navegação**: Use o menu superior para pular entre seções
2. **Progresso**: Acompanhe o preenchimento na barra superior
3. **Validação**: Campos com erro são destacados em vermelho
4. **Salvamento**: Dados são salvos automaticamente

### Croqui
1. **Upload**: Faça upload de imagem existente
2. **Desenho**: Use as ferramentas de desenho digital
3. **Maps**: Integre mapa do Google Maps
4. **Checklist**: Marque todos os elementos obrigatórios

### Exportação
1. **Validar**: Clique em "Validar Formulário" antes de exportar
2. **JSON**: Para backup ou integração com outros sistemas
3. **PDF**: Para impressão ou arquivo final

## 🔍 Validações Implementadas

### Dados Pessoais
- ✅ CPF válido (algoritmo oficial)
- ✅ CNPJ válido (algoritmo oficial)
- ✅ Email válido (formato RFC)
- ✅ Telefone válido (10-11 dígitos)
- ✅ CEP válido (8 dígitos)

### Coordenadas
- ✅ Latitude/Longitude dentro do Brasil
- ✅ Formato decimal correto
- ⚠️ Aviso para coordenadas suspeitas

### Produtos
- ✅ Pelo menos um produto obrigatório
- ✅ Nomes únicos (aviso para duplicatas)
- ✅ Quantidade maior que zero
- ✅ Origem de muda OU semente obrigatória

### Fornecedores
- ✅ Pelo menos um responsável
- ✅ CPFs únicos
- ✅ Idade mínima (16 anos)
- ✅ Função obrigatória

### Histórico
- ⚠️ Recomendação de 3+ anos orgânicos
- ✅ Datas válidas
- ✅ Consistência de dados

## 📁 Estrutura do Projeto

```
html/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos responsivos
├── js/
│   ├── app.js             # Aplicação principal
│   ├── form-validation.js # Sistema de validação
│   ├── file-upload.js     # Upload de arquivos
│   ├── drawing.js         # Sistema de desenho
│   ├── dynamic-fields.js  # Campos dinâmicos
│   └── export.js          # Exportação JSON/PDF
└── assets/                # Recursos (se necessário)
```

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+ (recomendado)
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Funcionalidades Requeridas
- ✅ JavaScript habilitado
- ✅ LocalStorage disponível
- ✅ Canvas API (para desenho)
- ✅ File API (para uploads)
- ✅ Geolocation API (opcional)

## 🔒 Privacidade e Segurança

- **Dados Locais**: Tudo é armazenado no navegador do usuário
- **Sem Servidor**: Não há envio automático de dados
- **Backup Manual**: Exportação controlada pelo usuário
- **Validação Client-Side**: Verificação local dos dados

## ⚠️ Limitações Conhecidas

- **Tamanho de Arquivos**: Máximo 10MB por arquivo
- **Navegadores Antigos**: Funcionalidades limitadas no IE
- **JavaScript Obrigatório**: Sistema não funciona sem JS
- **Armazenamento Local**: Dados podem ser perdidos se limpar cache

## 🚀 Melhorias Futuras

### Versão 2.0 (Planejada)
- [ ] Integração com Google Maps API
- [ ] Assinatura digital
- [ ] Modo offline completo
- [ ] Sincronização em nuvem
- [ ] Relatórios avançados

### Funcionalidades Adicionais
- [ ] Lembretes por email
- [ ] Integração com cadastros oficiais
- [ ] Dashboard de acompanhamento
- [ ] Sistema multi-idiomas

## 📞 Suporte

Para dúvidas ou suporte:
- **ANC**: Associação de Agricultura Natural de Campinas
- **Desenvolvido para**: Sistema Participativo de Garantia da Qualidade Orgânica
- **Ano**: 2026

## 📄 Licença

Este projeto foi desenvolvido especificamente para a ANC e seu sistema de certificação orgânica participativa.

---

**Desenvolvido com ❤️ para a agricultura orgânica brasileira**