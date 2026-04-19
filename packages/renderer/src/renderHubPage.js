import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadHub } from "../../validator/src/loadHub.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function componentMap(components) {
  return new Map(components.map((component) => [component.data.id, component.data]));
}

async function readComponentData(hubRoot, component) {
  const dataFile = component.data?.file;
  if (!dataFile) {
    return null;
  }

  const raw = await readFile(path.join(hubRoot, dataFile), "utf8");
  if (dataFile.endsWith(".json")) {
    return JSON.parse(raw);
  }
  return raw;
}

function renderDataPreview(data) {
  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    const lines = data
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 5);
    return `<div class="hph-card-body">${lines.map((line) => `<p>${escapeHtml(line.replace(/^#+\s*/, ""))}</p>`).join("")}</div>`;
  }

  if (Array.isArray(data.items)) {
    return `
      <ul class="hph-card-list">
        ${data.items.map((item) => `<li><span>${escapeHtml(item.label ?? item.name)}</span><span class="hph-provenance-chip">${escapeHtml(item.status ?? item.state ?? "demo")}</span></li>`).join("")}
      </ul>
    `;
  }

  if (Array.isArray(data.metrics)) {
    return `
      <div class="hph-status-strip">
        ${data.metrics.map((metric) => `
          <span class="hph-status-item">
            <span class="hph-status-item__value">${escapeHtml(metric.value)}</span>
            <span class="hph-status-item__label">${escapeHtml(metric.label)}</span>
          </span>
        `).join("")}
      </div>
    `;
  }

  if (Array.isArray(data.events)) {
    return `
      <ul class="hph-card-list">
        ${data.events.map((event) => `<li><span>${escapeHtml(event.label)}</span><span class="hph-provenance-chip">${escapeHtml(event.type)}</span></li>`).join("")}
      </ul>
    `;
  }

  return `
    <div class="hph-card-body">
      ${Object.entries(data)
        .slice(0, 4)
        .map(([key, value]) => `<p><span class="hph-technical-stamp">${escapeHtml(key)}</span> ${escapeHtml(typeof value === "string" ? value : JSON.stringify(value))}</p>`)
        .join("")}
    </div>
  `;
}

async function renderComponent(hubRoot, component) {
  const data = await readComponentData(hubRoot, component);
  const tone = component.status === "protected" ? "verified" : component.status === "candidate" ? "caution" : undefined;
  const toneAttr = tone ? ` data-tone="${tone}"` : "";

  return `
    <article class="hph-display-surface" data-status="${escapeHtml(component.status)}">
      <header class="hph-card-header">
        <div>
          <span class="hph-technical-stamp"${toneAttr}>${escapeHtml(component.status)}</span>
          <h3>${escapeHtml(component.title)}</h3>
        </div>
        <span class="hph-provenance-chip">${escapeHtml(component.source?.kind ?? "demo")}</span>
      </header>
      ${renderDataPreview(data)}
      <p class="hph-why-here"><span class="hph-technical-stamp">why_here</span> ${escapeHtml(component.explanation?.why_here ?? "")}</p>
    </article>
  `;
}

async function renderSection(hubRoot, section, componentsById) {
  const cards = await Promise.all(
    (section.components ?? []).map((componentId) => renderComponent(hubRoot, componentsById.get(componentId)))
  );

  return `
    <section class="hph-home-section">
      <div class="hph-edge-marker">
        <span class="hph-bilingual-label">
          <span class="hph-bilingual-label__en">${escapeHtml(section.id)}</span>
          <span class="hph-bilingual-label__zh">${escapeHtml(section.label)}</span>
        </span>
      </div>
      <div class="hph-grid">
        ${cards.join("")}
      </div>
    </section>
  `;
}

export async function renderHubPage(hubRootInput) {
  const hub = await loadHub(hubRootInput);
  const componentsById = componentMap(hub.components);
  const sections = await Promise.all(
    (hub.manifest.data.home?.sections ?? []).map((section) => renderSection(hub.root, section, componentsById))
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hermes Personal Hub Demo</title>
    <link rel="stylesheet" href="./theme.css">
  </head>
  <body class="hph-root">
    <main class="hph-demo-shell">
      <header class="hph-demo-header">
        <span class="hph-technical-stamp">public demo</span>
        <h1>Hermes Personal Hub</h1>
        <p>A sanitized Life OS snapshot rendered from manifest, component, and data files.</p>
      </header>
      ${sections.join("")}
    </main>
  </body>
</html>`;
}
