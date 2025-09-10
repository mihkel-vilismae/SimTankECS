/**
 * @param {{id?: string, title: string}} opts
 * @returns {{root:HTMLElement, header:HTMLElement, body:HTMLElement}}
 */
export function createPanel({ id, title }) {
    const root = document.createElement("div");
    if (id) root.id = id;
    root.className = "hud-panel";

    const header = document.createElement("div");
    header.className = "hud-title";
    header.textContent = title;

    const body = document.createElement("div");
    body.className = "hud-body";

    root.appendChild(header);
    root.appendChild(body);

    return { root, header, body };
}