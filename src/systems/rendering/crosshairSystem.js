import * as THREE from "three";
import { ensureHudRoot } from "../../hud/core/hudCommon.js";

function ensureCrosshair(world) {
  world.ui = world.ui || {};
  if (world.ui.crosshairEl) return world.ui.crosshairEl;
  const root = ensureHudRoot();
  const el = document.createElement("div");
  el.id = "hud-crosshair";
  Object.assign(el.style, {
    position: "absolute",
    width: "18px",
    height: "18px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    border: "2px solid #fff",
    borderRadius: "50%",
    boxShadow: "0 0 8px rgba(255,255,255,0.6)",
    opacity: "0.9",
    pointerEvents: "none",
    zIndex: "1000",
  });
  // inner dot
  const dot = document.createElement("div");
  Object.assign(dot.style, {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "4px",
    height: "4px",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    borderRadius: "50%",
  });
  el.appendChild(dot);
  root.appendChild(el);
  world.ui.crosshairEl = el;
  return el;
}

/** Places a screen-space crosshair over the ground hit from mouse ray. Falls back to screen center. */
export function crosshairSystem(dt, world, registry) {
  const el = ensureCrosshair(world);
  const cam = world.camera;
  if (!cam) return;

  let xPx = window.innerWidth/2;
  let yPx = window.innerHeight/2;

  const hit = world.mouse?.worldPoint;
  if (hit) {
    const v = new THREE.Vector3(hit.x, hit.y, hit.z);
    v.project(cam);
    // NDC -> pixels
    xPx = (v.x * 0.5 + 0.5) * window.innerWidth;
    yPx = ( -v.y * 0.5 + 0.5) * window.innerHeight;
  } else if (world.input?.mouse) {
    // fallback to mouse NDC if available
    const m = world.input.mouse;
    xPx = (m.x * 0.5 + 0.5) * window.innerWidth;
    yPx = ( -m.y * 0.5 + 0.5) * window.innerHeight;
  }

  el.style.left = `${xPx}px`;
  el.style.top = `${yPx}px`;
  el.style.display = "block";
}
