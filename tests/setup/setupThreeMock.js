// tests/setup/setupThreeMock.js
import { vi } from 'vitest';

vi.mock('three', async (importOriginal) => {
  const THREE = await importOriginal();

  // Minimal fake WebGLRenderer that won’t try to talk to the GPU
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
    // Replace real WebGLRenderer with a mocked class
    WebGLRenderer: vi.fn().mockImplementation(() => new FakeRenderer()),

    // Preserve symbols that other parts of your code/tests rely on
    CanvasTexture: THREE.CanvasTexture,
    RepeatWrapping: THREE.RepeatWrapping,
    NearestFilter: THREE.NearestFilter,
    LinearFilter: THREE.LinearFilter,
    RGBAFormat: THREE.RGBAFormat,
  };
});
