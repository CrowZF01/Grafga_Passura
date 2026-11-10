// ============================================================
//  PASSURA: Elemental Arena — js/config.js
//  Canvas Setup, Viewport, Constants, Input Handling & Utilities
// ============================================================

// ─── Canvas & Viewport Setup ─────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BASE_W = 960;
const BASE_H = 540;
let scale = 1;

function resizeCanvas() {
    const sw = window.innerWidth / BASE_W;
    const sh = window.innerHeight / BASE_H;
    scale = Math.min(sw, sh);
    canvas.width = BASE_W;
    canvas.height = BASE_H;
    canvas.style.width = Math.floor(BASE_W * scale) + 'px';
    canvas.style.height = Math.floor(BASE_H * scale) + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ─── World & Tile Constants ──────────────────────────────────
const TILE = 40;
const MAP_COLS = 50; // 2000 px world width
const MAP_ROWS = 36; // 1440 px world height
const WORLD_W = MAP_COLS * TILE;
const WORLD_H = MAP_ROWS * TILE;

// ─── Game State ──────────────────────────────────────────────
let gameState = 'start'; // 'start' | 'playing' | 'paused' | 'dead'

// ─── Element Definitions (Keys 1, 2, 3, 4) ───────────────────
const ELEMENTS = {
    '1': { id: '1', name: 'Api', color: '#ff3838', darkColor: '#c0392b', glow: '#ff7675', icon: 'triangle', key: '1' },
    '2': { id: '2', name: 'Air', color: '#0984e3', darkColor: '#0c2461', glow: '#74b9ff', icon: 'drop', key: '2' },
    '3': { id: '3', name: 'Tanah', color: '#b7791f', darkColor: '#78350f', glow: '#d69e2e', icon: 'square', key: '3' },
    '4': { id: '4', name: 'Petir', color: '#9b59b6', darkColor: '#6c5ce7', glow: '#a29bfe', icon: 'bolt', key: '4' },
};

// ─── Input Handling ──────────────────────────────────────────
const keys = {};
const mouse = {
    screenX: BASE_W / 2,
    screenY: BASE_H / 2,
    x: BASE_W / 2,
    y: BASE_H / 2,
    leftPending: false,
    rightPending: false
};

window.addEventListener('keydown', e => {
    // Disable all keyboard input during 3-Card Upgrade selection (player must choose by clicking)
    if (gameState === 'upgrade') {
        e.preventDefault();
        return;
    }

    keys[e.code] = true;

    // Element selection strictly 1, 2, 3, 4
    const map = {
        Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4',
        Numpad1: '1', Numpad2: '2', Numpad3: '3', Numpad4: '4',
        '1': '1', '2': '2', '3': '3', '4': '4',
    };
    const elKey = map[e.code] || map[e.key];
    if (elKey && gameState === 'playing' && typeof player !== 'undefined') {
        if (typeof isElementUnlocked === 'function' && !isElementUnlocked(elKey)) {
            const reqWave = elKey === '2' ? 5 : elKey === '3' ? 10 : 15;
            if (typeof spawnFloat === 'function') {
                spawnFloat(player.x, player.y - player.bodyRadius - 15, `Elemen ${ELEMENTS[elKey].name} Terkunci (Wave ${reqWave})!`, '#a4b0be', 0.9);
            }
            if (typeof doShake === 'function') doShake(1.5, 0.05);
            e.preventDefault();
            return;
        }
        if (player.queue.length < 3) {
            player.queue.push(elKey);
            if (typeof spawnBurst === 'function') {
                spawnBurst(player.x, player.y - player.bodyRadius - 20, ELEMENTS[elKey].color, 5, 50, 3, 0.25);
            }
        }
        e.preventDefault();
    }
    if (e.code === 'Space' && (gameState === 'start' || gameState === 'dead') && typeof startGame === 'function') {
        startGame();
    }
    if (e.code === 'Escape') {
        if (gameState === 'playing') gameState = 'paused';
        else if (gameState === 'paused') gameState = 'playing';
    }
    if (e.code === 'Backspace' && gameState === 'playing' && typeof player !== 'undefined') {
        player.queue.pop();
        e.preventDefault();
    }
});

window.addEventListener('keyup', e => { keys[e.code] = false; });

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.screenX = (e.clientX - rect.left) / scale;
    mouse.screenY = (e.clientY - rect.top) / scale;
    if (typeof camera !== 'undefined') {
        mouse.x = mouse.screenX + camera.x;
        mouse.y = mouse.screenY + camera.y;
    }
    if (gameState === 'upgrade' && typeof getUpgradeCardAtPos === 'function') {
        hoveredUpgradeCard = getUpgradeCardAtPos(mouse.screenX, mouse.screenY);
        canvas.style.cursor = (hoveredUpgradeCard >= 0) ? 'pointer' : 'default';
    } else {
        canvas.style.cursor = 'crosshair';
    }
});

canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    if (e.button === 0) {
        // Check if click was on 3-Card Upgrade selection
        if (gameState === 'upgrade' && typeof getUpgradeCardAtPos === 'function' && typeof selectUpgradeCard === 'function') {
            const idx = getUpgradeCardAtPos(mouse.screenX, mouse.screenY);
            if (idx >= 0) {
                selectUpgradeCard(idx);
            }
            return;
        }

        // Check if click was on HUD hotbar buttons
        if (gameState === 'playing' && typeof player !== 'undefined') {
            const btnSize = 48, btnGap = 8;
            const elBarW = 4 * (btnSize + btnGap) - btnGap;
            const qBarW = 3 * (btnSize + btnGap) - btnGap;
            const barTotalW = elBarW + 20 + qBarW;
            const startBarX = (BASE_W - barTotalW) / 2;
            const barY = BASE_H - btnSize - 32;

            const mx = mouse.screenX;
            const my = mouse.screenY;

            // 1. Check element buttons (1-4)
            for (let i = 0; i < 4; i++) {
                const bx = startBarX + i * (btnSize + btnGap);
                const by = barY;
                if (mx >= bx && mx <= bx + btnSize && my >= by && my <= by + btnSize) {
                    const k = String(i + 1);
                    if (typeof isElementUnlocked === 'function' && !isElementUnlocked(k)) {
                        const reqWave = k === '2' ? 5 : k === '3' ? 10 : 15;
                        if (typeof spawnFloat === 'function') {
                            spawnFloat(player.x, player.y - player.bodyRadius - 15, `Elemen ${ELEMENTS[k].name} Terkunci (Wave ${reqWave})!`, '#a4b0be', 0.9);
                        }
                        if (typeof doShake === 'function') doShake(1.5, 0.05);
                    } else if (player.queue.length < 3) {
                        player.queue.push(k);
                        if (typeof spawnBurst === 'function') {
                            spawnBurst(player.x, player.y - player.bodyRadius - 20, ELEMENTS[k].color, 5, 50, 3, 0.25);
                        }
                    }
                    return; // Consumed by hotbar click
                }
            }

            // 2. Check queue slots (click to remove)
            const queueStartX = startBarX + elBarW + 26;
            for (let i = 0; i < 3; i++) {
                const qx = queueStartX + i * (btnSize + btnGap);
                const qy = barY;
                if (mx >= qx && mx <= qx + btnSize && my >= qy && my <= qy + btnSize) {
                    if (player.queue.length > i) {
                        player.queue.splice(i, 1);
                    }
                    return; // Consumed by queue click
                }
            }
        }

        mouse.leftPending = true;
    }
    if (e.button === 2) mouse.rightPending = true;
});

canvas.addEventListener('contextmenu', e => e.preventDefault());

// ─── Mathematical Utilities ──────────────────────────────────
function rng(a, b) { return a + Math.random() * (b - a); }
function rngI(a, b) { return Math.floor(rng(a, b + 1)); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }
function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

