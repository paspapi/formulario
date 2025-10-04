# Sistema PMO Digital - ANC

> Sistema web completo para criação, gerenciamento e certificação de Planos de Manejo Orgânico (PMO)

## O que é?

O **Sistema PMO Digital** é uma aplicação web desenvolvida para a **ANC - Associação de Agricultura Natural de Campinas e Região** que permite a produtores orgânicos criar e gerenciar seus Planos de Manejo Orgânico de forma digital, simplificada e conforme a legislação brasileira (Portaria 52/2021 do MAPA).

## Para quem é?

- **Produtores Orgânicos**: Agricultores familiares e empresas que precisam criar PMOs
- **Técnicos da ANC**: Orientadores que auxiliam no preenchimento
- **Avaliadores**: Responsáveis pela certificação participativa
- **Gestores SPG**: Coordenadores do Sistema Participativo de Garantia

## Principais Recursos

- ✅ **Criação de PMOs digitais** com formulários inteligentes
- ✅ **Gerenciamento de múltiplos PMOs** simultaneamente
- ✅ **Validação automática** conforme legislação brasileira
- ✅ **Trabalho offline** com salvamento automático
- ✅ **Upload de documentos** (croquis, análises, CAR)
- ✅ **Exportação em PDF e JSON**
- ✅ **Sistema de avaliação** para certificadores
- ✅ **Acompanhamento de progresso** em tempo real

## Início Rápido

### Para Produtores

1. **Acesse o sistema**: Abra o arquivo `index.html` no navegador
2. **Crie um novo PMO**: Clique em "Novo PMO" no painel
3. **Preencha o cadastro**: Complete as 17 seções do formulário principal
4. **Selecione o escopo**: Na seção 7, marque as atividades que você pratica
5. **Preencha os anexos**: Complete apenas os anexos do seu escopo
6. **Valide e exporte**: Verifique erros e exporte seu PMO

👉 **[Guia Completo para Produtores](guia-usuario.md)**

### Para Avaliadores

1. **Acesse o painel**: Veja todos os PMOs cadastrados
2. **Selecione um PMO**: Clique em "Avaliar" no PMO desejado
3. **Preencha a avaliação**: Use o checklist e adicione observações
4. **Defina o status**: Aprovado, com ressalvas, ou não aprovado
5. **Exporte o relatório**: Gere o documento de avaliação

👉 **[Guia Completo para Avaliadores](guia-avaliador.md)**

## Documentação

| Documento | Descrição | Público |
|-----------|-----------|---------|
| [Guia do Usuário](guia-usuario.md) | Como usar o sistema para criar PMOs | Produtores |
| [Guia do Avaliador](guia-avaliador.md) | Como avaliar e certificar PMOs | Avaliadores |
| [Documentação Técnica](documentacao-tecnica.md) | Arquitetura e desenvolvimento | Desenvolvedores |
| [FAQ](faq.md) | Perguntas frequentes | Todos |
| [Troubleshooting](troubleshooting.md) | Resolução de problemas | Todos |
| [Changelog](changelog.md) | Histórico de versões | Todos |

## Requisitos do Sistema

- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: Habilitado
- **Armazenamento**: 10MB+ de espaço no localStorage
- **Internet**: Necessária apenas para APIs externas (CEP)

## Funcionalidades Principais

### 1. Formulários Inteligentes

- 17 seções completas conforme Portaria 52/2021
- Validação em tempo real
- Máscaras automáticas (CPF, CNPJ, telefone, CEP)
- Busca automática de endereço por CEP
- Tabelas dinâmicas (adicionar/remover linhas)

### 2. Sistema de Anexos Dinâmico

O sistema habilita automaticamente apenas os anexos necessários baseado no escopo selecionado:

- 🌱 **Anexo Vegetal**: Para hortaliças, frutas, grãos, plantas medicinais
- 🐄 **Anexo Animal**: Para pecuária
- 🍄 **Anexo Cogumelo**: Para cultivo de cogumelos
- 🐝 **Anexo Apicultura**: Para apicultura
- 🏭 **Anexo Processamento**: Para produtos processados
- 🥗 **Anexo Proc. Mínimo**: Para processamento mínimo

### 3. Salvamento Automático

- Auto-save a cada 30 segundos
- Funciona 100% offline
- Dados armazenados localmente no navegador
- Indicador visual de última gravação

### 4. Validação Conforme Legislação

- ✅ Portaria 52/2021 MAPA
- ✅ Lei 10.831/2003 (Lei de Orgânicos)
- ✅ IN 19/2011 (Rastreabilidade)
- ✅ Lei 12.651/2012 (CAR obrigatório)

### 5. Múltiplos PMOs

- Gerencie vários PMOs simultaneamente
- Cada PMO com ID único
- Filtros e busca avançada
- Acompanhamento de progresso individual

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Armazenamento**: localStorage (offline-first)
- **APIs**: ViaCEP (busca de endereço)
- **Exportação**: JSON, PDF

## Suporte

### Precisa de Ajuda?

- 📖 Consulte o [FAQ](faq.md)
- 🔧 Veja [Troubleshooting](troubleshooting.md)
- 📧 Entre em contato: contato@anc.org.br

### Reportar Problemas

1. Verifique se o problema já não foi reportado
2. Colete informações (navegador, versão, passos para reproduzir)
3. Envie para: contato@anc.org.br ou abra uma issue

## Licença

Desenvolvido para **ANC - Associação de Agricultura Natural de Campinas e Região**

**Versão**: 1.0.0
**Última atualização**: Janeiro 2025

---

## Próximos Passos

1. **[Leia o Guia do Usuário](guia-usuario.md)** para aprender a usar o sistema
2. **[Consulte o FAQ](faq.md)** para respostas rápidas
3. **[Veja o Troubleshooting](troubleshooting.md)** se encontrar problemas

---

**Desenvolvido com assistência de Claude Code (Anthropic)**
