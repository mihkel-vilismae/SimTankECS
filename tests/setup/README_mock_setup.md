SimTankECS – Vitest 'three' Partial Mock (CanvasTexture fix)
===========================================================

What this is
------------
A minimal setup file that *partially mocks* 'three' while preserving the real
module. It guarantees CanvasTexture, Texture, and RepeatWrapping exist so code
like:
new (THREE.CanvasTexture ?? THREE.Texture)(canvas)
does not crash under Vitest.

How to use
----------
1) Place tests/setup/three-mock.js in your repo (keep the same path).
2) Add it to vitest setup:

   // vitest.config.ts (or .js)
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
   test: {
   setupFiles: ['tests/setup/three-mock.js'],
   },
   });

Important
---------
• If you already have another 'three' mock, remove it to avoid double-mocking.
• This mock uses `vi.mock('three', async (importOriginal) => { const actual = await importOriginal(); ... })`
so all real exports are preserved and only missing pieces are shimmed.

Why this fixes your failures
----------------------------
Vitest throws when a mocked module is missing an export that the real module
has, especially with `import * as THREE from 'three'`. Your stack traces showed:

Error: [vitest] No "CanvasTexture" export is defined on the "three" mock.

By returning `{ ...actual, CanvasTexture, Texture, RepeatWrapping }`, we ensure
that property exists on the mocked module, eliminating the crash across the
integration tests that create ground noise textures.

