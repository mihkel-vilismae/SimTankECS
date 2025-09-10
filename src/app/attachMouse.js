export function attachMouse(world, canvas = document.getElementById("app")) {
  world.input.mouse = { x: null, y: null, down: false, wheelDelta: 0, buttons: { left: false, middle: false, right: false } };

  function toNDC(ev) {
    const target = canvas || document.body;
    const rect = target.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    return { x, y };
  }
  function move(e){ Object.assign(world.input.mouse, toNDC(e)); }
  function down(e){ world.input.mouse.down = true; if (e) { if (e.button===0) world.input.mouse.buttons.left=true; if (e.button===1) world.input.mouse.buttons.middle=true; if (e.button===2) world.input.mouse.buttons.right=true; } }
  function up(e){ world.input.mouse.down = false; if (e) { if (e.button===0) world.input.mouse.buttons.left=false; if (e.button===1) world.input.mouse.buttons.middle=false; if (e.button===2) world.input.mouse.buttons.right=false; } }
  function wheel(e){ world.input.mouse.wheelDelta += e.deltaY; }

  window.addEventListener("mousemove", move);
  window.addEventListener("mousedown", down);
  window.addEventListener("mouseup", up);
  window.addEventListener("wheel", wheel, { passive: true });

  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mousedown", down);
    window.removeEventListener("mouseup", up);
    window.removeEventListener("wheel", wheel);
  };
}
