// tests/setup/three-mock.js
import { vi } from 'vitest';

/*
vi.mock('three', async () => {
    console.error("[three-mock] is used!");
    const actual = await vi.importActual('three');

    class NoopTexture {
        constructor(image) {
            this.image = image ?? null;
            this.wrapS = this.wrapT = actual.RepeatWrapping ?? 1000;
            this.anisotropy = 1;
            this.needsUpdate = false;
            this.format = actual.RGBAFormat ?? 1023;
        }
        dispose() {}
    }

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

    class Object3D {
        constructor() {
            this.children = [];
            this.position = {
                x: 0, y: 0, z: 0,
                set(x, y, z) { this.x = x; this.y = y; this.z = z; }
            };
            this.rotation = { x: 0, y: 0, z: 0 };
            this.visible = true;
            this.parent = null;
            this.matrixWorld = { identity() {}, copy() {} };
        }
        add(child) { this.children.push(child); child.parent = this; }
        remove(child) { this.children = this.children.filter(c => c !== child); if (child) child.parent = null; }
        lookAt() {}
        updateMatrixWorld() {}
    }

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
*/

export {};
