// tests/setup/setupThreeMock.js
import { vi } from 'vitest';

vi.mock('three', async (importOriginal) => {
  const THREE = await importOriginal();

  class FakeRenderer {
    constructor() {
      this.domElement = { width: 1, height: 1 };
    }
    setSize() {}
    render() {}
    dispose() {}
  }

  return {
    ...THREE,
    WebGLRenderer: vi.fn().mockImplementation(() => new FakeRenderer()),
    // Ensure commonly-used symbols are preserved from real module:
    CanvasTexture: THREE.CanvasTexture,
    RepeatWrapping: THREE.RepeatWrapping,
    NearestFilter: THREE.NearestFilter,
    LinearFilter: THREE.LinearFilter,
    RGBAFormat: THREE.RGBAFormat,
  };
});
