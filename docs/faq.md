# FAQ - Perguntas Frequentes

> Respostas rápidas para as dúvidas mais comuns sobre o Sistema PMO Digital

## Índice

- [Geral](#geral)
- [Criação e Preenchimento](#criação-e-preenchimento)
- [Documentos e Upload](#documentos-e-upload)
- [Validação e Erros](#validação-e-erros)
- [Exportação e Backup](#exportação-e-backup)
- [Técnicas](#técnicas)
- [Certificação](#certificação)

---

## Geral

### O que é o Sistema PMO Digital?

É uma aplicação web que permite criar e gerenciar Planos de Manejo Orgânico (PMO) de forma digital, conforme a legislação brasileira (Portaria 52/2021 do MAPA).

### Preciso de internet para usar?

**Não**, o sistema funciona 100% offline. Você só precisa de internet para:
- Buscar endereço por CEP (opcional - pode preencher manualmente)
- Acessar o sistema pela primeira vez
- Fazer backup na nuvem (futuro)

### Meus dados ficam salvos?

**Sim**, automaticamente a cada 30 segundos no seu navegador (localStorage). Mas **recomendamos fazer backup** exportando JSON regularmente.

### Posso usar no celular?

**Sim**, o sistema é responsivo e funciona em smartphones e tablets. Mas a experiência é melhor em computador, especialmente para upload de documentos.

### É gratuito?

**Sim**, o sistema é desenvolvido para a ANC e disponível gratuitamente para produtores associados.

### Quantos PMOs posso criar?

**Ilimitado** (dentro dos limites de armazenamento do navegador - tipicamente 5-10MB).

---

## Criação e Preenchimento

### Como criar um novo PMO?

1. Acesse o Painel PMO
2. Clique em "➕ Novo PMO"
3. Preencha CPF/CNPJ, nome e unidade de produção
4. Clique em "Criar"

**[Veja guia completo](guia-usuario.md#criar-um-novo-pmo)**

### Preciso preencher tudo de uma vez?

**Não**, o sistema salva automaticamente seu progresso. Você pode preencher aos poucos e voltar depois.

### Como sei quais anexos preencher?

Na **Seção 7 do Cadastro Geral** (Atividades Orgânicas), marque suas atividades:
- Marcou hortaliças/frutas/grãos → Preencher **Anexo Vegetal**
- Marcou pecuária → Preencher **Anexo Animal**
- Marcou apicultura → Preencher **Anexo Apicultura**
- E assim por diante

O sistema habilita automaticamente apenas os anexos necessários.

### O que é obrigatório preencher?

**Mínimo obrigatório:**
- Cadastro Geral PMO completo (17 seções)
- Anexos conforme seu escopo
- Croqui da propriedade (upload)
- Aceite das declarações

### Quanto tempo leva para preencher?

**Média:** 3-5 horas para um PMO completo, dependendo da complexidade da produção.

### Posso editar depois de criar?

**Sim**, a qualquer momento. Abra o PMO no painel e clique em "Editar".

### Perdi o que estava preenchendo, tem como recuperar?

Se o navegador foi fechado: **Sim**, o sistema salva automaticamente.

Se limpou o cache do navegador: **Não**, por isso recomendamos exportar JSON regularmente como backup.

### Como buscar CEP automaticamente?

1. Digite o CEP no campo
2. Clique em "Buscar CEP"
3. Sistema preenche logradouro, bairro, cidade e estado automaticamente

Se não funcionar, pode preencher manualmente.

---

## Documentos e Upload

### Quais documentos são obrigatórios?

**Obrigatório:**
- **Croqui da propriedade** (PDF, JPG ou PNG)

**Recomendado:**
- CAR (Cadastro Ambiental Rural)
- Análises de solo e água
- Notas fiscais de insumos orgânicos

### Que formatos de arquivo aceita?

- **PDF**
- **JPG / JPEG**
- **PNG**

Tamanho máximo: **10MB por arquivo**

### Como fazer o croqui da propriedade?

**Opções:**
1. Desenhar à mão e fotografar/escanear
2. Usar Google Earth e marcar as áreas
3. Contratar técnico para fazer croqui profissional

**O que deve conter:**
- Limites da propriedade
- Áreas de cultivo identificadas
- APP e Reserva Legal
- Fontes de água
- Construções
- Vizinhos (especialmente se forem convencionais)
- Rosa dos ventos (Norte)

### Como faço upload de arquivos?

**Método 1:** Arraste o arquivo e solte na área de upload

**Método 2:** Clique em "Selecionar arquivos" e escolha no computador

### Não consigo fazer upload, o que fazer?

**Verifique:**
- Arquivo é PDF, JPG ou PNG?
- Tamanho é menor que 10MB?
- Navegador está atualizado?

Se arquivo é muito grande, comprima antes de subir.

### Como comprimir PDF grande?

**Online (gratuito):**
- [Smallpdf](https://smallpdf.com/pt/comprimir-pdf)
- [ILovePDF](https://www.ilovepdf.com/pt/comprimir_pdf)

**Dica:** Reduza qualidade de imagens dentro do PDF

---

## Validação e Erros

### O que significa o percentual de progresso?

É o percentual de campos obrigatórios que você já preencheu. **100% = tudo preenchido**.

### Como validar meu PMO?

Clique no botão **"✓ Validar Formulário"**. O sistema mostrará:
- ❌ **Erros**: DEVE corrigir antes de enviar
- ⚠️ **Avisos**: Recomenda-se corrigir, mas não impede envio

### Deu erro "CPF inválido", mas meu CPF está certo!

Verifique:
- Digitou todos os 11 números?
- Usou pontos e traço? (sistema aceita com ou sem)
- Não é CPF com dígitos repetidos (111.111.111-11)?

Se ainda der erro, pode ser que o CPF esteja incorreto. Confira em um validador online.

### O que é "período de conversão"?

É o tempo mínimo (12 meses) sem usar produtos químicos não permitidos. Se você usou agrotóxico há menos de 12 meses, sua propriedade ainda está "em conversão" para orgânico.

### Está pedindo CAR, o que é isso?

**CAR** = Cadastro Ambiental Rural. É obrigatório para todas propriedades rurais (Lei 12.651/2012).

**Como fazer:**
- Acesse [SICAR](https://www.car.gov.br/)
- Cadastre sua propriedade
- Obtenha número do CAR

**Sem CAR?** PMO não pode ser aprovado. Regularize antes.

### Erro "Coordenadas GPS fora do Brasil"

Verifique se:
- Latitude está entre -35° e 6°
- Longitude está entre -75° e -30°
- Não inverteu latitude e longitude

**Dica:** Use Google Maps:
1. Clique com botão direito no local da sua propriedade
2. Veja as coordenadas no topo
3. Primeiro número = Latitude
4. Segundo número = Longitude

---

## Exportação e Backup

### Qual a diferença entre exportar JSON e PDF?

**JSON:**
- Backup completo de todos dados
- Pode reimportar no sistema depois
- Para segurança / transferir para outro computador

**PDF:**
- Documento formatado para impressão
- Para enviar por e-mail / imprimir
- Não pode reimportar

### Como fazer backup do meu PMO?

1. Abra o PMO no painel
2. Clique em **"📥 Exportar JSON"**
3. Salve o arquivo em local seguro (pen drive, nuvem)

**Recomendação:** Faça backup semanal!

### Como restaurar de um backup JSON?

1. No painel, clique em **"Importar PMO"**
2. Selecione o arquivo JSON salvo
3. Sistema restaura todos dados

### Posso imprimir o PMO?

**Sim**, exporte como PDF e imprima normalmente.

### O PDF tem marca d'água "RASCUNHO", é normal?

**Sim**, PDFs de rascunho têm marca d'água. Quando o PMO for **aprovado** pelo avaliador, o PDF não terá mais marca d'água.

---

## Técnicas

### Qual navegador devo usar?

**Recomendados:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+

**Não use:** Internet Explorer (não é suportado)

### Limpei o cache do navegador e perdi tudo!

Infelizmente dados do localStorage são perdidos ao limpar cache. Por isso **sempre recomendamos backup JSON regular**.

**Para evitar no futuro:**
- Exporte JSON semanalmente
- Ao limpar cache, escolha "Manter cookies e dados de sites"

### Posso usar em mais de um computador?

**Sim**, mas os dados não sincronizam automaticamente (por enquanto).

**Como transferir:**
1. No computador 1: Exporte JSON
2. Copie arquivo para computador 2 (e-mail, pen drive, nuvem)
3. No computador 2: Importe JSON

### O sistema funciona sem JavaScript?

**Parcialmente**. Validação HTML5 funciona, mas recursos avançados (auto-save, tabelas dinâmicas, etc.) precisam de JavaScript.

### Quanto espaço o sistema usa?

**Típico:**
- PMO sem documentos: ~50-100KB
- PMO com documentos (croqui, CAR, análises): ~2-5MB
- Limite do navegador: ~5-10MB

**Se atingir limite:** Exporte PMOs antigos e delete-os do sistema.

### Posso usar em rede local sem internet?

**Sim**, basta ter os arquivos do sistema em um servidor local ou até mesmo abrir o `index.html` diretamente do disco.

---

## Certificação

### Quanto tempo até ser aprovado?

**Varia** conforme disponibilidade do avaliador. Típico: 7-30 dias.

### O que acontece após enviar PMO?

1. Avaliador recebe notificação (futuro - por enquanto, avise manualmente)
2. Avaliador analisa seu PMO
3. Avaliador emite parecer:
   - ✅ Aprovado
   - ⚠️ Aprovado com ressalvas
   - ❌ Não aprovado
   - ⏸️ Pendente de documentação
4. Você é notificado (futuro - por enquanto, avaliador envia e-mail)

### Posso editar após enviar?

**Sim**, mas o avaliador verá as alterações. Recomenda-se não fazer grandes mudanças após envio.

### O que são "ressalvas"?

São pontos que precisam ser melhorados, mas não impedem a certificação. Por exemplo:
- Análise de água pendente (recomendado, mas não obrigatório)
- Descrição de manejo poderia ser mais detalhada

Você recebe certificação, mas deve corrigir as ressalvas no prazo definido.

### Fui "não aprovado", e agora?

Leia o parecer do avaliador atentamente:
- Veja quais não conformidades foram apontadas
- Corrija todas
- Reenvie o PMO

**Não desanime!** Avaliador geralmente orienta como corrigir.

### Preciso refazer PMO todo ano?

**Sim**, PMO é anual (ano vigente). Mas você pode:
1. Duplicar PMO do ano anterior
2. Atualizar informações que mudaram
3. Validar e enviar

Muito mais rápido que fazer do zero!

### O que é SPG?

**SPG** = Sistema Participativo de Garantia. É um dos sistemas de certificação orgânica reconhecidos no Brasil.

Na **ANC**, produtores, técnicos e consumidores participam juntos do processo de certificação.

### PMO aprovado = já posso vender como orgânico?

**Depende**. PMO aprovado é um passo, mas você precisa:
1. Estar cadastrado no MAPA
2. Ter o Selo SisOrg
3. Cumprir todas as normas de produção orgânica

Consulte a ANC sobre os próximos passos.

---

## Ainda tem dúvidas?

### Documentação

- **[Guia do Usuário](guia-usuario.md)** - Guia completo para produtores
- **[Guia do Avaliador](guia-avaliador.md)** - Para avaliadores
- **[Troubleshooting](troubleshooting.md)** - Resolução de problemas

### Suporte

- **E-mail:** contato@anc.org.br
- **Website:** [www.anc.org.br](https://www.anc.org.br)

### Reportar Problema

Se encontrou um bug ou tem sugestão:
1. Anote o que aconteceu
2. Tire screenshot se possível
3. Envie para contato@anc.org.br com:
   - Descrição do problema
   - Navegador e versão
   - Passos para reproduzir

---

**Desenvolvido para ANC - Associação de Agricultura Natural de Campinas e Região**
