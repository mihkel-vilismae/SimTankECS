
import * as THREE from 'three';
import createGL from 'gl';
import { createCanvas } from '@napi-rs/canvas';

(globalThis as any).requestAnimationFrame ??= (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
(globalThis as any).cancelAnimationFrame ??= (id: number) => clearTimeout(id as any);
(globalThis as any).devicePixelRatio ??= 1;

function makeCanvas(width = 800, height = 600) {
  const canvas: any = createCanvas(width, height);
  canvas.width = width; canvas.height = height;
  canvas.getContext = (type: string, attrs?: any) => {
    if (type === '2d') {
      return {
        createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w*h*4), width: w, height: h }),
        putImageData: () => {},
      } as any;
    }
    if (type === 'webgl' || type === 'webgl2') {
      const gl: any = createGL(width, height, { preserveDrawingBuffer: true, ...attrs });
      gl.canvas = canvas;
      return gl;
    }
    return null;
  };
  return canvas;
}

const origCreateEl = globalThis.document?.createElement?.bind(document);
if (origCreateEl) {
  (document as any).createElement = (tag: string, ...rest: any[]) => {
    if (tag.toLowerCase() === 'canvas') return makeCanvas();
    return origCreateEl(tag, ...rest);
  };
}

(globalThis as any).OffscreenCanvas ??= class {
  private _canvas = makeCanvas();
  width: number; height: number;
  constructor(w = 1, h = 1) { this.width = w; this.height = h; }
  getContext(type: string, attrs?: any) { return (this._canvas as any).getContext(type, attrs); }
  transferToImageBitmap() { return {}; }
};

(globalThis as any).createImageBitmap ??= async () => ({});
