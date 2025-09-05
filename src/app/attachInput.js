export function attachInput(world) {
  function down(e){ world.input.keys[e.code] = true; }
  function up(e){ world.input.keys[e.code] = false; }
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
  };
}
