export function attachMouse(world, canvas = null) {
    world.input.mouse = {x: null, y: null, down: false, wheelDelta: 0};

    function toNDC(ev) {
        const hasDoc = typeof document !== "undefined";
        const target = canvas || (hasDoc ? document.body : null);
        const rect = target && target.getBoundingClientRect
            ? target.getBoundingClientRect()
            : {left: 0, top: 0, width: 1, height: 1};
        const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        return {x, y};
    }

    function move(e) {
        Object.assign(world.input.mouse, toNDC(e));
    }

    function down() {
        world.input.mouse.down = true;
    }

    function up() {
        world.input.mouse.down = false;
    }

    function wheel(e) {
        world.input.mouse.wheelDelta += e.deltaY;
    }

   if (typeof window !== "undefined" && window.addEventListener) {
     window.addEventListener("mousemove", move);
     window.addEventListener("mousedown", down);
     window.addEventListener("mouseup", up);
     window.addEventListener("wheel", wheel, {passive: true});
   }

    return () => {
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mousedown", down);
        window.removeEventListener("mouseup", up);
        window.removeEventListener("wheel", wheel);
      }
    };
}
