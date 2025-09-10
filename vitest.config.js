import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
            // Unit tests: mock WebGLRenderer (fast, no real canvas)
            {
                name: 'unit',
                environment: 'node',
                include: [
                    'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
                    '!tests/integration.*.{test,spec}.{js,ts,jsx,tsx}',
                    '!tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
                ],
                setupFiles: ['tests/setup/setupThreeMock.js'],
            },

            // Integration tests: jsdom + headless WebGL shim
            {
                name: 'integration',
                environment: 'jsdom',
                include: [
                    'tests/integration.*.{test,spec}.{js,ts,jsx,tsx}',
                    'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
                ],
                setupFiles: ['tests/setup/setupHeadlessWebGL.js'],
                environmentOptions: {
                    jsdom: { pretendToBeVisual: true },
                },
            },
        ],
    },
});
