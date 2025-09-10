# Headless WebGL for Vitest
Install deps:
  npm i -D gl @napi-rs/canvas
Vitest picks up ./test/setupHeadlessWebGL.ts and disables worker threads (threads:false).
