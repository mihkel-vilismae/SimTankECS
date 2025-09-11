/**
 * Common DOM helpers for HUD panels
 * All HUDs should use: createPanel -> mountPanel -> destroyPanel
 */

export function ensureHudRoot() {
  let root = document.getElementById("hud-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "hud-root";
    document.body.appendChild(root);
  }
  let panels = document.getElementById("hud-panels");
  if (!panels) {
    panels = document.createElement("div");
    panels.id = "hud-panels";
    root.appendChild(panels);
  }
  return panels;
}



export function mountPanel(panel, container = ensureHudRoot()) {
  container.appendChild(panel.root);
}

export function destroyPanel(panel) {
  if (panel?.root?.parentElement) {
    panel.root.parentElement.removeChild(panel.root);
  }
}

/** Render key–value rows inside a panel body */
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


/** Mark/unmark an element as active (for toggle groups) */
export function setActive(el, isActive) {
  if (!el) return;
  el.classList.toggle("active", !!isActive);
}

