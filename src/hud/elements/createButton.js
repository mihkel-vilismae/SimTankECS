export function createButton(label, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.className = "hud-btn";
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        onClick?.();
    });
    return btn;
}

/** Create a selectable button with 'active' highlight */
export function createSelectableButton(label, {onClick, active = false} = {}) {
    const btn = createButton(label, onClick);
    if (active) btn.classList.add("active");
    return btn;
}