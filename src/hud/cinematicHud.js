import { createPanel, mountPanel, destroyPanel, ensureHudRoot, createButton } from "./hudCommon.js";

export function createCinematicHUD({ getWorld } = {}) {
  const panel = createPanel({ id: "hud-cinematic", title: "Explosion Cinematic" });
  let btn, btnReturn;

  function render() {
    const w = getWorld?.();
    const enabled = w?.cinematicEnabled !== false;
    panel.body.innerHTML = "";
    btn = createButton(enabled ? "Cinematic: ON" : "Cinematic: OFF", () => {
      const ww = getWorld?.(); if (!ww) return;
      ww.cinematicEnabled = !(ww.cinematicEnabled !== false);
      render();
    });
    panel.body.appendChild(btn);

    const snap = !!(w && w.cinematicSnapBack);
    btnReturn = createButton(snap ? "Return: SNAP" : "Return: SMOOTH", () => {
      const ww = getWorld?.(); if (!ww) return;
      ww.cinematicSnapBack = !ww.cinematicSnapBack;
      render();
    });
    panel.body.appendChild(btnReturn);

    const labelTS = document.createElement("div"); labelTS.style.marginTop="8px"; labelTS.textContent="Time Slow";
    const sliderTS=document.createElement("input"); sliderTS.type="range"; sliderTS.min="0.2"; sliderTS.max="1.0"; sliderTS.step="0.05";
    sliderTS.value=String((w && typeof w.cinematicTimeScale==='number') ? w.cinematicTimeScale : 0.6);
    sliderTS.oninput=()=>{ const ww=getWorld?.(); if(!ww) return; ww.cinematicTimeScale=parseFloat(sliderTS.value); };
    panel.body.appendChild(labelTS); panel.body.appendChild(sliderTS);

    const labelOR = document.createElement("div"); labelOR.style.marginTop="6px"; labelOR.textContent="Orbit Radius x";
    const sliderOR=document.createElement("input"); sliderOR.type="range"; sliderOR.min="0.5"; sliderOR.max="2.0"; sliderOR.step="0.05";
    sliderOR.value=String((w && typeof w.cinematicOrbitRadiusScale==='number') ? w.cinematicOrbitRadiusScale : 1.0);
    sliderOR.oninput=()=>{ const ww=getWorld?.(); if(!ww) return; ww.cinematicOrbitRadiusScale=parseFloat(sliderOR.value); };
    panel.body.appendChild(labelOR); panel.body.appendChild(sliderOR);
  }

  function mount(container){ mountPanel(panel, container ?? ensureHudRoot()); render(); }
  function unmount(){ destroyPanel(panel); }
  function update(){ render(); }

  return { mount, unmount, update };
}
