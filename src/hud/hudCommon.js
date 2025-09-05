/**
 * Common DOM helpers for HUD panels
 */
export function createPanel({ id, title }) {
  const root = document.createElement("div");
  root.className = "hud-panel";
  if (id) root.id = id;

  const h = document.createElement("div");
  h.className = "hud-title";
  h.textContent = title;

  const body = document.createElement("div");
  body.className = "hud-body";

  root.appendChild(h);
  root.appendChild(body);
  return { root, body, titleEl: h };
}

export function createButton(label, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = "hud-btn";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    onClick?.();
  });
  return btn;
}

export function renderKV(body, rows) {
  body.innerHTML = "";
  for (const [k, v] of rows) {
    const row = document.createElement("div");
    row.className = "hud-row";
    const kEl = document.createElement("span");
    kEl.className = "hud-k";
    kEl.textContent = k;
    const vEl = document.createElement("span");
    vEl.className = "hud-v";
    vEl.textContent = v;
    row.appendChild(kEl);
    row.appendChild(vEl);
    body.appendChild(row);
  }
}

export function ensureHudRoot() {
  let root = document.getElementById("hud-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "hud-root";
    document.body.appendChild(root);
  }
  // panels container
  let panels = document.getElementById("hud-panels");
  if (!panels) {
    panels = document.createElement("div");
    panels.id = "hud-panels";
    root.appendChild(panels);
  }
  return panels;
}
