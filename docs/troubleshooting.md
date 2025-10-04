# Troubleshooting - Resolução de Problemas

> Soluções para os problemas mais comuns no Sistema PMO Digital

## Índice

- [Problemas de Acesso](#problemas-de-acesso)
- [Problemas de Salvamento](#problemas-de-salvamento)
- [Problemas de Upload](#problemas-de-upload)
- [Problemas de Validação](#problemas-de-validação)
- [Problemas de Exportação](#problemas-de-exportação)
- [Problemas de Performance](#problemas-de-performance)
- [Erros Específicos](#erros-específicos)

---

## Problemas de Acesso

### Página não carrega / Tela em branco

**Possíveis causas:**

1. **JavaScript desabilitado**

   **Verificar:**
   - Chrome: Settings → Privacy and security → Site settings → JavaScript → Allowed
   - Firefox: about:config → javascript.enabled = true

   **Solução:** Habilite JavaScript

2. **Navegador muito antigo**

   **Verificar:** Qual navegador e versão está usando?

   **Solução:** Atualize para:
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

3. **Arquivo corrompido**

   **Solução:** Baixe novamente os arquivos do sistema

4. **Erro no console**

   **Verificar:**
   - F12 → Console
   - Veja se há erros em vermelho

   **Solução:** Anote o erro e reporte para suporte

### Sistema abre mas formulário não aparece

**Causa:** Arquivo HTML do formulário não foi encontrado

**Solução:**
1. Verifique que todos arquivos foram baixados
2. Estrutura de pastas está correta
3. Caminho no código está correto

### Botões não funcionam

**Causa:** JavaScript não carregou ou erro de script

**Verificar:**
1. F12 → Console
2. Veja erros

**Solução:**
- Se erro de "module not found": verifique caminhos dos arquivos
- Se erro de sintaxe: código foi alterado incorretamente
- Limpe cache: Ctrl+Shift+Del → Clear cache

---

## Problemas de Salvamento

### "Última gravação" não atualiza

**Causa:** Auto-save não está funcionando

**Verificar:**
1. F12 → Console
2. Veja se há erro no auto-save

**Solução temporária:** Clique em "💾 Salvar Rascunho" manualmente

**Solução permanente:**
- Recarregue página: F5
- Limpe cache do navegador
- Use outro navegador

### Dados desapareceram após fechar navegador

**Causa:** localStorage foi limpo ou navegador em modo privado

**Verificar:**
1. Está em modo anônimo/privado?
   - Chrome: Ícone de 🕵️ no canto
   - Firefox: Ícone de máscara roxa

**Solução:**
- Use navegador em modo normal (não privado)
- Se limpou cache, dados foram perdidos permanentemente
- Restaure de backup JSON se tiver

**Prevenção:** Sempre exporte JSON regularmente!

### Salvou mas ao voltar dados estão vazios

**Causa:** PMO incorreto foi carregado ou localStorage corrompido

**Verificar:**
1. F12 → Application → Local Storage
2. Veja se chave `pmo_registry` existe
3. Veja se `pmo_{id}_data` existe

**Solução:**
1. No console (F12):
   ```javascript
   const manager = new PMOStorageManager();
   console.log(manager.listAllPMOs());
   ```
2. Veja lista de PMOs
3. Carregue o correto manualmente

**Se dados foram perdidos:**
- Restaure de backup JSON
- Ou recomece o preenchimento

### Erro "QuotaExceededError"

**Causa:** Espaço do localStorage esgotado (limite ~5-10MB)

**Solução:**
1. **Imediato:** Remova arquivos grandes anexados
2. **Permanente:**
   - Exporte PMOs antigos como JSON
   - Delete PMOs antigos do sistema
   - Comprima arquivos antes de subir

**Verificar uso:**
```javascript
// F12 → Console
let total = 0;
for (let key in localStorage) {
  total += localStorage[key].length + key.length;
}
console.log('Uso:', (total / 1024 / 1024).toFixed(2), 'MB');
```

---

## Problemas de Upload

### Não consigo fazer upload de arquivo

**Possíveis causas e soluções:**

#### 1. Arquivo muito grande

**Limite:** 10MB por arquivo

**Verificar:** Tamanho do arquivo no computador

**Solução:**
- Comprima o arquivo antes de subir
- PDFs: use [Smallpdf](https://smallpdf.com/pt/comprimir-pdf)
- Imagens: use [TinyPNG](https://tinypng.com/)

#### 2. Formato não suportado

**Formatos aceitos:** PDF, JPG, JPEG, PNG

**Solução:** Converta para formato aceito

#### 3. Nome do arquivo com caracteres especiais

**Problema:** Acentos, espaços, símbolos podem causar erro

**Solução:** Renomeie arquivo para:
- Apenas letras, números, hífen e underscore
- Exemplo: `croqui_propriedade.pdf`

#### 4. Arquivo corrompido

**Solução:** Tente abrir arquivo fora do sistema
- Se não abrir: arquivo está corrompido
- Gere novamente o arquivo

### Upload fica travado em "Carregando..."

**Causa:** Arquivo muito grande ou navegador lento

**Solução:**
1. Aguarde (pode levar 1-2 minutos para arquivos grandes)
2. Se travar mais de 5 minutos:
   - Recarregue página: F5
   - Comprima arquivo
   - Tente novamente

### Preview da imagem não aparece

**Causa:** Formato não suportado para preview ou arquivo corrompido

**Solução:**
- Se é PDF: preview não é gerado (só nome aparece)
- Se é imagem: verifique se formato é JPG/PNG
- Verifique se arquivo não está corrompido

### Arquivo sumiu após upload

**Causa:** Não foi salvo ou localStorage cheio

**Verificar:**
1. Clique em "💾 Salvar Rascunho" após upload
2. Verifique se aparece na lista de arquivos anexados
3. Recarregue página e veja se aparece

**Solução:** Faça upload novamente

---

## Problemas de Validação

### Validação não funciona / Botão não responde

**Causa:** Erro de JavaScript

**Solução:**
1. F12 → Console → Veja erros
2. Recarregue página: F5
3. Tente novamente

### Diz que CPF é inválido, mas está correto

**Verificar:**
1. Tem 11 dígitos?
2. Não é CPF com dígitos repetidos (111.111.111-11)?
3. Dígitos verificadores estão corretos?

**Testar:** Use [validador online](https://www.4devs.com.br/validador_cpf) para confirmar

**Se continua dando erro:** Pode ser bug - reporte para suporte

### Validação diz "Falta preencher campo X", mas já preenchi

**Causa:** Campo está vazio ou formato errado

**Verificar:**
1. Campo realmente tem texto?
2. Se é seleção (dropdown): tem opção selecionada?
3. Se é checkbox: está marcado?
4. Há espaços vazios no início/fim?

**Solução:** Preencha novamente o campo

### Percentual de progresso não atualiza

**Causa:** Cálculo não está rodando

**Solução:**
1. Clique em "💾 Salvar Rascunho"
2. Recarregue página
3. Progresso deve atualizar

### Aviso sobre período de conversão

**Mensagem:** "Período de conversão incompleto. Faltam X meses"

**Causa:** Você usou produtos não permitidos há menos de 12 meses

**Isso é problema?**
- Se faltar pouco (1-2 meses): Pode ser aprovado com ressalva
- Se faltar muito (6+ meses): Precisa aguardar

**Solução:** Aguarde completar 12 meses desde última aplicação

---

## Problemas de Exportação

### Exportar JSON não baixa arquivo

**Possíveis causas:**

#### 1. Popup bloqueado

**Verificar:** Ícone de popup bloqueado na barra de endereço

**Solução:** Permita popups para este site

#### 2. Download automático desabilitado

**Solução:**
- Chrome: Settings → Downloads → Ask where to save each file → Desabilite
- Firefox: Configurações → Arquivos e Aplicações → Salvar arquivos em...

#### 3. Erro de JavaScript

**Verificar:** F12 → Console → Erros

**Solução:** Recarregue página e tente novamente

### JSON baixado está vazio

**Causa:** PMO sem dados ou erro ao gerar

**Verificar:**
1. PMO realmente tem dados preenchidos?
2. Abra JSON em editor de texto e veja conteúdo

**Solução:**
- Se JSON tem `{}`: PMO está vazio
- Se JSON tem dados: está correto

### Não consigo importar JSON

**Possíveis causas:**

#### 1. Arquivo JSON corrompido

**Verificar:** Abra em [JSON Validator](https://jsonformatter.curiousconcept.com/)

**Solução:** Se inválido, arquivo está corrompido - não pode importar

#### 2. JSON de outro sistema

**Causa:** JSON não é do Sistema PMO Digital

**Solução:** Só pode importar JSONs exportados por este sistema

#### 3. Versão incompatível

**Causa:** JSON de versão muito antiga ou muito nova

**Solução:** Sistema tentará migrar, mas pode falhar

### Exportar PDF não funciona

**Status atual:** Geração de PDF está em desenvolvimento

**Alternativa temporária:**
1. Imprima página (Ctrl+P)
2. Escolha "Salvar como PDF"

---

## Problemas de Performance

### Sistema está lento

**Possíveis causas:**

#### 1. Muitos PMOs salvos

**Solução:**
- Exporte PMOs antigos
- Delete PMOs que não precisa mais
- Mantenha apenas PMOs do ano atual

#### 2. Navegador com muitas abas abertas

**Solução:** Feche abas desnecessárias

#### 3. Computador lento

**Solução:**
- Feche outros programas
- Reinicie computador
- Use navegador mais leve (Chrome)

#### 4. Arquivo muito grande anexado

**Solução:** Comprima arquivos grandes antes de anexar

### Formulário trava ao digitar

**Causa:** Auto-save rodando enquanto digita

**Solução:**
- É normal pequeno delay
- Se travar muito: desabilite auto-save temporariamente
- Salve manualmente: "💾 Salvar Rascunho"

### Busca no painel não funciona

**Causa:** Muitos PMOs cadastrados

**Solução:**
1. Use filtros para reduzir lista
2. Digite termo completo (não parcial)
3. Recarregue página

---

## Erros Específicos

### Erro: "Cannot read property 'X' of undefined"

**Causa:** Dado não existe no localStorage

**Solução:**
1. Limpe localStorage:
   ```javascript
   localStorage.clear();
   ```
2. Recarregue página
3. Importe backup JSON se tiver

### Erro: "Failed to fetch"

**Causa:** API externa (ViaCEP) não respondeu

**Quando acontece:** Buscar CEP

**Solução:**
- Verifique internet
- Tente novamente
- Ou preencha endereço manualmente

### Erro: "localStorage is not defined"

**Causa:** Navegador não suporta localStorage ou está desabilitado

**Solução:**
- Use navegador moderno
- Verifique se cookies estão habilitados
- Não use modo privado

### Erro: "Maximum call stack size exceeded"

**Causa:** Loop infinito ou recursão excessiva

**Solução:**
1. Recarregue página: F5
2. Se persistir: é bug - reporte para suporte

### Erro: "TypeError: X is not a function"

**Causa:** Função não foi carregada ou nome errado

**Solução:**
1. Verifique que todos arquivos JS foram carregados
2. F12 → Network → Veja se há arquivos em vermelho
3. Recarregue página

---

## Problemas de Navegador

### Chrome

**Problema comum:** Avisos de "Not secure"

**Causa:** Arquivo local (file://) não é HTTPS

**Solução:** É normal, pode ignorar

### Firefox

**Problema comum:** localStorage limita em 10MB

**Solução:** Se atingir limite, delete PMOs antigos

### Safari

**Problema comum:** localStorage é 5MB (menor que outros)

**Solução:** Use Chrome se possível, ou delete PMOs antigos

### Edge

**Problema comum:** Compatibilidade com versões antigas

**Solução:** Atualize para versão mais recente

---

## Como Reportar Problema

Se não encontrou solução aqui:

### 1. Colete Informações

- Navegador e versão (ex: Chrome 120)
- Sistema operacional (Windows, Mac, Linux)
- O que você estava fazendo quando erro ocorreu
- Mensagem de erro (se houver)
- Screenshot (se possível)

### 2. Verifique Console

1. F12 → Console
2. Copie mensagens de erro
3. Inclua no reporte

### 3. Envie para Suporte

**E-mail:** contato@anc.org.br

**Formato:**
```
Assunto: [Bug] Descrição curta do problema

Navegador: Chrome 120
Sistema: Windows 11

Descrição:
Ao tentar exportar JSON, não baixa arquivo.

Passos para reproduzir:
1. Abri PMO existente
2. Cliquei em "Exportar JSON"
3. Nada aconteceu

Erro no console:
[Cole mensagem de erro aqui]

[Anexe screenshot se possível]
```

---

## Soluções Rápidas (Cheatsheet)

| Problema | Solução Rápida |
|----------|---------------|
| Página não carrega | F5 (recarregar) |
| Botão não funciona | F12 → Console → veja erro |
| Dados sumiram | Restaure backup JSON |
| Upload não funciona | Verifique tamanho < 10MB |
| Validação não funciona | Recarregue página |
| Exportar não funciona | Permita popups |
| Sistema lento | Delete PMOs antigos |
| localStorage cheio | Delete PMOs antigos |
| Erro no console | Copie e envie para suporte |

---

## Comandos Úteis (Console)

Abra console: F12 → Console

```javascript
// Ver todos PMOs
const manager = new PMOStorageManager();
manager.listAllPMOs();

// Ver PMO específico
manager.getPMO('pmo_2025_12345678900_sitio');

// Ver uso de localStorage
let total = 0;
for (let key in localStorage) {
  total += localStorage[key].length;
}
console.log((total / 1024 / 1024).toFixed(2) + ' MB');

// Limpar tudo (CUIDADO!)
localStorage.clear();

// Exportar PMO manualmente
const pmo = manager.getPMO('pmo_2025_12345678900_sitio');
console.log(JSON.stringify(pmo, null, 2));
// Copie e salve em arquivo .json
```

---

## Links Úteis

- **[FAQ](faq.md)** - Perguntas frequentes
- **[Guia do Usuário](guia-usuario.md)** - Como usar o sistema
- **[Documentação Técnica](documentacao-tecnica.md)** - Para desenvolvedores

---

**Ainda com problemas?** Entre em contato: contato@anc.org.br

**Desenvolvido para ANC - Associação de Agricultura Natural de Campinas e Região**
