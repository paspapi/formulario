# Prompt para Criação de Formulário Digital - Anexo Produção Primária Vegetal PMO

## Contexto
Crie um formulário HTML5 responsivo e interativo para o Anexo de Produção Primária Vegetal do Plano de Manejo Orgânico (PMO) da ANC. Este anexo detalha todas as práticas agrícolas, insumos, manejo do solo e controles específicos da produção vegetal orgânica.

## Requisitos Técnicos
- HTML5 semântico com validações nativas
- CSS3 com design responsivo e acessível
- JavaScript para interatividade e validações complexas
- Sistema de auto-save a cada 30 segundos
- Integração com formulário principal do PMO
- Exportação em JSON e PDF
- Suporte offline após primeiro carregamento

---

## SEÇÃO 1: PREPARO DO SOLO

```html
<section id="preparo-solo" class="form-section">
  <h2>1. Preparo do Solo para Plantio</h2>
  
  <div class="section-info">
    <p class="instruction">ℹ️ Descreva todas as práticas utilizadas no preparo do solo</p>
    <p class="alert">⚠️ Práticas não declaradas podem resultar em não-conformidade</p>
  </div>
  
  <div class="preparo-opcoes">
    <h3>Métodos de Preparo Utilizados:</h3>
    <label class="checkbox-enhanced">
      <input type="checkbox" name="preparo_rocada" onchange="showDetails(this)">
      <span>Roçada</span>
    </label>
    <div class="detail-field" style="display:none;">
      <input type="text" placeholder="Frequência e equipamento utilizado">
    </div>
    
    <label class="checkbox-enhanced">
      <input type="checkbox" name="preparo_aracao" onchange="showDetails(this)">
      <span>Aração</span>
    </label>
    <div class="detail-field" style="display:none;">
      <select name="aracao_tipo">
        <option value="">Selecione o tipo...</option>
        <option>Aração profunda (>20cm)</option>
        <option>Aração média (10-20cm)</option>
        <option>Aração superficial (<10cm)</option>
      </select>
      <input type="text" placeholder="Equipamento e época do ano">
    </div>
    
    <label class="checkbox-enhanced">
      <input type="checkbox" name="preparo_gradagem" onchange="showDetails(this)">
      <span>Gradagem</span>
    </label>
    <div class="detail-field" style="display:none;">
      <select name="gradagem_tipo">
        <option>Grade leve</option>
        <option>Grade pesada</option>
        <option>Grade niveladora</option>
      </select>
    </div>
    
    <label class="checkbox-enhanced">
      <input type="checkbox" name="preparo_outros" onchange="showOthers(this)">
      <span>Outros métodos</span>
    </label>
    <div id="outros-preparo" style="display:none;">
      <textarea name="preparo_outros_desc" 
                placeholder="Descreva outros métodos de preparo (ex: subsolagem, escarificação, preparo mínimo, plantio direto)"
                rows="3"></textarea>
    </div>
  </div>
  
  <div class="plantio-direto-check">
    <label class="highlight-check">
      <input type="checkbox" name="plantio_direto" onchange="togglePlantioDetails(this)">
      <span>🌱 Utilizo Sistema de Plantio Direto</span>
    </label>
    <div id="plantio-direto-details" style="display:none;">
      <input type="number" name="plantio_direto_anos" min="0" placeholder="Há quantos anos?">
      <input type="number" name="plantio_direto_area" min="0" step="0.01" placeholder="Área em hectares">
      <textarea name="plantio_direto_culturas" placeholder="Quais culturas em plantio direto?"></textarea>
    </div>
  </div>
</section>
```

---

## SEÇÃO 2: PRÁTICAS CONSERVACIONISTAS

```html
<section id="praticas-conservacionistas" class="form-section">
  <h2>2. Práticas Conservacionistas</h2>
  
  <div class="conservation-practices">
    <!-- Rotação de Culturas -->
    <div class="practice-block">
      <label class="practice-header">
        <input type="checkbox" name="rotacao_culturas" onchange="togglePractice(this)">
        <span>ROTAÇÃO DE CULTURAS</span>
      </label>
      <div class="practice-details" style="display:none;">
        <textarea name="rotacao_descricao" 
                  placeholder="Descreva o sistema de rotação (ex: Hortaliças → Leguminosas → Gramíneas → Pousio)"
                  rows="3"></textarea>
        <div class="rotation-cycle">
          <label>Ciclo de rotação (meses):</label>
          <input type="number" name="rotacao_ciclo" min="1" max="48">
        </div>
        <div class="rotation-benefits">
          <p>Benefícios observados:</p>
          <label><input type="checkbox" name="rotacao_pragas"> Redução de pragas</label>
          <label><input type="checkbox" name="rotacao_doencas"> Redução de doenças</label>
          <label><input type="checkbox" name="rotacao_fertilidade"> Melhoria da fertilidade</label>
          <label><input type="checkbox" name="rotacao_ervas"> Controle de ervas espontâneas</label>
        </div>
      </div>
    </div>
    
    <!-- Adubação Verde -->
    <div class="practice-block">
      <label class="practice-header">
        <input type="checkbox" name="adubacao_verde" onchange="togglePractice(this)">
        <span>ADUBAÇÃO VERDE</span>
      </label>
      <div class="practice-details" style="display:none;">
        <div class="green-manure-list">
          <h4>Espécies utilizadas:</h4>
          <div id="adubos-verdes-container">
            <div class="adubo-verde-item">
              <select name="adubo_verde_especie[]">
                <option value="">Selecione...</option>
                <optgroup label="Leguminosas">
                  <option>Crotalária juncea</option>
                  <option>Crotalária spectabilis</option>
                  <option>Feijão de porco</option>
                  <option>Feijão guandu</option>
                  <option>Mucuna preta</option>
                  <option>Mucuna cinza</option>
                  <option>Lab-lab</option>
                  <option>Amendoim forrageiro</option>
                </optgroup>
                <optgroup label="Gramíneas">
                  <option>Aveia preta</option>
                  <option>Aveia branca</option>
                  <option>Milheto</option>
                  <option>Sorgo</option>
                </optgroup>
                <optgroup label="Outras">
                  <option>Nabo forrageiro</option>
                  <option>Girassol</option>
                  <option>Tremoço</option>
                </optgroup>
              </select>
              <input type="text" name="adubo_verde_epoca[]" placeholder="Época de plantio">
              <input type="text" name="adubo_verde_area[]" placeholder="Área (ha)">
              <button type="button" onclick="removeItem(this)">❌</button>
            </div>
          </div>
          <button type="button" onclick="addAduboVerde()">➕ Adicionar espécie</button>
        </div>
        <textarea name="adubacao_verde_manejo" 
                  placeholder="Como faz o manejo? (incorporação, roçada, época de corte)"
                  rows="3"></textarea>
      </div>
    </div>
    
    <!-- Consórcios -->
    <div class="practice-block">
      <label class="practice-header">
        <input type="checkbox" name="consorcios" onchange="togglePractice(this)">
        <span>CONSÓRCIOS</span>
      </label>
      <div class="practice-details" style="display:none;">
        <div class="consorcio-table">
          <table id="tabela-consorcios">
            <thead>
              <tr>
                <th>Cultura Principal</th>
                <th>Cultura Consorciada</th>
                <th>Benefício</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody id="consorcios-body">
              <tr>
                <td><input type="text" name="consorcio_principal[]" placeholder="Ex: Milho"></td>
                <td><input type="text" name="consorcio_secundaria[]" placeholder="Ex: Feijão"></td>
                <td>
                  <select name="consorcio_beneficio[]">
                    <option>Fixação de nitrogênio</option>
                    <option>Controle de pragas</option>
                    <option>Cobertura do solo</option>
                    <option>Aproveitamento de espaço</option>
                    <option>Outro</option>
                  </select>
                </td>
                <td><button type="button" onclick="removeRow(this)">❌</button></td>
              </tr>
            </tbody>
          </table>
          <button type="button" onclick="addConsorcio()">➕ Adicionar consórcio</button>
        </div>
      </div>
    </div>
    
    <!-- Outras Práticas -->
    <div class="other-practices">
      <h4>Outras práticas conservacionistas:</h4>
      
      <label class="practice-item">
        <input type="checkbox" name="quebra_ventos">
        <span>Quebra-ventos/Cortinas vegetais</span>
      </label>
      <div class="practice-detail">
        <input type="text" name="quebra_ventos_especies" 
               placeholder="Espécies utilizadas (Ex: Eucalipto, Grevílea, Banana)">
      </div>
      
      <label class="practice-item">
        <input type="checkbox" name="cobertura_solo">
        <span>Cobertura de solo/Mulching</span>
      </label>
      <div class="practice-detail">
        <select name="cobertura_tipo">
          <option value="">Tipo de cobertura...</option>
          <option>Palha seca</option>
          <option>Capim roçado</option>
          <option>Bagaço de cana</option>
          <option>Serragem curtida</option>
          <option>Cobertura viva</option>
        </select>
      </div>
      
      <label class="practice-item">
        <input type="checkbox" name="protecao_erosao">
        <span>Proteção contra erosão</span>
      </label>
      <div class="practice-detail">
        <textarea name="erosao_medidas" 
                  placeholder="Medidas adotadas (terraços, curvas de nível, caixas de contenção)"></textarea>
      </div>
      
      <label class="practice-item">
        <input type="checkbox" name="manejo_mato">
        <span>Manejo do mato</span>
      </label>
      <div class="practice-detail">
        <textarea name="mato_praticas" 
                  placeholder="Como faz o manejo de plantas espontâneas?"></textarea>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 3: BARREIRAS VERDES E RISCOS

```html
<section id="barreiras-riscos" class="form-section">
  <h2>3. Barreiras Verdes e Gestão de Riscos</h2>
  
  <div class="barreiras-section">
    <h3>Estado de Conservação das Barreiras Verdes</h3>
    <select name="barreiras_estado" required onchange="showBarrierDetails(this)">
      <option value="">Selecione...</option>
      <option value="excelente">Excelente - Bem formadas e densas</option>
      <option value="bom">Bom - Necessita pequenos reparos</option>
      <option value="regular">Regular - Necessita manutenção</option>
      <option value="ruim">Ruim - Necessita reforma urgente</option>
      <option value="inexistente">Não possui barreiras verdes</option>
    </select>
    
    <div id="barrier-details" style="display:none;">
      <div class="barrier-composition">
        <h4>Composição das barreiras:</h4>
        <div class="species-checklist">
          <label><input type="checkbox" name="barreira_capim"> Capim elefante/Napier</label>
          <label><input type="checkbox" name="barreira_cana"> Cana-de-açúcar</label>
          <label><input type="checkbox" name="barreira_hibisco"> Hibisco</label>
          <label><input type="checkbox" name="barreira_arvores"> Árvores (Eucalipto, Grevílea)</label>
          <label><input type="checkbox" name="barreira_bambu"> Bambu</label>
          <label><input type="checkbox" name="barreira_outros"> Outras espécies</label>
        </div>
        <input type="text" name="barreira_altura" placeholder="Altura média (metros)">
        <input type="text" name="barreira_extensao" placeholder="Extensão total (metros)">
      </div>
    </div>
  </div>
  
  <div class="risk-assessment">
    <h3>Avaliação de Riscos</h3>
    
    <!-- Risco de Deriva -->
    <div class="risk-block">
      <h4>Risco de Contaminação por Deriva de Agrotóxicos</h4>
      <div class="risk-options">
        <label>
          <input type="radio" name="risco_deriva" value="sim" onchange="showDerivaDetails(true)" required>
          <span class="risk-yes">⚠️ SIM - Existe risco</span>
        </label>
        <label>
          <input type="radio" name="risco_deriva" value="nao" onchange="showDerivaDetails(false)">
          <span class="risk-no">✅ NÃO - Sem risco</span>
        </label>
      </div>
      
      <div id="deriva-details" style="display:none;" class="risk-details">
        <div class="neighbor-analysis">
          <h5>Análise dos vizinhos:</h5>
          <table id="vizinhos-table">
            <thead>
              <tr>
                <th>Direção</th>
                <th>Vizinho/Atividade</th>
                <th>Tipo de Cultura</th>
                <th>Usa Agrotóxicos?</th>
                <th>Distância (m)</th>
                <th>Proteção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Norte</td>
                <td><input type="text" name="vizinho_norte_nome"></td>
                <td><input type="text" name="vizinho_norte_cultura"></td>
                <td>
                  <select name="vizinho_norte_agrotoxicos">
                    <option value="">...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="desconhecido">Desconhecido</option>
                  </select>
                </td>
                <td><input type="number" name="vizinho_norte_distancia" min="0"></td>
                <td><input type="text" name="vizinho_norte_protecao" placeholder="Barreira, mata, etc"></td>
              </tr>
              <tr>
                <td>Sul</td>
                <td><input type="text" name="vizinho_sul_nome"></td>
                <td><input type="text" name="vizinho_sul_cultura"></td>
                <td>
                  <select name="vizinho_sul_agrotoxicos">
                    <option value="">...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="desconhecido">Desconhecido</option>
                  </select>
                </td>
                <td><input type="number" name="vizinho_sul_distancia" min="0"></td>
                <td><input type="text" name="vizinho_sul_protecao"></td>
              </tr>
              <tr>
                <td>Leste</td>
                <td><input type="text" name="vizinho_leste_nome"></td>
                <td><input type="text" name="vizinho_leste_cultura"></td>
                <td>
                  <select name="vizinho_leste_agrotoxicos">
                    <option value="">...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="desconhecido">Desconhecido</option>
                  </select>
                </td>
                <td><input type="number" name="vizinho_leste_distancia" min="0"></td>
                <td><input type="text" name="vizinho_leste_protecao"></td>
              </tr>
              <tr>
                <td>Oeste</td>
                <td><input type="text" name="vizinho_oeste_nome"></td>
                <td><input type="text" name="vizinho_oeste_cultura"></td>
                <td>
                  <select name="vizinho_oeste_agrotoxicos">
                    <option value="">...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                    <option value="desconhecido">Desconhecido</option>
                  </select>
                </td>
                <td><input type="number" name="vizinho_oeste_distancia" min="0"></td>
                <td><input type="text" name="vizinho_oeste_protecao"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mitigation-measures">
          <h5>Medidas de mitigação adotadas:</h5>
          <label><input type="checkbox" name="mitigacao_barreira"> Barreiras vegetais reforçadas</label>
          <label><input type="checkbox" name="mitigacao_distancia"> Faixa de segurança (buffer)</label>
          <label><input type="checkbox" name="mitigacao_acordo"> Acordo com vizinhos</label>
          <label><input type="checkbox" name="mitigacao_horario"> Monitoramento de aplicações</label>
          <label><input type="checkbox" name="mitigacao_analise"> Análises de resíduos regulares</label>
          <textarea name="mitigacao_outras" placeholder="Outras medidas de proteção"></textarea>
        </div>
      </div>
    </div>
    
    <!-- Risco de Transgênicos -->
    <div class="risk-block">
      <h4>Risco de Contaminação por Transgênicos</h4>
      <div class="risk-options">
        <label>
          <input type="radio" name="risco_transgenicos" value="sim" onchange="showTransgenicDetails(true)" required>
          <span class="risk-yes">⚠️ SIM - Existe risco</span>
        </label>
        <label>
          <input type="radio" name="risco_transgenicos" value="nao" onchange="showTransgenicDetails(false)">
          <span class="risk-no">✅ NÃO - Sem risco</span>
        </label>
      </div>
      
      <div id="transgenic-details" style="display:none;" class="risk-details">
        <div class="transgenic-crops">
          <h5>Culturas com risco de contaminação:</h5>
          <label><input type="checkbox" name="risco_milho_gmo"> Milho (vizinhos plantam milho GM)</label>
          <label><input type="checkbox" name="risco_soja_gmo"> Soja (vizinhos plantam soja GM)</label>
          <label><input type="checkbox" name="risco_algodao_gmo"> Algodão (vizinhos plantam algodão GM)</label>
          
          <div class="isolation-measures">
            <h5>Medidas de isolamento:</h5>
            <input type="number" name="isolamento_distancia" placeholder="Distância de isolamento (metros)" min="0">
            <input type="text" name="isolamento_epoca" placeholder="Diferença de época de plantio (dias)">
            <label><input type="checkbox" name="isolamento_proprias"> Uso apenas sementes próprias</label>
            <label><input type="checkbox" name="isolamento_certificadas"> Sementes com atestado não-OGM</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 4: CONTROLE DE FORMIGAS

```html
<section id="controle-formigas" class="form-section">
  <h2>4. Manejo de Formigas</h2>
  
  <div class="ant-assessment">
    <h3>Situação das Formigas na Propriedade</h3>
    
    <div class="ant-severity">
      <label>Nível de infestação:</label>
      <select name="formiga_nivel" onchange="updateAntControl(this)" required>
        <option value="">Selecione...</option>
        <option value="ausente">Ausente - Não há formigas cortadeiras</option>
        <option value="baixo">Baixo - Poucos formigueiros isolados</option>
        <option value="medio">Médio - Vários formigueiros, dano controlável</option>
        <option value="alto">Alto - Muitos formigueiros, danos significativos</option>
        <option value="severo">Severo - Infestação generalizada</option>
      </select>
    </div>
    
    <div id="ant-control-methods" style="display:none;">
      <h4>Métodos de Controle Utilizados:</h4>
      
      <div class="control-method">
        <label class="method-header">
          <input type="checkbox" name="controle_cultural" onchange="toggleMethod(this)">
          <span>🌱 Controle Cultural</span>
        </label>
        <div class="method-details" style="display:none;">
          <label><input type="checkbox" name="cultural_plantio_repelente"> Plantio de espécies repelentes (gergelim, mamona)</label>
          <label><input type="checkbox" name="cultural_manejo_vegetacao"> Manejo da vegetação ao redor dos formigueiros</label>
          <label><input type="checkbox" name="cultural_rotacao"> Rotação com culturas menos atrativas</label>
        </div>
      </div>
      
      <div class="control-method">
        <label class="method-header">
          <input type="checkbox" name="controle_mecanico" onchange="toggleMethod(this)">
          <span>⚙️ Controle Mecânico</span>
        </label>
        <div class="method-details" style="display:none;">
          <label><input type="checkbox" name="mecanico_escavacao"> Escavação e remoção da rainha</label>
          <label><input type="checkbox" name="mecanico_inundacao"> Inundação dos formigueiros</label>
          <label><input type="checkbox" name="mecanico_fogo"> Uso de fogo nos olheiros</label>
        </div>
      </div>
      
      <div class="control-method">
        <label class="method-header">
          <input type="checkbox" name="controle_biologico" onchange="toggleMethod(this)">
          <span>🦠 Controle Biológico</span>
        </label>
        <div class="method-details" style="display:none;">
          <label><input type="checkbox" name="biologico_fungos"> Aplicação de fungos (Beauveria, Metarhizium)</label>
          <label><input type="checkbox" name="biologico_extratos"> Extratos vegetais (nim, citronela)</label>
          <input type="text" name="biologico_produto" placeholder="Nome do produto biológico utilizado">
        </div>
      </div>
      
      <div class="control-method">
        <label class="method-header">
          <input type="checkbox" name="controle_alternativo" onchange="toggleMethod(this)">
          <span>🔄 Métodos Alternativos</span>
        </label>
        <div class="method-details" style="display:none;">
          <label><input type="checkbox" name="alternativo_homeopatia"> Homeopatia</label>
          <label><input type="checkbox" name="alternativo_cal"> Cal virgem</label>
          <label><input type="checkbox" name="alternativo_cinza"> Cinza vegetal</label>
          <label><input type="checkbox" name="alternativo_manipueira"> Manipueira</label>
          <textarea name="alternativo_outros" placeholder="Outros métodos utilizados"></textarea>
        </div>
      </div>
    </div>
    
    <div class="ant-results">
      <h4>Eficácia do Controle:</h4>
      <textarea name="formiga_resultados" 
                placeholder="Descreva os resultados obtidos com o manejo de formigas"
                rows="3"></textarea>
    </div>
  </div>
</section>
```

---

## SEÇÃO 5: ADUBAÇÃO E NUTRIÇÃO

```html
<section id="adubacao-nutricao" class="form-section">
  <h2>5. Sistema de Adubação e Nutrição</h2>
  
  <div class="fertilization-system">
    <!-- Uso de Esterco -->
    <div class="fertilizer-block">
      <label class="fertilizer-header">
        <input type="checkbox" name="usa_esterco" onchange="toggleFertilizer(this)">
        <span>💩 ESTERCO</span>
      </label>
      <div class="fertilizer-details" style="display:none;">
        <div class="manure-types">
          <h4>Tipos de esterco utilizados:</h4>
          <div class="manure-grid">
            <div class="manure-item">
              <label><input type="checkbox" name="esterco_bovino"> Bovino</label>
              <input type="text" name="esterco_bovino_origem" placeholder="Origem">
              <select name="esterco_bovino_estado">
                <option>Fresco</option>
                <option>Curtido</option>
                <option>Compostado</option>
              </select>
            </div>
            <div class="manure-item">
              <label><input type="checkbox" name="esterco_aves"> Aves</label>
              <input type="text" name="esterco_aves_origem" placeholder="Origem">
              <select name="esterco_aves_estado">
                <option>Fresco</option>
                <option>Curtido</option>
                <option>Compostado</option>
              </select>
            </div>
            <div class="manure-item">
              <label><input type="checkbox" name="esterco_suino"> Suíno</label>
              <input type="text" name="esterco_suino_origem" placeholder="Origem">
              <select name="esterco_suino_estado">
                <option>Fresco</option>
                <option>Curtido</option>
                <option>Compostado</option>
              </select>
            </div>
            <div class="manure-item">
              <label><input type="checkbox" name="esterco_caprino"> Caprino/Ovino</label>
              <input type="text" name="esterco_caprino_origem" placeholder="Origem">
              <select name="esterco_caprino_estado">
                <option>Fresco</option>
                <option>Curtido</option>
                <option>Compostado</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="manure-management">
          <h4>Manejo do esterco:</h4>
          <label>Tempo de curtimento (dias):</label>
          <input type="number" name="esterco_curtimento" min="0" max="365">
          
          <label>Local de armazenamento:</label>
          <select name="esterco_armazenamento">
            <option>Esterqueira coberta</option>
            <option>Esterqueira descoberta</option>
            <option>Pilha no campo</option>
            <option>Composteira</option>
          </select>
          
          <label>Quantidade anual utilizada (ton/ha):</label>
          <input type="number" name="esterco_quantidade" min="0" step="0.1">
          
          <div class="contamination-check">
            <p class="alert">⚠️ Verificação de contaminação:</p>
            <label><input type="checkbox" name="esterco_sem_antibioticos"> Origem sem uso de antibióticos</label>
            <label><input type="checkbox" name="esterco_sem_hormonios"> Origem sem uso de hormônios</label>
            <label><input type="checkbox" name="esterco_sem_gmo"> Alimentação sem transgênicos</label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Compostagem -->
    <div class="fertilizer-block">
      <label class="fertilizer-header">
        <input type="checkbox" name="usa_composto" onchange="toggleFertilizer(this)">
        <span>🌿 COMPOSTO ORGÂNICO</span>
      </label>
      <div class="fertilizer-details" style="display:none;">
        <div class="composting-system">
          <h4>Sistema de compostagem:</h4>
          <select name="compostagem_metodo" onchange="updateCompostDetails(this)">
            <option value="">Selecione o método...</option>
            <option value="pilha">Pilha estática</option>
            <option value="leira">Leiras revolvidas</option>
            <option value="termofila">Compostagem termófila</option>
            <option value="vermicompostagem">Vermicompostagem</option>
            <option value="laminar">Compostagem laminar</option>
          </select>
          
          <div class="compost-ingredients">
            <h5>Ingredientes do composto:</h5>
            <table id="compost-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Origem</th>
                  <th>Proporção (%)</th>
                  <th>C/N</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" name="comp_material[]" placeholder="Ex: Palha"></td>
                  <td><input type="text" name="comp_origem[]" placeholder="Ex: Própria"></td>
                  <td><input type="number" name="comp_proporcao[]" min="0" max="100"></td>
                  <td>
                    <select name="comp_cn[]">
                      <option value="">...</option>
                      <option value="alto">Alto C (>30:1)</option>
                      <option value="medio">Médio (20-30:1)</option>
                      <option value="baixo">Alto N (<20:1)</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="button" onclick="addCompostIngredient()">➕ Adicionar ingrediente</button>
          </div>
          
          <div class="compost-parameters">
            <label>Tempo de compostagem (dias):</label>
            <input type="number" name="comp_tempo" min="30" max="180">
            
            <label>Temperatura máxima atingida (°C):</label>
            <input type="number" name="comp_temperatura" min="20" max="80">
            
            <label>Número de revolvimentos:</label>
            <input type="number" name="comp_revolvimentos" min="0" max="20">
            
            <label>Produção anual (ton):</label>
            <input type="number" name="comp_producao" min="0" step="0.1">
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bokashi -->
    <div class="fertilizer-block">
      <label class="fertilizer-header">
        <input type="checkbox" name="usa_bokashi" onchange="toggleFertilizer(this)">
        <span>🦠 BOKASHI</span>
      </label>
      <div class="fertilizer-details" style="display:none;">
        <div class="bokashi-recipe">
          <h4>Receita do Bokashi:</h4>
          <textarea name="bokashi_ingredientes" 
                    placeholder="Liste os ingredientes e proporções (Ex: 500kg farelo de arroz, 500kg torta de mamona, 200L de EM...)"
                    rows="4"></textarea>
          
          <label>Tipo de inoculante:</label>
          <select name="bokashi_inoculante">
            <option value="">Selecione...</option>
            <option>EM (Microrganismos Eficazes)</option>
            <option>Kefir</option>
            <option>Fermento biológico</option>
            <option>Inoculante comercial</option>
            <option>Próprio (capturado)</option>
          </select>
          
          <label>Tempo de fermentação (dias):</label>
          <input type="number" name="bokashi_tempo" min="7" max="60">
          
          <label>Frequência de produção:</label>
          <select name="bokashi_frequencia">
            <option>Mensal</option>
            <option>Bimestral</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Conforme necessidade</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Biofertilizantes -->
    <div class="fertilizer-block">
      <label class="fertilizer-header">
        <input type="checkbox" name="usa_biofertilizante" onchange="toggleFertilizer(this)">
        <span>💧 BIOFERTILIZANTES</span>
      </label>
      <div class="fertilizer-details" style="display:none;">
        <div class="biofertilizer-types">
          <h4>Tipos de biofertilizantes:</h4>
          
          <div class="biofert-item">
            <label><input type="checkbox" name="biofert_supermagro"> Supermagro</label>
            <div class="biofert-detail">
              <input type="text" name="supermagro_receita" placeholder="Adaptações na receita">
              <input type="text" name="supermagro_aplicacao" placeholder="Diluição e frequência">
            </div>
          </div>
          
          <div class="biofert-item">
            <label><input type="checkbox" name="biofert_agrobio"> Agrobio</label>
            <div class="biofert-detail">
              <input type="text" name="agrobio_receita" placeholder="Ingredientes principais">
              <input type="text" name="agrobio_aplicacao" placeholder="Modo de aplicação">
            </div>
          </div>
          
          <div class="biofert-item">
            <label><input type="checkbox" name="biofert_simples"> Biofertilizante simples (chorume)</label>
            <div class="biofert-detail">
              <select name="biofert_simples_tipo">
                <option>Esterco bovino</option>
                <option>Esterco de aves</option>
                <option>Composto</option>
                <option>Misto</option>
              </select>
            </div>
          </div>
          
          <div class="biofert-item">
            <label><input type="checkbox" name="biofert_outro"> Outro</label>
            <input type="text" name="biofert_outro_nome" placeholder="Nome/tipo">
            <textarea name="biofert_outro_desc" placeholder="Descrição da preparação"></textarea>
          </div>
        </div>
        
        <div class="biofert-application">
          <h4>Sistema de aplicação:</h4>
          <label><input type="checkbox" name="biofert_foliar"> Aplicação foliar</label>
          <label><input type="checkbox" name="biofert_solo"> Aplicação no solo</label>
          <label><input type="checkbox" name="biofert_fertirrigacao"> Fertirrigação</label>
          
          <label>Volume total produzido/ano (litros):</label>
          <input type="number" name="biofert_volume" min="0" step="10">
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 6: SUBSTRATO PARA MUDAS

```html
<section id="substrato-mudas" class="form-section">
  <h2>6. Substrato para Produção de Mudas</h2>
  
  <div class="substrate-usage">
    <div class="substrate-options">
      <label>
        <input type="radio" name="substrato_uso" value="nao" onchange="toggleSubstrate(this)">
        Não utilizo substrato
      </label>
      <label>
        <input type="radio" name="substrato_uso" value="proprio" onchange="toggleSubstrate(this)">
        Preparo meu próprio substrato
      </label>
      <label>
        <input type="radio" name="substrato_uso" value="comprado" onchange="toggleSubstrate(this)">
        Compro substrato pronto
      </label>
    </div>
    
    <div id="substrate-details" style="display:none;">
      <div class="substrate-declaration">
        <label class="important-check">
          <input type="checkbox" name="substrato_aprovado" required>
          <span>☑️ DECLARO que adquiro substrato/insumo aprovado para agricultura orgânica e garanto rastreabilidade</span>
        </label>
      </div>
      
      <div class="substrate-composition">
        <h3>Composição do Substrato</h3>
        <table id="substrate-table">
          <thead>
            <tr>
              <th>Ingrediente/Material</th>
              <th>Origem</th>
              <th>Proporção (%)</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody id="substrate-body">
            <tr>
              <td>
                <select name="substrato_ingrediente[]" onchange="checkCustomIngredient(this)">
                  <option value="">Selecione...</option>
                  <optgroup label="Base">
                    <option>Terra vegetal</option>
                    <option>Terra de barranco</option>
                    <option>Areia</option>
                    <option>Vermiculita</option>
                    <option>Perlita</option>
                    <option>Fibra de coco</option>
                    <option>Casca de arroz carbonizada</option>
                  </optgroup>
                  <optgroup label="Matéria Orgânica">
                    <option>Composto orgânico</option>
                    <option>Húmus de minhoca</option>
                    <option>Esterco curtido</option>
                    <option>Bokashi</option>
                    <option>Turfa</option>
                  </optgroup>
                  <optgroup label="Corretivos">
                    <option>Calcário</option>
                    <option>Cinza vegetal</option>
                    <option>Pó de rocha</option>
                    <option>Farinha de ossos</option>
                  </optgroup>
                  <option value="outro">Outro...</option>
                </select>
                <input type="text" name="substrato_outro[]" style="display:none;" placeholder="Especifique">
              </td>
              <td>
                <select name="substrato_origem[]">
                  <option>Próprio</option>
                  <option>Comprado - certificado</option>
                  <option>Comprado - convencional</option>
                  <option>Doado</option>
                </select>
              </td>
              <td>
                <input type="number" name="substrato_proporcao[]" min="0" max="100" required>
              </td>
              <td>
                <input type="text" name="substrato_obs[]" placeholder="Ex: Peneirado, esterilizado">
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" onclick="addSubstrateIngredient()">➕ Adicionar ingrediente</button>
        
        <div class="substrate-validation">
          <p class="info">ℹ️ Total deve somar 100%: <span id="substrate-total">0%</span></p>
        </div>
      </div>
      
      <div class="substrate-treatment">
        <h4>Tratamento do Substrato:</h4>
        <label><input type="checkbox" name="substrato_esterilizado"> Esterilização térmica (vapor/solarização)</label>
        <label><input type="checkbox" name="substrato_peneirado"> Peneiramento</label>
        <label><input type="checkbox" name="substrato_corrigido"> Correção de pH</label>
        <label><input type="checkbox" name="substrato_enriquecido"> Enriquecimento com nutrientes</label>
        
        <textarea name="substrato_preparo" 
                  placeholder="Descreva o processo de preparo do substrato"
                  rows="3"></textarea>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 7: RECEITAS PRÓPRIAS

```html
<section id="receitas-proprias" class="form-section">
  <h2>7. Receitas Próprias de Preparados</h2>
  
  <div class="recipes-container">
    <p class="section-info">
      ℹ️ Registre suas fórmulas de caldas, extratos, preparados biodinâmicos e outras receitas
    </p>
    
    <div id="recipes-list">
      <!-- Template de Receita -->
      <div class="recipe-card">
        <div class="recipe-header">
          <h3>Receita #1</h3>
          <button type="button" onclick="removeRecipe(this)" class="btn-remove">❌</button>
        </div>
        
        <div class="recipe-content">
          <div class="recipe-basic">
            <input type="text" name="receita_nome[]" placeholder="Nome da receita (Ex: Calda Bordalesa)" required>
            
            <select name="receita_tipo[]">
              <option value="">Tipo de preparado...</option>
              <option>Calda</option>
              <option>Extrato vegetal</option>
              <option>Preparado biodinâmico</option>
              <option>Defensivo natural</option>
              <option>Fertilizante foliar</option>
              <option>Indutor de resistência</option>
            </select>
            
            <select name="receita_finalidade[]" multiple>
              <option>Fungicida</option>
              <option>Inseticida</option>
              <option>Bactericida</option>
              <option>Acaricida</option>
              <option>Repelente</option>
              <option>Nutrição</option>
              <option>Fortalecimento</option>
            </select>
          </div>
          
          <div class="recipe-ingredients">
            <h4>Ingredientes:</h4>
            <textarea name="receita_ingredientes[]" 
                      placeholder="Liste todos os ingredientes com quantidades&#10;Ex:&#10;- 200g de sulfato de cobre&#10;- 200g de cal virgem&#10;- 20L de água"
                      rows="5" required></textarea>
          </div>
          
          <div class="recipe-preparation">
            <h4>Modo de Preparo:</h4>
            <textarea name="receita_preparo[]" 
                      placeholder="Descreva o passo a passo do preparo"
                      rows="4"></textarea>
          </div>
          
          <div class="recipe-application">
            <h4>Aplicação:</h4>
            <div class="application-grid">
              <div>
                <label>Dose/Diluição:</label>
                <input type="text" name="receita_dose[]" placeholder="Ex: 1:100, 2L/100L água">
              </div>
              <div>
                <label>Frequência:</label>
                <input type="text" name="receita_frequencia[]" placeholder="Ex: Semanal, 15/15 dias">
              </div>
              <div>
                <label>Culturas:</label>
                <input type="text" name="receita_culturas[]" placeholder="Ex: Tomate, pimentão">
              </div>
              <div>
                <label>Época/Condição:</label>
                <input type="text" name="receita_epoca[]" placeholder="Ex: Preventivo, início floração">
              </div>
            </div>
          </div>
          
          <div class="recipe-status">
            <label>Status de uso:</label>
            <select name="receita_status[]">
              <option>Já uso regularmente</option>
              <option>Uso eventualmente</option>
              <option>Pretendo usar</option>
              <option>Em teste</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <button type="button" onclick="addRecipe()" class="btn-add-recipe">➕ Adicionar Receita</button>
  </div>
</section>
```

---

## SEÇÃO 8: PRODUTOS COMERCIAIS

```html
<section id="produtos-comerciais" class="form-section">
  <h2>8. Produtos Comerciais Utilizados no Manejo</h2>
  
  <div class="commercial-products">
    <div class="products-tabs">
      <button class="tab active" onclick="showProductTab('fertilizantes')">Fertilizantes</button>
      <button class="tab" onclick="showProductTab('corretivos')">Corretivos de Solo</button>
      <button class="tab" onclick="showProductTab('fitossanitarios')">Fitossanitários</button>
    </div>
    
    <div id="products-content">
      <table id="commercial-products-table">
        <thead>
          <tr>
            <th>Marca/Nome Comercial</th>
            <th>Substância Ativa</th>
            <th>Fabricante</th>
            <th>Registro MAPA</th>
            <th>Certificado Orgânico</th>
            <th>Culturas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="products-body">
          <tr class="product-row">
            <td>
              <input type="text" name="produto_nome[]" placeholder="Nome comercial" required>
            </td>
            <td>
              <input type="text" name="produto_ativo[]" placeholder="Ingrediente ativo">
            </td>
            <td>
              <input type="text" name="produto_fabricante[]" placeholder="Fabricante">
            </td>
            <td>
              <input type="text" name="produto_registro[]" placeholder="Nº Registro">
            </td>
            <td>
              <select name="produto_certificado[]">
                <option value="">...</option>
                <option value="sim">Sim - IBD</option>
                <option value="sim">Sim - Ecocert</option>
                <option value="sim">Sim - Outro</option>
                <option value="nao">Não certificado</option>
                <option value="lista">Lista MAPA</option>
              </select>
            </td>
            <td>
              <input type="text" name="produto_culturas[]" placeholder="Ex: Hortaliças">
            </td>
            <td>
              <select name="produto_status[]">
                <option>Já uso</option>
                <option>Pretendo usar</option>
              </select>
            </td>
            <td>
              <button type="button" onclick="removeProductRow(this)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <button type="button" onclick="addProductRow()" class="btn-add">➕ Adicionar Produto</button>
      
      <div class="product-warning">
        <p class="alert">⚠️ ATENÇÃO: Apenas produtos aprovados pela Portaria 52/2021 MAPA podem ser utilizados</p>
        <a href="#" class="link-info">📋 Consultar lista de produtos permitidos</a>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 9: EQUIPAMENTOS

```html
<section id="equipamentos" class="form-section">
  <h2>9. Equipamentos Utilizados no Manejo Orgânico</h2>
  
  <div class="equipment-sharing">
    <h3>Compartilhamento de Equipamentos</h3>
    
    <div class="sharing-questions">
      <div class="question-block">
        <label>Usa equipamento de terceiros?</label>
        <div class="radio-group">
          <label><input type="radio" name="equip_terceiros" value="sim" onchange="showThirdPartyDetails(true)"> Sim</label>
          <label><input type="radio" name="equip_terceiros" value="nao" onchange="showThirdPartyDetails(false)"> Não</label>
        </div>
        <div id="third-party-details" style="display:none;">
          <input type="text" name="equip_terceiros_quais" placeholder="Quais equipamentos?">
          <input type="text" name="equip_terceiros_origem" placeholder="De quem?">
        </div>
      </div>
      
      <div class="question-block">
        <label>Empresta equipamento para outros?</label>
        <div class="radio-group">
          <label><input type="radio" name="equip_empresta" value="sim" onchange="showLendingDetails(true)"> Sim</label>
          <label><input type="radio" name="equip_empresta" value="nao" onchange="showLendingDetails(false)"> Não</label>
        </div>
        <div id="lending-details" style="display:none;">
          <input type="text" name="equip_empresta_quais" placeholder="Quais equipamentos?">
          <input type="text" name="equip_empresta_quem" placeholder="Para quem?">
        </div>
      </div>
    </div>
    
    <div class="equipment-declarations">
      <h3>Declarações sobre Equipamentos</h3>
      
      <label class="declaration-item">
        <input type="checkbox" name="decl_pulv_exclusivo">
        <span>☑️ DECLARO que meus equipamentos de pulverização NÃO são compartilhados</span>
      </label>
      
      <label class="declaration-item">
        <input type="checkbox" name="decl_higienizacao" required>
        <span>☑️ DECLARO que faço higienização dos equipamentos sempre que há risco de contaminação, usando produtos permitidos (Portaria 52/2021 - Anexo IV)</span>
      </label>
      
      <div class="hygiene-details">
        <h4>Procedimento de Higienização:</h4>
        <textarea name="equip_higienizacao_procedimento" 
                  placeholder="Descreva como faz a limpeza/descontaminação dos equipamentos"
                  rows="3"></textarea>
        
        <label>Produtos utilizados na limpeza:</label>
        <div class="cleaning-products">
          <label><input type="checkbox" name="limp_agua"> Água</label>
          <label><input type="checkbox" name="limp_sabao"> Sabão neutro</label>
          <label><input type="checkbox" name="limp_alcool"> Álcool 70%</label>
          <label><input type="checkbox" name="limp_vapor"> Vapor</label>
          <label><input type="checkbox" name="limp_outro"> Outro</label>
          <input type="text" name="limp_outro_qual" placeholder="Especifique" style="display:none;">
        </div>
      </div>
    </div>
    
    <div class="equipment-list">
      <h3>Lista de Equipamentos Principais</h3>
      <div class="equipment-grid">
        <label><input type="checkbox" name="tem_trator"> Trator</label>
        <label><input type="checkbox" name="tem_microtrator"> Microtrator/Tobata</label>
        <label><input type="checkbox" name="tem_rocadeira"> Roçadeira</label>
        <label><input type="checkbox" name="tem_pulverizador_costal"> Pulverizador costal</label>
        <label><input type="checkbox" name="tem_pulverizador_tratorizado"> Pulverizador tratorizado</label>
        <label><input type="checkbox" name="tem_arado"> Arado</label>
        <label><input type="checkbox" name="tem_grade"> Grade</label>
        <label><input type="checkbox" name="tem_subsolador"> Subsolador</label>
        <label><input type="checkbox" name="tem_plantadeira"> Plantadeira</label>
        <label><input type="checkbox" name="tem_cultivador"> Cultivador</label>
        <label><input type="checkbox" name="tem_irrigacao"> Sistema de irrigação</label>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 10: ARMAZENAMENTO

```html
<section id="armazenamento" class="form-section">
  <h2>10. Espaços de Armazenamento</h2>
  
  <div class="storage-assessment">
    <h3>Condições de Organização</h3>
    
    <div class="organization-level">
      <label>Como considera as condições de organização dos espaços?</label>
      <select name="armazenamento_condicoes" required onchange="updateStorageRecommendations(this)">
        <option value="">Selecione...</option>
        <option value="boa">✅ BOA - Tudo organizado e identificado</option>
        <option value="mediana">⚠️ MEDIANA - Precisa melhorias</option>
        <option value="ruim">❌ RUIM - Necessita reorganização urgente</option>
      </select>
    </div>
    
    <div id="storage-recommendations" style="display:none;">
      <!-- Recomendações baseadas na avaliação -->
    </div>
    
    <div class="storage-checklist">
      <h3>Checklist de Segurança</h3>
      
      <div class="safety-item">
        <label>
          <input type="checkbox" name="armaz_separacao_adequada" required>
          <span>Separação adequada de produtos</span>
        </label>
        <p class="help-text">ℹ️ Combustíveis, óleos e produtos químicos separados de insumos agrícolas</p>
      </div>
      
      <div class="safety-item">
        <label>
          <input type="checkbox" name="armaz_identificacao">
          <span>Produtos identificados com etiquetas</span>
        </label>
      </div>
      
      <div class="safety-item">
        <label>
          <input type="checkbox" name="armaz_ventilacao">
          <span>Ventilação adequada</span>
        </label>
      </div>
      
      <div class="safety-item">
        <label>
          <input type="checkbox" name="armaz_protecao_umidade">
          <span>Proteção contra umidade</span>
        </label>
      </div>
      
      <div class="safety-item">
        <label>
          <input type="checkbox" name="armaz_controle_pragas">
          <span>Controle de roedores e insetos</span>
        </label>
      </div>
    </div>
    
    <div class="storage-declarations">
      <h3>Declarações Obrigatórias</h3>
      
      <label class="declaration-required">
        <input type="checkbox" name="decl_sem_proibidos" required>
        <span>☑️ DECLARO que nos espaços de armazenamento NÃO existem produtos proibidos no manejo orgânico</span>
      </label>
      
      <label class="declaration-required">
        <input type="checkbox" name="decl_baixo_risco" required>
        <span>☑️ DECLARO que existe baixo nível de acidentes e há bloqueios de segurança (sem acesso para crianças/animais)</span>
      </label>
      
      <label class="declaration-required">
        <input type="checkbox" name="decl_acessivel_visita" required>
        <span>☑️ DECLARO que os espaços estão acessíveis para visitação (produtores SPG, consumidores, auditores MAPA)</span>
      </label>
    </div>
    
    <div class="storage-photos">
      <h3>Fotos do Armazenamento (Recomendado)</h3>
      <div class="photo-upload-area">
        <input type="file" 
               name="fotos_armazenamento[]" 
               accept="image/*" 
               multiple 
               onchange="previewStoragePhotos(this)">
        <div id="storage-photos-preview"></div>
        <p class="help-text">💡 Fotos ajudam na avaliação e demonstram organização</p>
      </div>
    </div>
  </div>
</section>
```

---

## SEÇÃO 11: PRODUTOS NÃO CERTIFICADOS

```html
<section id="produtos-nao-certificados" class="form-section">
  <h2>11. Lista de Produtos que NÃO Serão Certificados</h2>
  
  <div class="section-explanation">
    <p class="info">ℹ️ Liste produtos em fase de conversão ou que não terão produção em 2026</p>
    <p class="example">Exemplos: Plantei abacateiro mas só produzirá em 2028; Mandioca plantada em janeiro colheita em 2027</p>
  </div>
  
  <div class="non-certified-table">
    <table id="tabela-nao-certificados">
      <thead>
        <tr>
          <th>#</th>
          <th>Produto/Variedade</th>
          <th>Talhão/Área</th>
          <th>Origem Muda</th>
          <th>Origem Semente</th>
          <th>Tipo</th>
          <th>Motivo Não Certificação</th>
          <th>Previsão Produção</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="nao-certificados-body">
        <tr class="non-certified-row">
          <td class="row-num">1</td>
          <td>
            <input type="text" name="nc_produto[]" placeholder="Ex: Abacate Quintal" required>
          </td>
          <td>
            <input type="text" name="nc_talhao[]" placeholder="Ex: Área 7">
          </td>
          <td>
            <select name="nc_origem_muda[]">
              <option value="">Selecione...</option>
              <option>Própria</option>
              <option>Doada</option>
              <option>Comprada - Viveiro</option>
              <option>Comprada - Produtor</option>
              <option>N/A</option>
            </select>
          </td>
          <td>
            <input type="text" name="nc_origem_semente[]" placeholder="Ex: Vizinho, Isla">
          </td>
          <td>
            <div class="type-checkboxes">
              <label><input type="checkbox" name="nc_tipo_conv_trat[]"> Conv. c/ Trat</label>
              <label><input type="checkbox" name="nc_tipo_conv_sem[]"> Conv. s/ Trat</label>
              <label><input type="checkbox" name="nc_tipo_org[]"> Orgânica</label>
            </div>
          </td>
          <td>
            <select name="nc_motivo[]" onchange="checkOtherReason(this)">
              <option value="">Selecione...</option>
              <option>Em conversão</option>
              <option>Plantio recente - sem produção</option>
              <option>Produção após 2026</option>
              <option>Uso de insumo não permitido</option>
              <option>Área em pousio</option>
              <option value="outro">Outro motivo</option>
            </select>
            <input type="text" name="nc_motivo_outro[]" style="display:none;" placeholder="Especifique">
          </td>
          <td>
            <input type="month" name="nc_previsao[]">
          </td>
          <td>
            <button type="button" onclick="removeNonCertified(this)">❌</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <button type="button" onclick="addNonCertifiedRow()" class="btn-add">➕ Adicionar Produto</button>
  </div>
</section>
```

---

## FUNCIONALIDADES JAVASCRIPT

```javascript
// Sistema de validação e interatividade
class FormularioProducaoVegetal {
  constructor() {
    this.initializeEventListeners();
    this.setupAutoSave();
    this.loadSavedData();
    this.initializeTooltips();
  }
  
  // Validações específicas do anexo
  validatePraticasConservacionistas() {
    const praticas = document.querySelectorAll('.practice-block input[type="checkbox"]:checked');
    if (praticas.length === 0) {
      this.addWarning('Recomenda-se ao menos uma prática conservacionista');
    }
  }
  
  validateBarreirasVerdes() {
    const estado = document.querySelector('[name="barreiras_estado"]').value;
    const riscoDériva = document.querySelector('[name="risco_deriva"]:checked');
    
    if (riscoDériva?.value === 'sim' && estado === 'inexistente') {
      this.addError('Barreiras verdes obrigatórias quando há risco de deriva');
      return false;
    }
    return true;
  }
  
  validateSubstratoComposition() {
    const proporcoes = document.querySelectorAll('[name="substrato_proporcao[]"]');
    let total = 0;
    
    proporcoes.forEach(input => {
      total += parseFloat(input.value) || 0;
    });
    
    const totalDisplay = document.getElementById('substrate-total');
    totalDisplay.textContent = `${total}%`;
    
    if (total !== 100 && proporcoes.length > 0) {
      totalDisplay.style.color = 'red';
      this.addError('Composição do substrato deve somar 100%');
      return false;
    }
    
    totalDisplay.style.color = 'green';
    return true;
  }
  
  // Funcionalidades dinâmicas
  addAduboVerde() {
    const container = document.getElementById('adubos-verdes-container');
    const newItem = container.querySelector('.adubo-verde-item').cloneNode(true);
    
    // Limpar valores
    newItem.querySelectorAll('input, select').forEach(field => {
      field.value = '';
    });
    
    container.appendChild(newItem);
  }
  
  addConsorcio() {
    const tbody = document.getElementById('consorcios-body');
    const newRow = tbody.querySelector('tr').cloneNode(true);
    
    newRow.querySelectorAll('input, select').forEach(field => {
      field.value = '';
    });
    
    tbody.appendChild(newRow);
  }
  
  addRecipe() {
    const container = document.getElementById('recipes-list');
    const recipeCount = container.children.length + 1;
    
    const newRecipe = document.createElement('div');
    newRecipe.className = 'recipe-card';
    newRecipe.innerHTML = `
      <div class="recipe-header">
        <h3>Receita #${recipeCount}</h3>
        <button type="button" onclick="removeRecipe(this)" class="btn-remove">❌</button>
      </div>
      <!-- Resto do template de receita -->
    `;
    
    container.appendChild(newRecipe);
  }
  
  // Análise de vizinhos e riscos
  analyzeNeighborRisks() {
    const vizinhos = document.querySelectorAll('#vizinhos-table tbody tr');
    let riscos = [];
    
    vizinhos.forEach((row) => {
      const direcao = row.cells[0].textContent;
      const agrotoxicos = row.querySelector('select[name*="agrotoxicos"]').value;
      const distancia = parseFloat(row.querySelector('input[name*="distancia"]').value);
      const protecao = row.querySelector('input[name*="protecao"]').value;
      
      if (agrotoxicos === 'sim' && distancia < 50 && !protecao) {
        riscos.push({
          direcao,
          nivel: 'alto',
          mensagem: `Alto risco de deriva vindo do ${direcao}`
        });
      }
    });
    
    this.displayRiskAnalysis(riscos);
  }
  
  displayRiskAnalysis(riscos) {
    const container = document.createElement('div');
    container.className = 'risk-analysis-result';
    
    if (riscos.length > 0) {
      container.innerHTML = `
        <h4>⚠️ Análise de Riscos Identificados</h4>
        <ul>
          ${riscos.map(r => `<li class="risk-${r.nivel}">${r.mensagem}</li>`).join('')}
        </ul>
        <p>Recomendações:</p>
        <ul>
          <li>Reforçar barreiras vegetais nas direções de risco</li>
          <li>Estabelecer faixa de segurança mínima de 10m</li>
          <li>Dialogar com vizinhos sobre calendário de aplicações</li>
          <li>Realizar análises de resíduos periodicamente</li>
        </ul>
      `;
    } else {
      container.innerHTML = '<p class="success">✅ Nenhum risco significativo identificado</p>';
    }
    
    document.getElementById('risk-assessment').appendChild(container);
  }
  
  // Cálculo de necessidade de insumos
  calculateInputNeeds() {
    const area = parseFloat(document.querySelector('[name="area_organica"]').value);
    const esterco = parseFloat(document.querySelector('[name="esterco_quantidade"]').value);
    
    if (area && esterco) {
      const totalEsterco = area * esterco;
      
      const result = document.createElement('div');
      result.className = 'calculation-result';
      result.innerHTML = `
        <h4>📊 Cálculo de Necessidade Anual</h4>
        <p>Área orgânica: ${area} ha</p>
        <p>Aplicação: ${esterco} ton/ha</p>
        <p><strong>Total necessário: ${totalEsterco} toneladas/ano</strong></p>
      `;
      
      document.querySelector('.manure-management').appendChild(result);
    }
  }
  
  // Validação final do anexo
  validateAnexo() {
    let valid = true;
    this.errors = [];
    this.warnings = [];
    
    // Validações obrigatórias
    valid = this.validateBarreirasVerdes() && valid;
    valid = this.validateSubstratoComposition() && valid;
    
    // Validações recomendadas
    this.validatePraticasConservacionistas();
    
    // Verificar declarações
    const declaracoes = document.querySelectorAll('.declaration-required input[type="checkbox"]');
    declaracoes.forEach(decl => {
      if (!decl.checked) {
        this.addError(`Declaração obrigatória não marcada: ${decl.parentElement.textContent.trim()}`);
        valid = false;
      }
    });
    
    this.showValidationResults();
    return valid;
  }
}

// Inicializar formulário
document.addEventListener('DOMContentLoaded', () => {
  const form = new FormularioProducaoVegetal();
  
  // Botão de validação
  document.getElementById('validate-anexo').addEventListener('click', () => {
    if (form.validateAnexo()) {
      alert('✅ Anexo válido e pronto para envio!');
    }
  });
  
  // Auto-save
  setInterval(() => {
    form.autoSave();
  }, 30000);
});
```

---

## INTEGRAÇÃO COM FORMULÁRIO PRINCIPAL

```javascript
// Sistema de integração com PMO principal
class IntegracaoPMO {
  constructor() {
    this.mainFormData = this.loadMainFormData();
    this.syncData();
  }
  
  loadMainFormData() {
    // Carregar dados do formulário principal
    const mainData = localStorage.getItem('pmo_main_data');
    return mainData ? JSON.parse(mainData) : {};
  }
  
  syncData() {
    // Sincronizar dados relevantes
    if (this.mainFormData.area_total) {
      document.querySelector('[name="area_total_ref"]').value = this.mainFormData.area_total;
      
      // Validar que área orgânica não excede área total
      const areaOrganica = document.querySelector('[name="area_organica_vegetal"]');
      areaOrganica.max = this.mainFormData.area_total;
    }
    
    // Puxar lista de produtos do formulário principal
    if (this.mainFormData.produtos) {
      this.populateProductReferences(this.mainFormData.produtos);
    }
  }
  
  populateProductReferences(produtos) {
    // Popular dropdowns com produtos já cadastrados
    const selects = document.querySelectorAll('select.product-reference');
    
    selects.forEach(select => {
      produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = produto.nome;
        select.appendChild(option);
      });
    });
  }
  
  exportAnexoData() {
    const formData = new FormData(document.getElementById('anexo-producao-vegetal'));
    const data = Object.fromEntries(formData);
    
    // Adicionar ao conjunto de dados do PMO
    const pmoCompleto = {
      ...this.mainFormData,
      anexo_producao_vegetal: data
    };
    
    return pmoCompleto;
  }
}
```

---

## CSS ESPECÍFICO DO ANEXO

```css
/* Estilos específicos para o anexo de produção vegetal */
.practice-block {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.practice-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f3f4f6;
  cursor: pointer;
  font-weight: bold;
}

.practice-header:hover {
  background: #e5e7eb;
}

.practice-details {
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.fertilizer-block {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #86efac;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.recipe-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.risk-yes {
  color: #dc2626;
  font-weight: bold;
}

.risk-no {
  color: #16a34a;
  font-weight: bold;
}

.risk-details {
  background: #fef2f2;
  border: 2px solid #fca5a5;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.neighbor-analysis table {
  width: 100%;
  border-collapse: collapse;
}

.neighbor-analysis th {
  background: #f3f4f6;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
}

.neighbor-analysis td {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.commercial-products .tab {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.commercial-products .tab.active {
  background: #10b981;
  color: white;
}

/* Indicadores visuais de validação */
.field-valid {
  border-left: 3px solid #10b981;
}

.field-invalid {
  border-left: 3px solid #ef4444;
}

.field-warning {
  border-left: 3px solid #f59e0b;
}

/* Responsividade */
@media (max-width: 768px) {
  .practice-block,
  .fertilizer-block,
  .recipe-card {
    padding: 1rem;
  }
  
  .neighbor-analysis {
    overflow-x: auto;
  }
  
  table {
    min-width: 600px;
  }
}
```

## Output Esperado

Este formulário de Produção Primária Vegetal deve:

1. ✅ **Cobrir 100%** das práticas agrícolas orgânicas
2. ✅ **Validar** conformidade com Portaria 52/2021 MAPA
3. ✅ **Integrar** perfeitamente com formulário PMO principal
4. ✅ **Calcular** automaticamente necessidades de insumos
5. ✅ **Analisar** riscos de contaminação por deriva/transgênicos
6. ✅ **Documentar** todas as práticas conservacionistas
7. ✅ **Rastrear** origem de todos os insumos
8. ✅ **Facilitar** preenchimento com sugestões e auto-complete
9. ✅ **Exportar** dados em formatos úteis
10. ✅ **Orientar** produtor sobre melhores práticas orgânicas