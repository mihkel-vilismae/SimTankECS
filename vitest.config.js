import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        threads: false,
        environment: "jsdom",
        /*setupFiles:
            [
                    // './tests/setup/setupHeadlessWebGL.ts',
                    './tests/setup/three-mock.js',
                    //  "./tests/setup/setup.js",
            ],*/
        setupFiles: [
            'tests/setup/setupHeadlessWebGL.ts',
            'tests/setup/three-mock.js'
        ],
        globals: true,
    },
});
