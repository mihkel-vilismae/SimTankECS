import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: [
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
            {
                name: 'integration',
                environment: 'jsdom',
                include: [
                    'tests/integration.*.{test,spec}.{js,ts,jsx,tsx}',
                    'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
                ],
                setupFiles: [
                    'tests/setup/setupHeadlessWebGL.js', // polyfills getContext if missing
                    'tests/setup/setupDomCanvas.js',     // ensures <canvas id="app">
                ],
                environmentOptions: {
                    jsdom: { pretendToBeVisual: true },
                },
            },
        ],
    },
});
