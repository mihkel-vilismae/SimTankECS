// tests/setup/setupHeadlessWebGL.js
// Load BEFORE any import that touches three/WebGLRenderer.

// Minimal WebGL context that satisfies Three.js feature probes
function makeWebGLContext(canvas) {
  return {
    canvas,
    getExtension: () => null,
    getParameter: () => 1,
    viewport: () => {},
    clearColor: () => {},
    clear: () => {},
    createTexture: () => ({}),
    bindTexture: () => {},
    texImage2D: () => {},
    texParameteri: () => {},
  };
}

// 1) Node (no jsdom): provide a tiny document + canvas that supports addEventListener
if (typeof document === 'undefined') {
  const listeners = new Map();
  const makeCanvasShim = () => ({
    width: 1,
    height: 1,
    style: {},
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(cb);
    },
    removeEventListener(type, cb) {
      listeners.get(type)?.delete(cb);
    },
    dispatchEvent(evt) {
      const set = listeners.get(evt?.type);
      if (set) for (const cb of set) cb(evt);
      return true;
    },
    getContext: (type) =>
        (type === 'webgl' || type === 'webgl2')
            ? makeWebGLContext(this)
            : type === '2d'
                ? { canvas: this, fillRect: () => {}, drawImage: () => {} }
                : null,
  });

  globalThis.document = {
    createElement: (tag) => (tag === 'canvas' ? makeCanvasShim() : {}),
    getElementById: () => makeCanvasShim(),
    body: { appendChild() {} },
  };
}

// 2) jsdom present: DO NOT replace DOM methods, only add missing ones
if (typeof HTMLCanvasElement !== 'undefined') {
  const proto = HTMLCanvasElement.prototype;

  // jsdom already has addEventListener/removeEventListener — leave them alone.
  // Only provide getContext('webgl'|'webgl2') if missing.
  const originalGetContext = proto.getContext;
  proto.getContext = function (type, ...rest) {
    if (originalGetContext) {
      const ctx = originalGetContext.call(this, type, ...rest);
      if (ctx) return ctx;
    }
    if (type === 'webgl' || type === 'webgl2') {
      return makeWebGLContext(this);
    }
    if (type === '2d') {
      // Some jsdom builds don’t implement 2d; stub minimally.
      return { canvas: this, fillRect: () => {}, drawImage: () => {} };
    }
    return null;
  };
}

// 3) requestAnimationFrame for systems that rely on it
if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (cb) =>
      setTimeout(() => cb(Date.now()), 16);
}
