# Changelog - Histórico de Versões

> Registro de todas as alterações, melhorias e correções no Sistema PMO Digital

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)

Tipos de mudanças:
- `Added` - Novas funcionalidades
- `Changed` - Mudanças em funcionalidades existentes
- `Deprecated` - Funcionalidades que serão removidas
- `Removed` - Funcionalidades removidas
- `Fixed` - Correções de bugs
- `Security` - Correções de vulnerabilidades

---

## [1.0.0] - 2025-01-30

### Added

#### Funcionalidades Principais
- Sistema completo de gerenciamento de múltiplos PMOs
- Painel centralizado com cards de PMOs
- ID único para cada PMO: `pmo_{ano}_{cpf_cnpj}_{unidade}`
- Auto-save a cada 30 segundos
- Indicador visual de última gravação

#### Formulários
- **Cadastro Geral PMO** com 17 seções obrigatórias:
  1. Identificação do Produtor/Empresa
  2. Dados de Contato
  3. Endereço da Unidade de Produção
  4. Dados da Propriedade
  5. Histórico de Manejo Orgânico
  6. Responsáveis pela Produção
  7. Atividades Orgânicas (Escopo)
  8. Histórico de Aplicações
  9. Lista de Produtos a Certificar
  10. Preservação Ambiental
  11. Recursos Hídricos
  12. Comercialização
  13. Controles e Registros
  14. Produção de Subsistência
  15. Produção Paralela
  16. Upload de Documentos
  17. Declarações e Compromissos

- **Anexo Vegetal** - Produção vegetal (hortaliças, frutas, grãos, medicinais)
- **Anexo Animal** - Pecuária
- **Anexo Cogumelo** - Cultivo de cogumelos
- **Anexo Apicultura** - Apicultura
- **Anexo Processamento** - Produtos processados
- **Anexo Processamento Mínimo** - Produtos minimamente processados

#### Sistema de Escopo
- Habilitação automática de anexos baseado em atividades selecionadas
- Navegação inteligente (só mostra formulários necessários)
- Mapeamento de atividades → anexos

#### Validação
- Validação HTML5 nativa (required, pattern, type)
- Validação JavaScript customizada:
  - CPF brasileiro (algoritmo oficial)
  - CNPJ brasileiro (algoritmo oficial)
  - E-mail
  - Telefone
  - CEP
  - Coordenadas GPS (limites do Brasil)
- Validação de legislação:
  - Período de conversão (mínimo 12 meses)
  - CAR obrigatório
  - Rastreabilidade obrigatória
  - Croqui obrigatório
- Relatório de validação com erros e avisos
- Cálculo de percentual de preenchimento

#### Upload de Arquivos
- Drag-and-drop de arquivos
- Seleção manual de arquivos
- Formatos suportados: PDF, JPG, JPEG, PNG
- Tamanho máximo: 10MB por arquivo
- Conversão automática para Base64
- Preview instantâneo para imagens
- Armazenamento no localStorage

#### Busca e Filtros
- Busca por nome, CPF/CNPJ, unidade
- Filtros por:
  - Grupo SPG
  - Ano vigente
  - Status (rascunho/completo)
- Ordenação por:
  - Mais recentes/antigos
  - Maior/menor progresso
  - Alfabética (A-Z/Z-A)

#### Progresso
- Cálculo automático de progresso por formulário
- Barra de progresso visual
- Percentual numérico
- Cores baseadas em status:
  - 0-40%: Vermelho (incompleto)
  - 41-80%: Amarelo (em andamento)
  - 81-100%: Verde (completo)
- Atualização em tempo real durante digitação

#### Exportação
- **Exportar JSON**: Backup completo de todos dados
- **Exportar PDF**: Documento formatado (planejado)
- **Importar JSON**: Restaurar de backup

#### Componentes Reutilizáveis
- **PMOStorageManager**: Gerenciamento de múltiplos PMOs
- **PMOScopeManager**: Gerenciamento de escopo
- **PMOTables**: Tabelas dinâmicas (adicionar/remover linhas)
- **ProgressTracker**: Rastreamento de progresso
- **Validators**: Funções de validação
- **Upload**: Sistema de upload de arquivos

#### UI/UX
- Máscaras automáticas de entrada:
  - CPF: 000.000.000-00
  - CNPJ: 00.000.000/0000-00
  - CEP: 00000-000
  - Telefone: (00) 00000-0000
- Integração com API ViaCEP para busca de endereço
- Design responsivo (mobile, tablet, desktop)
- Framework CSS modular
- Tema verde (agricultura/orgânico)

#### Documentação
- README principal
- Documentação completa do sistema (DOCUMENTACAO-SISTEMA-PMO.md)
- Documentação estruturada em `docs/`:
  - README.md (visão geral)
  - guia-usuario.md (para produtores)
  - guia-avaliador.md (para avaliadores)
  - documentacao-tecnica.md (para desenvolvedores)
  - faq.md (perguntas frequentes)
  - troubleshooting.md (resolução de problemas)
  - changelog.md (este arquivo)

### Technical

#### Arquitetura
- Frontend-first, offline-first
- 100% JavaScript vanilla (sem frameworks)
- Armazenamento: localStorage
- Estrutura modular de componentes

#### Tecnologias
- HTML5 (semântica, validação nativa, APIs)
- CSS3 (variáveis, flexbox, grid, animações)
- JavaScript ES6+ (classes, modules, promises, async/await)

#### APIs Externas
- ViaCEP: Busca de endereço por CEP

#### Compatibilidade
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Estrutura de Armazenamento
```javascript
// Registry
pmo_registry: {
  current_pmo_id: String,
  pmos: Array<PMOMeta>
}

// Dados de cada PMO
pmo_{id}_data: {
  cadastro_geral_pmo: Object,
  anexo_vegetal: Object,
  // ... outros formulários
  documentos_anexados: Object,
  pdfs_gerados: Object
}

// Escopo
pmo_{id}_scope: {
  pretende_certificar: Boolean,
  activities: Object
}
```

### Security
- Sanitização de inputs para prevenir XSS
- Validação rigorosa de CPF/CNPJ
- Validação de coordenadas GPS

### Known Issues
- Geração de PDF ainda não implementada (usa Print to PDF)
- Não há backend - dados só ficam no navegador
- Limite de armazenamento do localStorage (~5-10MB)
- Sincronização cloud não implementada
- Sem autenticação de usuários

---

## [Unreleased] - Próximas Versões

### Planejado para v1.1.0

#### Added
- Geração de PDF com template oficial da ANC
- Assinatura digital em PDF
- QR Code de validação em PDF
- Marca d'água "RASCUNHO" em PDFs não aprovados

#### Changed
- Melhorar UI/UX do painel de PMOs
- Otimizar performance de cálculo de progresso

#### Fixed
- Bugs conhecidos de validação

### Planejado para v1.2.0

#### Added
- Backend REST API (Node.js + Express)
- Banco de dados MongoDB
- Autenticação JWT
- Sincronização cloud automática
- Sistema de notificações por e-mail

### Planejado para v2.0.0

#### Added
- PWA (Progressive Web App)
- Offline sync com service workers
- IndexedDB para arquivos grandes
- Integração BrasilAPI (validação CNPJ)
- Integração SICAR (validação CAR)
- Google Maps (validação GPS)
- Módulo de relatórios avançado
- Dashboard de indicadores
- Versionamento de PMOs
- Histórico de alterações
- Auditoria completa

#### Changed
- Migrar de localStorage para IndexedDB
- Refatorar componentes para melhor modularidade

---

## Contribuindo

Sugestões de melhorias e reporte de bugs são bem-vindos!

**Como contribuir:**
1. Abra uma issue descrevendo o problema ou sugestão
2. Fork o repositório
3. Crie um branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
5. Push para o branch (`git push origin feature/MinhaFeature`)
6. Abra um Pull Request

**Padrão de commits:**
```
tipo(escopo): descrição

feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, estilos
refactor: refatoração de código
test: testes
chore: manutenção
```

---

## Versionamento

Este projeto usa [Semantic Versioning](https://semver.org/lang/pt-BR/).

**Formato:** MAJOR.MINOR.PATCH

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis

---

## Contato

**Desenvolvido para:**
ANC - Associação de Agricultura Natural de Campinas e Região

**Suporte:**
- E-mail: contato@anc.org.br
- Website: [www.anc.org.br](https://www.anc.org.br)

---

**Desenvolvido com assistência de Claude Code (Anthropic)**

*Última atualização: 30 de Janeiro de 2025*
