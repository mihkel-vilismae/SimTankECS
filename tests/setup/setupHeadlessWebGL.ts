
// Headless WebGL setup for Vitest (Node)
// - Provides window/document via jsdom
// - Hooks canvas.getContext(...) to return a headless-gl WebGL context
declare module "jsdom";
import { JSDOM } from "jsdom";
let glFactory: any;

(async () => {
  try {
    console.error("[setupHeadlessWebGL] is used!");
    glFactory = (await import("gl")).default ?? await import("gl");
  } catch (e) {
    console.warn("[setupHeadlessWebGL] 'gl' package not installed. WebGL will be mocked.");
  }
})();

const { window } = new JSDOM(`<!doctype html><html><body><div id="app"></div></body></html>`, {
  pretendToBeVisual: true,
});
const { document } = window as unknown as { document: Document };

(globalThis as any).window = window;
(globalThis as any).document = document;
(globalThis as any).performance = globalThis.performance ?? { now: () => Date.now() };
(globalThis as any).requestAnimationFrame = (cb: Function) => setTimeout(() => cb(Date.now()), 16);
(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
(globalThis as any).navigator = { userAgent: "vitest-jsdom" };

class OffscreenCanvasShim {
  width: number;
  height: number;
  constructor(width = 800, height = 600) { this.width = width; this.height = height; }
  getContext(kind: string, attrs?: any) {
    if (glFactory && (kind === "webgl" || kind === "webgl2" || kind === "experimental-webgl")) {
      const gl = glFactory(this.width, this.height, { antialias: true, ...attrs });
      return gl;
    }
    return { canvas: this, getParameter(){return 0;}, getExtension(){return null;}, viewport(){}, clearColor(){}, clear(){}, enable(){}, disable(){}, createShader(){return {};}, shaderSource(){}, compileShader(){}, createProgram(){return {};}, attachShader(){}, linkProgram(){}, useProgram(){}, getError(){return 0;} };
  }
}
(globalThis as any).OffscreenCanvas = OffscreenCanvasShim as any;

const HTMLCanvasElementProto: any = (window as any).HTMLCanvasElement?.prototype;
if (HTMLCanvasElementProto) {
  const origGetContext = HTMLCanvasElementProto.getContext;
  HTMLCanvasElementProto.getContext = function(kind: string, attrs?: any) {
    if (glFactory && (kind === "webgl" || kind === "webgl2" || kind === "experimental-webgl")) {
      const width = this.width || 800;
      const height = this.height || 600;
      const gl = glFactory(width, height, { antialias: true, ...attrs });
      return gl;
    }
    return origGetContext ? origGetContext.call(this, kind, attrs) : null;
  };
}

(window as any).matchMedia = (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} });

console.info("[setupHeadlessWebGL] Installed headless WebGL hooks.");
