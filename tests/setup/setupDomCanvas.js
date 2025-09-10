// tests/setup/setupDomCanvas.js
// Create #app canvas so createGame() can find it.
if (typeof document !== 'undefined') {
    if (!document.getElementById('app')) {
        const c = document.createElement('canvas');
        c.id = 'app';
        document.body.appendChild(c);
    }
}
