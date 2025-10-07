const STORAGE_KEY = "opac-reports-v1";

const elements = {
  upList: document.getElementById("up-list"),
  filterTipo: document.getElementById("filter-tipo"),
  filterConformidade: document.getElementById("filter-conformidade"),
  searchInput: document.getElementById("input-search"),
  btnNewReport: document.getElementById("btn-new-report"),
  btnSyncSchemas: document.getElementById("btn-sync-schemas"),
  timeline: document.getElementById("timeline"),
  reportHeader: document.getElementById("report-header"),
  reportTitle: document.getElementById("report-title"),
  reportMeta: document.getElementById("report-meta"),
  btnSaveDraft: document.getElementById("btn-save-draft"),
  btnExportJson: document.getElementById("btn-export-json"),
  btnGeneratePdf: document.getElementById("btn-generate-pdf"),
  btnDeleteReport: document.getElementById("btn-delete-report"),
  fileImport: document.getElementById("file-import"),
  formContainer: document.getElementById("form-container"),
  modalRoot: document.getElementById("modal-root"),
  modalTitle: document.getElementById("modal-title"),
  modalBody: document.getElementById("modal-body"),
  modalActions: document.getElementById("modal-actions"),
  modalClose: document.getElementById("modal-close"),
  toastContainer: document.getElementById("toast-container"),
};

const state = {
  schemasManifest: null,
  pmoManifest: null,
  moduleCache: new Map(),
  typeSchemas: new Map(),
  reports: [],
  currentReportId: null,
};

const ui = createUi(elements);

function createUi(elems) {
  const { modalRoot, modalTitle, modalBody, modalActions, modalClose, toastContainer } = elems;

  const fallback = {
    async alert(message) {
      if (typeof window !== "undefined" && typeof window.alert === "function") {
        window.alert(message);
      } else {
        console.log("[alert]", message);
      }
      return true;
    },
    async confirm(message) {
      if (typeof window !== "undefined" && typeof window.confirm === "function") {
        return window.confirm(message);
      }
      console.log("[confirm]", message);
      return false;
    },
    async choice(title, options = []) {
      if (!options.length) return null;
      if (typeof window !== "undefined" && typeof window.prompt === "function") {
        const text = options.map((opt, index) => `${index + 1}. ${opt.label ?? opt.value}`).join("\n");
        const answer = window.prompt(`${title}\n${text}`);
        const index = Number.parseInt(answer ?? "", 10) - 1;
        return options[index]?.value ?? null;
      }
      console.log("[choice]", title, options);
      return null;
    },
    toast(message) {
      console.log("[toast]", message);
    },
  };

  if (!modalRoot || !modalTitle || !modalBody || !modalActions || !modalClose || !toastContainer) {
    return fallback;
  }

  let resolver = null;
  let lastActive = null;
  let escapeHandler = null;

  function closeModal(result = null) {
    if (modalRoot.classList.contains("hidden") && !resolver) {
      return result;
    }
    modalRoot.classList.add("hidden");
    modalRoot.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalBody.innerHTML = "";
    modalActions.innerHTML = "";
    modalTitle.textContent = "";
    if (escapeHandler) {
      window.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
    const resolve = resolver;
    resolver = null;
    if (typeof resolve === "function") {
      resolve(result);
    }
    if (lastActive && typeof lastActive.focus === "function") {
      lastActive.focus();
    }
    lastActive = null;
    return result;
  }

  function openModal({ title = "", description = "", nodes = [], actions = [] }) {
    if (resolver) {
      closeModal(null);
    }
    return new Promise((resolve) => {
      resolver = resolve;
      lastActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      modalTitle.textContent = title;
      modalBody.innerHTML = "";

      if (description) {
        const paragraph = document.createElement("p");
        paragraph.textContent = description;
        modalBody.append(paragraph);
      }

      nodes.forEach((node) => {
        if (node instanceof Node) {
          modalBody.append(node);
        }
      });

      modalActions.innerHTML = "";
      const normalizedActions = actions.length
        ? actions
        : [
            {
              label: "Fechar",
              value: null,
            },
          ];

      normalizedActions.forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        if (action.variant === "primary") button.classList.add("primary");
        if (action.variant === "danger") button.classList.add("danger");
        button.addEventListener("click", () => closeModal(action.value));
        modalActions.append(button);
      });

      modalRoot.classList.remove("hidden");
      modalRoot.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      escapeHandler = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal(null);
        }
      };
      window.addEventListener("keydown", escapeHandler);

      requestAnimationFrame(() => {
        const focusTarget =
          modalBody.querySelector("[data-autofocus]") || modalActions.querySelector("button") || modalClose;
        focusTarget?.focus();
      });
    });
  }

  modalClose.addEventListener("click", () => {
    closeModal(null);
  });

  modalRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.modalDismiss === "true") {
      closeModal(null);
    }
  });

  return {
    async alert(message, { title = "Aviso", okLabel = "Entendi" } = {}) {
      await openModal({
        title,
        description: message,
        actions: [{ label: okLabel, value: true, variant: "primary" }],
      });
      return true;
    },
    async confirm(
      message,
      { title = "Confirmar ação", okLabel = "Confirmar", cancelLabel = "Cancelar", variant = "primary" } = {},
    ) {
      const result = await openModal({
        title,
        description: message,
        actions: [
          { label: cancelLabel, value: false },
          { label: okLabel, value: true, variant: variant === "danger" ? "danger" : "primary" },
        ],
      });
      return Boolean(result);
    },
    async choice(title, options = [], { description = "", cancelLabel = "Cancelar" } = {}) {
      if (!options.length) return null;
      const list = document.createElement("div");
      list.className = "modal-choice-list";

      options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        const label = document.createElement("span");
        label.className = "choice-label";
        label.textContent = option.label ?? option.value;
        button.append(label);
        if (option.description) {
          const details = document.createElement("span");
          details.className = "choice-description";
          details.textContent = option.description;
          button.append(details);
        }
        button.addEventListener("click", () => closeModal(option.value));
        list.append(button);
      });

      const result = await openModal({
        title,
        description,
        nodes: [list],
        actions: cancelLabel ? [{ label: cancelLabel, value: null }] : [],
      });
      return result ?? null;
    },
    toast(message, { variant = "default", duration = 4000 } = {}) {
      if (!message) return;
      const toast = document.createElement("div");
      toast.className = `toast${variant !== "default" ? ` ${variant}` : ""}`;
      toast.textContent = message;
      toastContainer.append(toast);

      const remove = () => {
        toast.classList.add("fade-out");
        setTimeout(() => {
          toast.remove();
        }, 300);
      };

      const timer = setTimeout(remove, duration);
      toast.addEventListener("click", () => {
        clearTimeout(timer);
        remove();
      });
    },
  };
}

// ------------------------------
// Utilidades
// ------------------------------
function structuredCloneCompat(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function getByPath(obj, path) {
  if (!path) return obj;
  return path.split(".").reduce((acc, segment) => {
    if (acc == null) return undefined;
    return acc[segment];
  }, obj);
}

function setByPath(obj, path, value) {
  const parts = path.split(".");
  const last = parts.pop();
  const target = parts.reduce((acc, segment) => {
    if (acc[segment] == null || typeof acc[segment] !== "object") {
      acc[segment] = {};
    }
    return acc[segment];
  }, obj);
  target[last] = value;
}

function ensureStructure(target, template) {
  if (Array.isArray(template)) {
    if (!Array.isArray(target)) {
      target = [];
    }
    return target;
  }
  if (template && typeof template === "object") {
    if (target == null || typeof target !== "object" || Array.isArray(target)) {
      target = {};
    }
    for (const key of Object.keys(template)) {
      if (key.startsWith("_")) continue;
      target[key] = ensureStructure(target[key], template[key]);
    }
    return target;
  }
  if (typeof template === "number") {
    return typeof target === "number" ? target : 0;
  }
  if (typeof template === "boolean") {
    return typeof target === "boolean" ? target : false;
  }
  return target ?? "";
}

function formatDate(dateIso) {
  if (!dateIso) return "-";
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function uuid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ------------------------------
// Persistência
// ------------------------------
function loadReportsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error("Erro ao carregar rascunhos", err);
  }
  return [];
}

function saveReportsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reports));
}

// ------------------------------
// Carregamento de Schemas
// ------------------------------
async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}: ${response.status}`);
  }
  return response.json();
}

async function loadManifests() {
  [state.schemasManifest, state.pmoManifest] = await Promise.all([
    fetchJson("schemas/manifest.json"),
    fetchJson("pmo/manifest.json"),
  ]);
  populateTipoFiltro();
}

async function loadTypeSchema(typeId) {
  if (state.typeSchemas.has(typeId)) return state.typeSchemas.get(typeId);
  const typeDef = state.schemasManifest?.types?.[typeId];
  if (!typeDef) throw new Error(`Tipo de visita desconhecido: ${typeId}`);
  const schema = await fetchJson(`schemas/${typeDef.schemaPath}`);
  state.typeSchemas.set(typeId, schema);
  return schema;
}

async function loadModule(moduleId, version) {
  const cacheKey = `${moduleId}@${version}`;
  if (state.moduleCache.has(cacheKey)) return state.moduleCache.get(cacheKey);
  const modulePath = `schemas/modules/${moduleId}.json`;
  const moduleDef = await fetchJson(modulePath);
  state.moduleCache.set(cacheKey, moduleDef);
  return moduleDef;
}

// ------------------------------
// Operações com relatórios
// ------------------------------
async function createReport(tipoId) {
  const schema = await loadTypeSchema(tipoId);
  const data = ensureStructure(structuredCloneCompat(schema.dataTemplate), schema.dataTemplate);
  const now = new Date().toISOString();
  return {
    id: uuid(),
    tipoId,
    schemaVersion: schema.schemaVersion,
    createdAt: now,
    updatedAt: now,
    conformidade: "pendente",
    pendencias: [],
    data,
  };
}

function findReport(id) {
  return state.reports.find((report) => report.id === id);
}

function updateReport(report, patch = {}) {
  Object.assign(report, patch);
  report.updatedAt = new Date().toISOString();
  saveReportsToStorage();
  renderReportsList();
  if (state.currentReportId === report.id) {
    renderReportHeader(report);
  }
}

function deleteReport(id) {
  state.reports = state.reports.filter((report) => report.id !== id);
  saveReportsToStorage();
  if (state.currentReportId === id) {
    state.currentReportId = null;
    elements.reportHeader.classList.add("hidden");
    elements.formContainer.innerHTML = `
      <div class="empty-state"><p>Selecione um relatório existente ou crie um novo.</p></div>
    `;
  }
  renderReportsList();
}

// ------------------------------
// Renderização do Painel
// ------------------------------
function populateTipoFiltro() {
  const select = elements.filterTipo;
  select.innerHTML = '<option value="">Tipo de visita</option>';
  const types = state.schemasManifest?.types ?? {};
  for (const [typeId, definition] of Object.entries(types)) {
    const option = document.createElement("option");
    option.value = typeId;
    option.textContent = definition.label ?? typeId;
    select.append(option);
  }
}

function matchesFilters(report, schema) {
  const termo = elements.searchInput.value?.toLowerCase() ?? "";
  const tipoFiltro = elements.filterTipo.value;
  const conformidadeFiltro = elements.filterConformidade.value;
  if (tipoFiltro && report.tipoId !== tipoFiltro) return false;
  if (conformidadeFiltro && report.conformidade !== conformidadeFiltro) return false;

  if (termo) {
    const unidade = getUnitName(report);
    const verificador = getVerificadores(report).join(" ");
    const match = `${unidade} ${verificador}`.toLowerCase();
    return match.includes(termo);
  }
  return true;
}

async function renderReportsList() {
  const list = elements.upList;
  list.innerHTML = "";
  list.classList.toggle("empty-state", state.reports.length === 0);

  if (!state.reports.length) {
    list.innerHTML = `
      <p>Nenhum relatório cadastrado. Crie um novo para começar.</p>
      <button id="btn-new-report-inline" class="primary" type="button">Novo relatório</button>
    `;
    document.getElementById("btn-new-report-inline")?.addEventListener("click", onCreateReport);
    return;
  }

  const types = state.schemasManifest?.types ?? {};
  let hasMatches = false;

  for (const report of state.reports) {
    const schema = await loadTypeSchema(report.tipoId);
    if (!matchesFilters(report, schema)) continue;
    hasMatches = true;

    const cardTemplate = document.getElementById("template-card");
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = report.id;
    card.querySelector(".card-title").textContent = getUnitName(report) || "Unidade sem nome";
    card.querySelector(".card-meta").textContent = getVerificadores(report).join(", ") || "Verificador não informado";
    card.querySelector(".card-updated").textContent = formatDate(report.updatedAt);
    card.querySelector(".card-type").textContent = types[report.tipoId]?.label ?? report.tipoId;
    card.querySelector(".card-conformidade").textContent = report.conformidade ?? "-";
    card.querySelector(".card-pendencias").textContent = String(
      report.pendencias?.filter((p) => p.status !== "resolvida")?.length ?? 0,
    );
    const completion = await calculateCompletion(report, schema);
    card.querySelector(".card-progress").textContent = `${completion.toFixed(0)}%`;

    card.querySelector(".card-edit").addEventListener("click", () => selectReport(report.id));
    card.querySelector(".card-duplicate").addEventListener("click", async () => {
      await duplicateReport(report.id);
      ui.toast("Relatório duplicado.", { variant: "success" });
    });
    card.querySelector(".card-export").addEventListener("click", () => exportReportJson(report));
    card.querySelector(".card-delete").addEventListener("click", async () => {
      const confirmed = await ui.confirm("Tem certeza que deseja excluir este relatório?", {
        title: "Excluir relatório",
        okLabel: "Excluir",
        cancelLabel: "Cancelar",
        variant: "danger",
      });
      if (confirmed) {
        deleteReport(report.id);
        ui.toast("Relatório excluído.", { variant: "success" });
      }
    });

    list.append(card);
  }

  if (!hasMatches) {
    list.innerHTML = `
      <p>Nenhum relatório corresponde aos filtros atuais.</p>
      <button id="btn-new-report-inline" class="primary" type="button">Novo relatório</button>
    `;
    document.getElementById("btn-new-report-inline")?.addEventListener("click", onCreateReport);
  }
}

function getUnitName(report) {
  const tipo = report?.tipoId ?? "";
  const data = report?.data ?? {};
  if (tipo.includes("processamento")) {
    return (
      getByPath(data, "identificacao.dados_empresa.nome_fantasia") ||
      getByPath(data, "identificacao.dados_empresa.razao_social") ||
      ""
    );
  }
  return getByPath(data, "identificacao.produtor_nome") || getByPath(data, "identificacao.nome_unidade_producao") || "";
}

function getVerificadores(report) {
  const verificadores = getByPath(report.data, "identificacao.coordenador_verificador");
  if (!verificadores) return [];
  return Array.isArray(verificadores) ? verificadores.filter(Boolean) : [verificadores];
}

async function calculateCompletion(report, schema) {
  const required = schema.requiredFields ?? [];
  if (!required.length) return 0;
  let filled = 0;
  for (const path of required) {
    const value = getByPath(report.data, path);
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && !value.trim()) continue;
    if (Array.isArray(value) && !value.length) continue;
    filled += 1;
  }
  return (filled / required.length) * 100;
}

// ------------------------------
// Seleção e Renderização do Formulário
// ------------------------------
async function selectReport(id) {
  const report = findReport(id);
  if (!report) return;
  state.currentReportId = id;
  const schema = await loadTypeSchema(report.tipoId);
  ensureStructure(report.data, schema.dataTemplate);
  renderReportHeader(report);
  renderTimeline(report);
  await renderForm(report, schema);
}

function renderReportHeader(report) {
  const types = state.schemasManifest?.types ?? {};
  const label = types[report.tipoId]?.label ?? report.tipoId;
  const unidade = getUnitName(report) || "Sem identificação";
  elements.reportTitle.textContent = `${label} - ${unidade}`;
  const conformidade = report.conformidade ?? "pendente";
  elements.reportMeta.textContent = `Atualizado em ${formatDate(report.updatedAt)} · Conformidade: ${conformidade}`;
  elements.reportHeader.classList.remove("hidden");
}

function renderTimeline(report) {
  const container = elements.timeline;
  container.innerHTML = "";
  const types = state.schemasManifest?.types ?? {};
  const typeInfo = types[report.tipoId];
  const entry = document.createElement("div");
  entry.className = "timeline-entry";
  entry.innerHTML = `
    <h4>Rascunho atual</h4>
    <time>${formatDate(report.updatedAt)}</time>
    <p>${typeInfo?.label ?? report.tipoId}</p>
  `;
  container.append(entry);

  const pmoForms = state.pmoManifest?.forms ?? {};
  Object.entries(pmoForms).forEach(([key, form]) => {
    const item = document.createElement("div");
    item.className = "timeline-entry";
    item.innerHTML = `
      <h4>${form.label}</h4>
      <time>Schema v${form.schemaVersion}</time>
      <p>${form.schemaPath}</p>
    `;
    container.append(item);
  });
}

async function renderForm(report, schema) {
  const container = elements.formContainer;
  container.innerHTML = "";

  for (const moduleRef of schema.moduleGraph ?? []) {
    const moduleDef = await loadModule(moduleRef.moduleId, moduleRef.version);
    const moduleSection = document.createElement("section");
    moduleSection.className = "module";
    const moduleHeader = document.createElement("header");
    const moduleTitle = document.createElement("h3");
    moduleTitle.textContent = moduleDef.label ?? moduleRef.moduleId;
    moduleHeader.append(moduleTitle);
    moduleSection.append(moduleHeader);

    const body = document.createElement("div");
    body.className = "field-grid";
    const namespace = moduleDef.fieldNamespace ?? null;
    const moduleTemplate = moduleDef.dataTemplate ?? {};
    const moduleData = namespace ? getByPath(report.data, namespace) : report.data;

    ensureStructure(moduleData, moduleTemplate);
    if (namespace) {
      setByPath(report.data, namespace, moduleData);
    }

    renderTemplate(body, moduleTemplate, report, namespace);
    moduleSection.append(body);
    container.append(moduleSection);
  }
}

function renderTemplate(parent, template, report, basePath = "") {
  Object.entries(template).forEach(([key, templateValue]) => {
    if (key.startsWith("_")) return;
    const path = basePath ? `${basePath}.${key}` : key;
    const currentValue = getByPath(report.data, path);

    if (Array.isArray(templateValue)) {
      renderArrayField(parent, key, templateValue, currentValue, report, path);
      return;
    }

    if (templateValue && typeof templateValue === "object") {
      const group = document.createElement("div");
      group.className = "array-item";
      const header = document.createElement("header");
      const title = document.createElement("h4");
      title.textContent = key;
      header.append(title);
      group.append(header);

      const nested = document.createElement("div");
      nested.className = "field-grid";
      renderTemplate(nested, templateValue, report, path);
      group.append(nested);
      parent.append(group);
      return;
    }

    renderPrimitiveField(parent, key, templateValue, currentValue, report, path);
  });
}

function renderPrimitiveField(parent, key, templateValue, currentValue, report, path) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";
  const label = document.createElement("label");
  label.textContent = key;
  wrapper.append(label);

  let input;
  if (typeof templateValue === "boolean") {
    input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(currentValue);
    input.addEventListener("change", () => {
      setByPath(report.data, path, input.checked);
      markReportDirty(report.id);
    });
    wrapper.append(input);
  } else if (typeof templateValue === "number") {
    input = document.createElement("input");
    input.type = "number";
    input.value = currentValue ?? 0;
    input.addEventListener("input", () => {
      const parsed = input.value === "" ? null : Number(input.value);
      setByPath(report.data, path, Number.isNaN(parsed) ? null : parsed);
      markReportDirty(report.id);
    });
    wrapper.append(input);
  } else {
    const isLongText = typeof currentValue === "string" && currentValue.length > 80;
    if (isLongText || key.includes("observacao") || key.includes("descricao")) {
      input = document.createElement("textarea");
      input.value = currentValue ?? "";
    } else {
      input = document.createElement("input");
      input.type = "text";
      input.value = currentValue ?? "";
    }
    input.addEventListener("input", () => {
      setByPath(report.data, path, input.value);
      markReportDirty(report.id);
    });
    wrapper.append(input);
  }

  parent.append(wrapper);
}

function renderArrayField(parent, key, templateValue, currentValue, report, path) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const header = document.createElement("div");
  header.className = "array-item header";
  const label = document.createElement("label");
  label.textContent = key;
  header.append(label);

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.textContent = "+ adicionar";
  addButton.addEventListener("click", () => {
    const sample = templateValue[0] ?? "";
    const clone = ensureStructure(undefined, sample);
    const arr = getByPath(report.data, path);
    arr.push(clone);
    markReportDirty(report.id);
    renderForm(report, state.typeSchemas.get(report.tipoId));
  });
  header.append(addButton);
  wrapper.append(header);

  const items = Array.isArray(currentValue) ? currentValue : [];
  const list = document.createElement("div");
  list.className = "array-items";

  items.forEach((item, index) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "array-item";

    const itemHeader = document.createElement("header");
    const itemTitle = document.createElement("strong");
    itemTitle.textContent = `${key} ${index + 1}`;
    itemHeader.append(itemTitle);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => {
      const arr = getByPath(report.data, path);
      arr.splice(index, 1);
      markReportDirty(report.id);
      renderForm(report, state.typeSchemas.get(report.tipoId));
    });
    itemHeader.append(removeButton);
    itemWrapper.append(itemHeader);

    const content = document.createElement("div");
    content.className = "field-grid";
    const templateItem = templateValue[0] ?? "";
    if (templateItem && typeof templateItem === "object" && !Array.isArray(templateItem)) {
      renderTemplate(content, templateItem, report, `${path}.${index}`);
    } else {
      renderPrimitiveField(content, key, templateItem, item, report, `${path}.${index}`);
    }
    itemWrapper.append(content);

    list.append(itemWrapper);
  });

  wrapper.append(list);
  parent.append(wrapper);
}

function markReportDirty(reportId) {
  const report = findReport(reportId);
  if (!report) return;
  report.isDirty = true;
}

// ------------------------------
// Ações Gerais
// ------------------------------
async function pickReportType() {
  const types = state.schemasManifest?.types ?? {};
  const entries = Object.entries(types);
  if (!entries.length) {
    await ui.alert("Nenhum schema de visita disponível.", { title: "Sem modelos" });
    return null;
  }

  const options = entries.map(([id, def]) => ({
    value: id,
    label: def.label ?? id,
    description: def.summary ?? def.description ?? "",
  }));

  return ui.choice("Selecione o tipo do relatório", options, {
    description: "Escolha o modelo que deseja utilizar para criar o relatório.",
  });
}

async function onCreateReport() {
  const typeId = await pickReportType();
  if (!typeId) return;

  const report = await createReport(typeId);
  state.reports.unshift(report);
  saveReportsToStorage();
  await renderReportsList();
  await selectReport(report.id);
  ui.toast("Relatório criado.", { variant: "success" });
}

async function duplicateReport(id) {
  const report = findReport(id);
  if (!report) return;
  const clone = structuredCloneCompat(report);
  clone.id = uuid();
  clone.createdAt = new Date().toISOString();
  clone.updatedAt = clone.createdAt;
  clone.isDirty = true;
  state.reports.unshift(clone);
  saveReportsToStorage();
  await renderReportsList();
  await selectReport(clone.id);
}

function exportReportJson(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio-${report.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function handleSaveDraft() {
  const report = findReport(state.currentReportId);
  if (!report) return;
  report.isDirty = false;
  updateReport(report);
  ui.toast("Rascunho salvo.", { variant: "success" });
}

function handleExportCurrent() {
  const report = findReport(state.currentReportId);
  if (!report) return;
  exportReportJson(report);
}

async function handleGeneratePdf() {
  await ui.alert("Geração de PDF com JSON anexo ainda não implementada neste protótipo.", {
    title: "Em breve",
  });
}

async function handleDeleteCurrent() {
  const report = findReport(state.currentReportId);
  if (!report) return;
  const confirmed = await ui.confirm("Deseja realmente excluir este relatório?", {
    title: "Excluir relatório",
    okLabel: "Excluir",
    cancelLabel: "Cancelar",
    variant: "danger",
  });
  if (confirmed) {
    deleteReport(report.id);
    ui.toast("Relatório excluído.", { variant: "success" });
  }
}

async function handleReloadSchemas() {
  try {
    await loadManifests();
    state.typeSchemas.clear();
    state.moduleCache.clear();
    ui.toast("Schemas recarregados com sucesso.", { variant: "success" });
    renderReportsList();
  } catch (error) {
    console.error(error);
    await ui.alert("Erro ao recarregar schemas.");
  }
}

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!imported?.data || !imported?.tipoId) {
      await ui.alert("Arquivo inválido.", { title: "Importação" });
      return;
    }
    imported.id = uuid();
    imported.createdAt = imported.createdAt ?? new Date().toISOString();
    imported.updatedAt = new Date().toISOString();
    state.reports.unshift(imported);
    saveReportsToStorage();
    await renderReportsList();
    await selectReport(imported.id);
    ui.toast("Relatório importado.", { variant: "success" });
  } catch (error) {
    console.error(error);
    await ui.alert("Falha ao importar JSON. Certifique-se de selecionar um arquivo válido.", {
      title: "Importação",
    });
  } finally {
    event.target.value = "";
  }
}

// ------------------------------
// Inicialização
// ------------------------------
async function init() {
  state.reports = loadReportsFromStorage();
  try {
    await loadManifests();
  } catch (error) {
    console.error(error);
    await ui.alert("Erro ao carregar manifestos. Verifique os arquivos em /schemas e /pmo.");
    return;
  }
  renderReportsList();
}

// ------------------------------
// Eventos
// ------------------------------
elements.btnNewReport?.addEventListener("click", onCreateReport);
elements.btnSyncSchemas?.addEventListener("click", handleReloadSchemas);
elements.searchInput?.addEventListener("input", () => renderReportsList());
elements.filterTipo?.addEventListener("change", () => renderReportsList());
elements.filterConformidade?.addEventListener("change", () => renderReportsList());
elements.btnSaveDraft?.addEventListener("click", handleSaveDraft);
elements.btnExportJson?.addEventListener("click", handleExportCurrent);
elements.btnGeneratePdf?.addEventListener("click", handleGeneratePdf);
elements.btnDeleteReport?.addEventListener("click", handleDeleteCurrent);
elements.fileImport?.addEventListener("change", handleImportFile);

init();
