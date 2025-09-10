import * as THREE from "three";
import {Logger} from "../utils/logger.js";

function makeNoiseTexture(size = 256, intensity = 0.08) {
  // Try DOM canvas first
  let canvas = null, ctx = null;
  if (typeof document !== "undefined" && typeof document.createElement === "function") {
    canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
    ctx = canvas.getContext("2d");
  }

  // Fallback: DataTexture (no DOM / no 2D context)
  if (!ctx) {
    Logger.warn("[makeNoiseTexture] No 2D canvas context; using DataTexture fallback");
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const n = 0.5 + (Math.random() - 0.5) * intensity * 2.0;
      const v = Math.max(0, Math.min(255, Math.floor(n * 255)));
      const j = i * 4;
      data[j+0] = v; data[j+1] = v; data[j+2] = v; data[j+3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  // Normal browser path (CanvasTexture)
  Logger.info(canvas);
  const img = ctx.createImageData(size, size);
  // base random
  for (let i = 0; i < size * size; i++) {
    // centered noise around 0.5
    const n = 0.5 + (Math.random() - 0.5) * intensity * 2.0;
    const v = Math.max(0, Math.min(255, Math.floor(n * 255)));
    img.data[i*4+0] = v;
    img.data[i*4+1] = v;
    img.data[i*4+2] = v;
    img.data[i*4+3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function createGround(opts = {}) {
  const {
    size = 200,
    color = 0x3a6e2f,        // grass green
    squareSize = 0.5,        // base square size (smaller squares)
    gridColor1 = 0x555555,   // fine grid colors
    gridColor2 = 0x333333,
    gridOpacity = 0.5,
    majorLineEvery = 10,     // emphasize every Nth line
    majorColor = 0xffffff,   // white major lines
    majorOpacity = 0.9,
    axisColor = 0xffffff,    // thick axis at X=0 and Z=0
    axisWidth = 0.06,        // visual width of axis lines
    noiseIntensity = 0.08,   // 0..1 subtle noise amount
    noiseRepeat = 24,        // how many times noise tiles across the ground
  } = opts;

  function createGroundPlane() {
    // Ground plane (XZ)
    const geo = new THREE.PlaneGeometry(size, size);
    return geo;
  }

  function createNoiseTexture() {
    const noiseTex = makeNoiseTexture(256, noiseIntensity);
    if (noiseTex.repeat) {
      noiseTex.repeat.set(noiseRepeat, noiseRepeat);
    }
    return noiseTex;
  }

  function createGroundMesh() {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 1.0,
      metalness: 0.0,
      map: noiseTex,
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    return ground;
  }

  function setGridTransparent(grid, transparent = true, opacity = 1.0) {
    const apply = (m) => {
      if (!m) return;
      m.transparent = transparent;
      m.opacity = opacity;
      m.depthWrite = false;
    };

    if (grid && grid.material) {
      if (Array.isArray(grid.material)) {
        grid.material.forEach(apply);
      } else {
        apply(grid.material);
      }
    } else if (typeof grid.traverse === "function") {
      grid.traverse((obj) => {
        if (!obj.material) return;
        if (Array.isArray(obj.material)) obj.material.forEach(apply);
        else apply(obj.material);
      });
    }
  }

  function createFineGrid() {
    const divisions = Math.max(1, Math.floor(size / Math.max(0.01, squareSize)));
    const fineGrid = new THREE.GridHelper(size, divisions, gridColor1, gridColor2);
    setGridTransparent(fineGrid, true, gridOpacity);  // replaces direct access
  ///  fineGrid.position.y = 0.001;
    return fineGrid;
  }

  function createMajorGrid() {
    const majorStep = squareSize * Math.max(1, majorLineEvery);
    const majorDivisions = Math.max(1, Math.floor(size / majorStep));
    const majorGrid = new THREE.GridHelper(size, majorDivisions, majorColor, majorColor);
    setGridTransparent(majorGrid, true, majorOpacity);
 //   majorGrid.position.y = 0.002;
    return majorGrid;
  }

 /* function createFineGrid() {
    // Fine grid (centered at origin; lines pass through (0,0))
    const divisions = Math.max(1, Math.floor(size / Math.max(0.01, squareSize)));
    const fineGrid = new THREE.GridHelper(size, divisions, gridColor1, gridColor2);
    setGridOpacity(fineGrid, gridOpacity);
    fineGrid.material.transparent = true;
    fineGrid.position.y = 0.001; // avoid z-fighting with ground
    return fineGrid;
  }

  // Major grid
  function createMajorGrid() {
    const majorStep = squareSize * Math.max(1, majorLineEvery);
    const majorDivisions = Math.max(1, Math.floor(size / majorStep));
    const majorGrid = new THREE.GridHelper(size, majorDivisions, majorColor, majorColor);
    setGridOpacity(majorGrid, majorOpacity);
    majorGrid.position.y = 0.002;
    return majorGrid;
  }*/

  function createXZAxis() {
    // Thick world axes at X=0 and Z=0 using thin box meshes (linewidth is unreliable in WebGL)
    const axisY = 0.003; // above grids to avoid z-fighting
    const axisLength = size;
    const axisMat = new THREE.MeshBasicMaterial({color: axisColor});
    // X axis (line along X at Z=0)
    const xAxis = new THREE.Mesh(new THREE.BoxGeometry(axisLength, 0.001, axisWidth), axisMat);
    xAxis.position.set(0, axisY, 0);
    xAxis.rotation.x = 0; // already on XZ plane
    // Z axis (line along Z at X=0)
    const zAxis = new THREE.Mesh(new THREE.BoxGeometry(axisWidth, 0.001, axisLength), axisMat);
    zAxis.position.set(0, axisY, 0);
    return {xAxis, zAxis};
  }

  const geo = createGroundPlane();
  const noiseTex = createNoiseTexture();
  const ground = createGroundMesh();
  const group = new THREE.Group();
  const fineGrid = createFineGrid();
  const majorGrid = createMajorGrid();
  const {xAxis, zAxis} = createXZAxis();

  group.add(ground);
  group.add(fineGrid);
  group.add(majorGrid);
  group.add(xAxis);
  group.add(zAxis);

  group.userData.isGround = true;
  group.userData.grid = {
    size, squareSize, gridColor1, gridColor2, gridOpacity,
    majorLineEvery, majorColor, majorOpacity,
    axisColor, axisWidth, noiseIntensity, noiseRepeat
  };

  return group;
}
