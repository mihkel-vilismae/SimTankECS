export function makeSlider(label, min, max, step, get, set) {
    const row = document.createElement("div");
    row.style.margin = "6px 0";
    const l = document.createElement("div"); l.textContent = label; l.style.fontSize="12px"; l.style.opacity="0.85";
    const s = document.createElement("input"); s.type = "range"; s.min = String(min); s.max = String(max); s.step = String(step);
    s.value = String(get());
    const v = document.createElement("span"); v.style.marginLeft = "8px"; v.textContent = s.value;
    s.oninput = () => { v.textContent = s.value; set(parseFloat(s.value)); };
    row.appendChild(l); row.appendChild(s); row.appendChild(v);
    return row;
}
