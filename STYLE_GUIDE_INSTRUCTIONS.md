📋 FULL INSTRUCTIONS (SimTankFrom0_weapons)
# General Development

Always think like a senior developer.

Before writing any code, always tell the user which files you want to modify or create.

If the user doesn’t give specific file-related orders, prefer modifying existing files instead of creating new ones.

~~Logging rules (simtank_log.txt, prompt_log_v2.txt) are completely removed — do not reintroduce them.~~
~~No “File Handling Rules” active anymore.~~

# Project-Specific Instructions
🚜 **Tank + Movement**

- The hull of every object must always face the movement direction (same as the arrow drawn on the ground).
- The arrow drawn on the ground should be its own system, applied to every currently selected object.

~~- When a vehicle (e.g., tank) is created, it must have:~~
~~- movementInputSystem → handles WSAD input.~~
~~- movementTransformationSystem → applies movement in the world.~~
~~- movementVFXSystem → triggers visuals like track turning and exhaust smoke.~~

**🎯 Turret + Weapons**

~~Tanks should use both:~~
~~turretSystem~~
~~followsMouseSystem~~

Turret rotates with the mouse.
Gun moves up/down following the mouse.
Weapons (machine gun, cannon, etc.) must be distinct and attached via hardpoints:
Turret attached.
Guns attached.
Selected gun & turret must aim precisely at the crosshair.

**🎥 Camera + HUD**

Existing camera modes remain (e.g., follow hull).
#####   Explaining camera mode: follow_gun.
###### Implemented in src/systems/camera/cameraFollowGunSystem.js
- Activated when world.cameraMode === "follow_gun".
- Picks the Cannon if present, otherwise the first gun.
- Positions the camera slightly behind and above the barrel, looking forward along the muzzle.
- Uses muzzleForward helper + smooth lerp (like hull follow cam).
###### HUD Update (src/hud/cameraModesHud.js):
- Adds a “follow gun” button in the camera-mode panel.
- Keeps active-state highlighting in sync.
- System Wiring (src/app/registerSystems.js):
- Imports and adds cameraFollowGunSystem (after cameraFollowSystem).
~~###### Keybinding (src/app/createGame.js):~~
~~- Digit5 → switches to "follow_gun" mode.~~

# Code Style Instructions
**📦 Project Structure**

**Follow ECS architecture strictly:**
- Entities = data objects.
- Components = plain data (no logic).
- Systems = logic operating on components.

Keep HUD/UI in src/hud/.
Keep game world systems in src/systems/.
Keep setup/bootstrapping in src/app/.
Keep tests in src/tests/.

**📝 Coding Standards**

- Use ES Modules (import / export) consistently.
- Prefer pure functions and stateless helpers.
- Use descriptive names:
- Systems: somethingSystem.js.
- Components: somethingComponent.js.
- Helpers: somethingHelpers.js.

**🎨 Style & Formatting**

- Indentation: 2 spaces.
- Semicolons: required.
- Braces: always use { }, even for single-line blocks.
- **Variables:**
- const by default, let only if reassigned.
- No var.
- **Naming:**
- camelCase for variables & functions.
- PascalCase for classes.
- SCREAMING_SNAKE_CASE for constants.

**🛠️ Best Practices**

- Keep systems small and focused — one responsibility each.
- Avoid duplicate logic → factor into helpers if reused.
- Use smooth transitions (lerp, damping) for camera, movement, aiming.
- Always ensure frame-rate independence (time delta aware).
- Keep UI responsive to game state changes (sync highlighting, buttons, etc.).


# 🚀 TSI Project Style Guide

This guide defines how to name, structure, and organize code in the TSI project. Follow it strictly to keep the codebase clean, consistent, and future-proof.

1. **Functions & Variables**

- camelCase for all functions and variables.
✅ spawnTank(), applyStyleScheme(), getCameraState()
❌ Spawn_Tank(), apply_style_scheme(), GetCameraState()

- Verb-first naming for functions performing actions.
Example: createGround(), sendGameScore(), applyBackgroundStyle()

- Accessors/Mutators → use get / set prefix.
Example: getCameraState(), setCameraState()

- Booleans → prefix with is, has, or can.
Example: isTankAlive, hasConnection, canFireWeapon

- Constants → UPPER_CASE with underscores.
Example: PIN_R, TILE_SIZE, MAX_SPEED

2. **Classes**

- PascalCase for classes and constructors.
✅ Tank, CameraHUD, EventBus
❌ tank, camera_hud, eventbus

- Class names should be nouns describing the entity.
Example: Tank, Skybox, GameSession

3. **Files**

- camelCase for file names.
- Example:
✅ cameraHud.js, spawnTank.js, debugSnapshotSystem.js
❌ Camera_HUD.js, spawn_tank.js
- One module per file (except for small utilities).
- Folder prefixes for clarity (in trees/lists):


4. **Components**

- Components are tiny, data-only objects.
- No methods, only fields.
- Example:
const Transform = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { yaw: 0, pitch: 0, roll: 0 }
};

5. **Systems**

- Standardized signature: 
- function someSystem(dt, world, registry) { ... }
- All new systems must include at least one logging line for debugging.

6. **HUD & UI**
- Keep UI creation separate from logic.
- Example: hudHtml.js (DOM creation) and hudLogic.js (event wiring).
- Crosshair, ammo counter, debug HUD, etc. must be toggleable.

7. **Visual Style**

- Tanks, turrets, guns must be visually distinct.
- Opponent visuals → dimmed style compared to the player’s.
- Style schemes:
- color (effects, flashes, fadeouts)
- blackAndWhite (grayscale, bold outlines, no effects)