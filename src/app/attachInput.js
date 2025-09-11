export function attachInput(world) {
    world.input = world.input || {keys: {}, mouse: {down: false, x: null, y: null, wheelDelta: 0}};

    function down(e) {
        world.input.keys[e.code] = true;
    }

    function up(e) {
        world.input.keys[e.code] = false;
    }

    if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }
    // Headless: return no-op disposer
    return () => {
    };
}
