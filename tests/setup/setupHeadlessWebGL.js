// tests/setup/setupHeadlessWebGL.js
// Must run before any import that touches three/WebGLRenderer.

if (typeof HTMLCanvasElement !== 'undefined') {
  const proto = HTMLCanvasElement.prototype;
  if (typeof proto.getContext !== 'function') {
    proto.getContext = function(type) {
      if (type === 'webgl' || type === 'webgl2') {
        return {
          getExtension: () => null,
          getParameter: () => 1,
          canvas: { width: this.width || 1, height: this.height || 1 },
          viewport: () => {},
          clearColor: () => {},
          clear: () => {},
          createTexture: () => ({}),
          bindTexture: () => {},
          texImage2D: () => {},
          texParameteri: () => {},
        };
      }
      if (type === '2d') {
        return {
          canvas: { width: this.width || 1, height: this.height || 1 },
          fillRect: () => {},
          drawImage: () => {},
        };
      }
      return null;
    };
  }
}

// Provide a minimal document if needed
if (typeof document !== 'undefined') {
  if (!document.getElementById) {
    document.getElementById = () => {
      const c = document.createElement ? document.createElement('canvas') : { width: 1, height: 1 };
      return c;
    };
  }
} else {
  globalThis.document = {
    createElement: () => ({ width: 1, height: 1 }),
    getElementById: () => ({ width: 1, height: 1 }),
  };
}

// Stub requestAnimationFrame for systems relying on it
if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
}