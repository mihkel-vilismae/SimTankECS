// tests/setup/three-mock.js
// Partial mock for 'three' that preserves the real module and fills in
// anything jsdom-based tests commonly miss (CanvasTexture, RepeatWrapping, etc).
// If your repo already mocked 'three' elsewhere, remove that and use this one.

import { vi } from 'vitest';

vi.mock('three', async (importOriginal) => {
    const actual = await importOriginal();

    // --- Minimal shims if certain classes/constants are missing in the test env ---

    class NoopTexture {
        constructor(image) {
            this.image = image ?? null;
            this.wrapS = this.wrapT = actual.RepeatWrapping ?? 1000; // THREE.RepeatWrapping is 1000
            this.anisotropy = 1;
            this.needsUpdate = false;
        }
        dispose() {}
    }

    // CanvasTexture that behaves like a Texture but flags itself as canvas-based.
    class CanvasTextureShim extends (actual.Texture ?? NoopTexture) {
        constructor(image) {
            super(image);
            this.isCanvasTexture = true;
            this.needsUpdate = true;
        }
    }

    const Texture = actual.Texture ?? NoopTexture;
    const CanvasTexture = actual.CanvasTexture ?? CanvasTextureShim;
    const RepeatWrapping = actual.RepeatWrapping ?? 1000;

    // Provide minimal scene graph classes if a previous mock stripped them.
    const Object3D = actual.Object3D ?? class Object3D {
        constructor() {
            this.children = [];
            this.position = {
                x: 0, y: 0, z: 0,
                set(x, y, z) { this.x = x; this.y = y; this.z = z; }
            };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.visible = true;
            this.parent = null;
        }
        add(child) { this.children.push(child); child.parent = this; }
        remove(child) { this.children = this.children.filter(c => c !== child); if (child) child.parent = null; }
        lookAt() {}
    };

    const Group = actual.Group ?? class Group extends Object3D {};
    const Mesh = actual.Mesh ?? class Mesh extends Object3D {
        constructor() { super(); this.isMesh = true; }
    };
    const Scene = actual.Scene ?? class Scene extends Object3D {
        constructor() { super(); this.isScene = true; }
    };
    const PerspectiveCamera = actual.PerspectiveCamera ?? class PerspectiveCamera extends Object3D {
        constructor() { super(); this.isCamera = true; }
    };

    // Return the real module plus our safe fallbacks.
    return {
        ...actual,
        Object3D,
        Group,
        Mesh,
        Scene,
        PerspectiveCamera,
        Texture,
        CanvasTexture,
        RepeatWrapping,
    };
});

export {};
