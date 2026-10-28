// ============================================================
//  PASSURA: Elemental Arena  —  game.js
//  Clean Flat-Cartoon Vector Style with Smooth Scrolling Camera
//  100% Procedural HTML5 Canvas Rendering
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

// ─── Camera System ───────────────────────────────────────────
const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    update(dt) {
        this.targetX = player.x - BASE_W / 2;
        this.targetY = player.y - BASE_H / 2;
        this.targetX = clamp(this.targetX, 0, WORLD_W - BASE_W);
        this.targetY = clamp(this.targetY, 0, WORLD_H - BASE_H);
        
        // Smooth lerp
        const lerpFactor = Math.min(1, dt * 9);
        this.x += (this.targetX - this.x) * lerpFactor;
        this.y += (this.targetY - this.y) * lerpFactor;
    }
};

// ─── Element Definitions (Keys 1, 2, 3, 4) ───────────────────
const ELEMENTS = {
    '1': { id: '1', name: 'Api', color: '#ff3838', darkColor: '#c0392b', glow: '#ff7675', icon: 'triangle', key: '1' },
    '2': { id: '2', name: 'Air', color: '#0984e3', darkColor: '#0c2461', glow: '#74b9ff', icon: 'drop', key: '2' },
    '3': { id: '3', name: 'Tanah', color: '#b7791f', darkColor: '#78350f', glow: '#d69e2e', icon: 'square', key: '3' },
    '4': { id: '4', name: 'Petir', color: '#9b59b6', darkColor: '#6c5ce7', glow: '#a29bfe', icon: 'bolt', key: '4' },
};

// ─── Spell Recipes ───────────────────────────────────────────
const RECIPES = {
    // ── Single Element ──
    '1': { name: 'Fireball', type: 'projectile', speed: 380, damage: 32, radius: 12, visual: 'fire', color: '#ff4757', glow: '#ffa502', hitRadius: 30, desc: 'Bola api meluncur dengan ekor bara' },
    '2': { name: 'Aqua Shot', type: 'projectile', speed: 430, damage: 22, radius: 10, visual: 'water', color: '#00a8ff', glow: '#4cd137', hitRadius: 24, knockback: 130, desc: 'Tembakan air berkecepatan tinggi' },
    '3': { name: 'Stone Spike', type: 'projectile', speed: 290, damage: 48, radius: 14, visual: 'stone', color: '#b7791f', glow: '#e1b12c', hitRadius: 28, pierce: true, desc: 'Paku batu berputar menembus musuh' },
    '4': { name: 'Spark', type: 'projectile', speed: 510, damage: 20, radius: 9, visual: 'spark', color: '#9b59b6', glow: '#e056fd', hitRadius: 22, chain: 2, desc: 'Percikan listrik cepat berantai' },

    // ── Two Elements ──
    '11': { name: 'Flame Burst', type: 'projectile', speed: 330, damage: 58, radius: 16, visual: 'flame_burst', color: '#ff3838', glow: '#ff9f43', hitRadius: 36, aoe: 65, desc: 'Gumpalan api meledak saat benturan' },
    '12': { name: 'Steam Blast', type: 'area', damage: 42, radius: 75, visual: 'steam', color: '#dfe6e9', glow: '#b2bec3', duration: 0.85, desc: 'Semprotan uap panas di sekitar penyihir' },
    '13': { name: 'Magma Ball', type: 'projectile', speed: 250, damage: 75, radius: 18, visual: 'magma', color: '#d63031', glow: '#ff7675', hitRadius: 40, burn: true, desc: 'Bola magma berlapis panas berpijar' },
    '14': { name: 'Thunder Fire', type: 'projectile', speed: 390, damage: 54, radius: 13, visual: 'thunder_fire', color: '#ff793f', glow: '#a29bfe', hitRadius: 30, chain: 3, desc: 'Api berbalut petir ungu yang menyambar' },
    '22': { name: 'Tidal Wave', type: 'area', damage: 38, radius: 105, visual: 'wave', color: '#0984e3', glow: '#74b9ff', duration: 0.55, knockback: 220, desc: 'Gelombang air besar yang menyapu musuh' },
    '23': { name: 'Mud Glob', type: 'projectile', speed: 270, damage: 42, radius: 15, visual: 'mud', color: '#6d4c41', glow: '#8d6e63', hitRadius: 32, slow: 0.35, desc: 'Gumpalan lumpur yang memperlambat jalan' },
    '24': { name: 'Shock Current', type: 'projectile', speed: 450, damage: 45, radius: 11, visual: 'shock_water', color: '#00d2d3', glow: '#9b59b6', hitRadius: 26, chain: 4, desc: 'Aliran air bermuatan listrik kejut' },
    '33': { name: 'Boulder Toss', type: 'projectile', speed: 210, damage: 95, radius: 20, visual: 'boulder', color: '#795548', glow: '#d7ccc8', hitRadius: 44, pierce: true, desc: 'Batu raksasa melindas semua yang menghadang' },
    '34': { name: 'Volt Spike', type: 'projectile', speed: 360, damage: 65, radius: 13, visual: 'volt_spike', color: '#a29bfe', glow: '#fdcb6e', hitRadius: 30, chain: 2, stun: 1.2, desc: 'Paku batu bermuatan petir melumpuhkan musuh' },
    '44': { name: 'Chain Lightning', type: 'area', damage: 60, radius: 140, visual: 'lightning', color: '#a29bfe', glow: '#6c5ce7', chain: 6, duration: 0.35, desc: 'Sambaran petir ungu bercabang ke banyak musuh' },

    // ── Three Elements ──
    '113': { name: 'Meteor Strike', type: 'projectile', speed: 230, damage: 140, radius: 24, visual: 'meteor', color: '#c0392b', glow: '#ff793f', hitRadius: 55, aoe: 90, burn: true, desc: 'Meteor magma raksasa dengan ledakan dahsyat' },
    '114': { name: 'Plasma Bolt', type: 'projectile', speed: 500, damage: 95, radius: 14, visual: 'plasma', color: '#ff3838', glow: '#e056fd', hitRadius: 34, chain: 5, desc: 'Kilatan plasma super cepat berdaya hancur tinggi' },
    '112': { name: 'Fire Storm', type: 'area', damage: 70, radius: 95, visual: 'fire_storm', color: '#ff4757', glow: '#ff9f43', duration: 1.25, burn: true, desc: 'Badai api pusaran membakar area sekitar' },
    '123': { name: 'Lava Splash', type: 'area', damage: 60, radius: 85, visual: 'lava', color: '#d63031', glow: '#e17055', duration: 0.95, burn: true, slow: 0.3, desc: 'Genangan lava membara yang membakar dan melekat' },
    '124': { name: 'Tempest', type: 'area', damage: 55, radius: 115, visual: 'tempest', color: '#74b9ff', glow: '#e056fd', duration: 1.05, knockback: 190, chain: 3, desc: 'Badai angin puyuh bercampur petir dahsyat' },
    '134': { name: 'Volcano Burst', type: 'area', damage: 85, radius: 80, visual: 'volcano', color: '#c0392b', glow: '#f39c12', duration: 0.75, aoe: 95, burn: true, desc: 'Erupsi tanah berapi melontarkan serpihan lahar' },
    '224': { name: 'Thunder Rain', type: 'area', damage: 50, radius: 125, visual: 'thunder_rain', color: '#0984e3', glow: '#a29bfe', duration: 1.15, chain: 5, knockback: 110, desc: 'Hujan badai petir yang membasahi dan menyengat' },
    '223': { name: 'Flash Flood', type: 'area', damage: 46, radius: 105, visual: 'flood', color: '#00cec9', glow: '#0984e3', duration: 0.85, knockback: 260, slow: 0.45, desc: 'Banjir bandang menyapu musuh menjauh' },
    '234': { name: 'Storm Spike', type: 'projectile', speed: 320, damage: 80, radius: 15, visual: 'storm_spike', color: '#2d3436', glow: '#a29bfe', hitRadius: 36, pierce: true, chain: 3, desc: 'Paku badai berputar yang menembus dan menyengat' },
    '334': { name: 'Golem Fist', type: 'projectile', speed: 190, damage: 160, radius: 24, visual: 'golem_fist', color: '#576574', glow: '#feca57', hitRadius: 56, pierce: true, stun: 2.0, desc: 'Tinju batu golem perkasa yang meremukkan lawan' },
    '133': { name: 'Inferno Rock', type: 'projectile', speed: 205, damage: 125, radius: 22, visual: 'inferno_rock', color: '#b71540', glow: '#ff793f', hitRadius: 48, burn: true, aoe: 75, desc: 'Batu pijar membara dengan jejak api panas' },
    '233': { name: 'Mudslide', type: 'area', damage: 65, radius: 100, visual: 'mudslide', color: '#4b2810', glow: '#8d6e63', duration: 1.05, slow: 0.65, knockback: 160, desc: 'Longsoran tanah dan lumpur tebal yang meredam laju' },
    '344': { name: 'Thunder Clap', type: 'area', damage: 75, radius: 90, visual: 'thunder_clap', color: '#8e44ad', glow: '#f1c40f', duration: 0.45, chain: 6, stun: 0.9, desc: 'Hentakan tanah berpetir yang mengguncang telinga' },
    '144': { name: 'Arc Flash', type: 'area', damage: 68, radius: 100, visual: 'arc_flash', color: '#ff4757', glow: '#a29bfe', duration: 0.55, chain: 7, burn: true, desc: 'Kilatan busur api listrik tegangan tinggi' },
    '244': { name: 'Electric Storm', type: 'area', damage: 60, radius: 120, visual: 'electric_storm', color: '#0984e3', glow: '#e056fd', duration: 0.95, chain: 8, knockback: 100, desc: 'Badai elektromagnetik yang menyengat seluruh penjuru' },
    '111': { name: 'Sun Flare', type: 'area', damage: 110, radius: 95, visual: 'sun_flare', color: '#fed330', glow: '#fa8231', duration: 0.65, burn: true, aoe: 105, desc: 'Sinar surya menyilaukan yang membakar segalanya' },
    '222': { name: 'Ocean Surge', type: 'area', damage: 65, radius: 145, visual: 'ocean_surge', color: '#0984e3', glow: '#00d2d3', duration: 1.35, knockback: 320, desc: 'Pusaran ombak samudra purba yang membahana' },
    '333': { name: 'Earthquake', type: 'area', damage: 95, radius: 135, visual: 'earthquake', color: '#3d1f05', glow: '#d69e2e', duration: 1.55, slow: 0.75, stun: 1.6, desc: 'Retakan gempa tanah yang menelan musuh' },
    '444': { name: 'Thunderstorm', type: 'area', damage: 85, radius: 155, visual: 'thunderstorm', color: '#6c5ce7', glow: '#fd79a8', duration: 1.1, chain: 10, desc: 'Puncak murka petir langit yang menyambar tiada henti' },
};

function getSpell(queue) {
    if (!queue.length) return null;
    const key = [...queue].sort().join('');
    return RECIPES[key] || RECIPES[queue[0]] || null;
}

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
    keys[e.code] = true;
    
    // Element selection strictly 1, 2, 3, 4
    const map = {
        Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4',
        Numpad1: '1', Numpad2: '2', Numpad3: '3', Numpad4: '4',
        '1': '1', '2': '2', '3': '3', '4': '4',
    };
    const elKey = map[e.code] || map[e.key];
    if (elKey && gameState === 'playing') {
        if (player.queue.length < 3) {
            player.queue.push(elKey);
            // Little audio or visual feedback
            spawnBurst(player.x, player.y - player.bodyRadius - 20, ELEMENTS[elKey].color, 5, 50, 3, 0.25);
        }
        e.preventDefault();
    }
    if (e.code === 'Space' && gameState !== 'playing') startGame();
    if (e.code === 'Escape') {
        if (gameState === 'playing') gameState = 'paused';
        else if (gameState === 'paused') gameState = 'playing';
    }
    if (e.code === 'Backspace' && gameState === 'playing') {
        player.queue.pop();
        e.preventDefault();
    }
});

window.addEventListener('keyup', e => { keys[e.code] = false; });

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.screenX = (e.clientX - rect.left) / scale;
    mouse.screenY = (e.clientY - rect.top) / scale;
    mouse.x = mouse.screenX + camera.x;
    mouse.y = mouse.screenY + camera.y;
});

canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    if (e.button === 0) mouse.leftPending = true;
    if (e.button === 2) mouse.rightPending = true;
});

canvas.addEventListener('contextmenu', e => e.preventDefault());

// ─── Utilities ───────────────────────────────────────────────
function rng(a, b) { return a + Math.random() * (b - a); }
function rngI(a, b) { return Math.floor(rng(a, b + 1)); }
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

// ─── Screen Shake ────────────────────────────────────────────
const shake = { x: 0, y: 0, dur: 0, max: 0, t: 0 };
function doShake(intensity, duration) {
    shake.max = intensity;
    shake.dur = duration;
    shake.t = duration;
}
function updateShake(dt) {
    if (shake.dur <= 0) { shake.x = shake.y = 0; return; }
    shake.dur -= dt;
    const t = shake.dur / shake.t;
    shake.x = rng(-shake.max, shake.max) * t;
    shake.y = rng(-shake.max, shake.max) * t;
}

// ─── Particles System ────────────────────────────────────────
const particles = [];
function spawnParticle(x, y, vx, vy, color, life, radius, gravity = 0, fade = true, shape = 'circle') {
    particles.push({ x, y, vx, vy, color, life, maxLife: life, radius, gravity, fade, shape });
}
function spawnBurst(x, y, color, count, speed, radius, life, shape = 'circle') {
    for (let i = 0; i < count; i++) {
        const a = rng(0, Math.PI * 2);
        const s = rng(speed * 0.3, speed);
        spawnParticle(x, y, Math.cos(a) * s, Math.sin(a) * s, color, life, rng(radius * 0.4, radius), 0, true, shape);
    }
}
function spawnFire(x, y, count, color = '#ff4757') {
    for (let i = 0; i < count; i++) {
        const a = rng(-Math.PI * 0.8, -Math.PI * 0.2);
        spawnParticle(x + rng(-6, 6), y + rng(-4, 4),
            Math.cos(a) * rng(20, 70), Math.sin(a) * rng(30, 90),
            color, rng(0.2, 0.45), rng(3, 7), -40, true);
    }
}
function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.gravity * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
    }
}
function drawParticles() {
    for (const p of particles) {
        const alpha = p.fade ? clamp(p.life / p.maxLife, 0, 1) : 1;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        
        if (p.shape === 'square') {
            ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;
}

// ─── Floating Damage Text ────────────────────────────────────
const floats = [];
function spawnFloat(x, y, text, color = '#ff4757', scalePop = 1.0) {
    floats.push({ x, y: y - 10, text, color, life: 1.0, maxLife: 1.0, vy: -55, scalePop });
}
function updateFloats(dt) {
    for (let i = floats.length - 1; i >= 0; i--) {
        const f = floats[i];
        f.y += f.vy * dt;
        f.vy *= 0.91;
        f.life -= dt;
        if (f.life <= 0) floats.splice(i, 1);
    }
}
function drawFloats() {
    for (const f of floats) {
        const alpha = Math.min(1, f.life * 2);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '900 18px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        
        // Clean cartoon drop-shadow / border
        ctx.strokeStyle = '#1e2022';
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.strokeText(f.text, f.x, f.y);
        
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
    }
}

// ─── Lightning Arcs ──────────────────────────────────────────
const lightningFlashes = [];
function drawLightning(x1, y1, x2, y2, color, width = 3, segments = 8, spread = 20) {
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const mx = x1 + (x2 - x1) * t;
        const my = y1 + (y2 - y1) * t;
        const dx = -(y2 - y1) / (Math.hypot(x2 - x1, y2 - y1) || 1);
        const dy = (x2 - x1) / (Math.hypot(x2 - x1, y2 - y1) || 1);
        const off = rng(-spread, spread);
        pts.push({ x: mx + dx * off, y: my + dy * off });
    }
    pts.push({ x: x2, y: y2 });

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Outer electric glow
    ctx.strokeStyle = color;
    ctx.lineWidth = width + 3;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.stroke();

    // Inner bright core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = width * 0.7;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.stroke();

    ctx.restore();
}
function updateLightningFlashes(dt) {
    for (let i = lightningFlashes.length - 1; i >= 0; i--) {
        lightningFlashes[i].life -= dt;
        if (lightningFlashes[i].life <= 0) lightningFlashes.splice(i, 1);
    }
}
function drawLightningFlashes() {
    for (const lf of lightningFlashes) {
        const alpha = lf.life / lf.maxLife;
        ctx.globalAlpha = alpha;
        drawLightning(lf.x1, lf.y1, lf.x2, lf.y2, lf.color, 3.5, 10, 18);
        ctx.globalAlpha = 1;
    }
}

// ─── Large Dungeon Map Generation ────────────────────────────
// 0 = Floor, 1 = Solid Stone Wall, 2 = Decorative Pillar
const MAP = [];
let miniMapCanvas = null;

function updateMiniMapCache() {
    miniMapCanvas = document.createElement('canvas');
    miniMapCanvas.width = 148;
    miniMapCanvas.height = 106;
    const mctx = miniMapCanvas.getContext('2d');
    
    // Background of minimap
    mctx.fillStyle = '#141822';
    mctx.fillRect(0, 0, 148, 106);

    const tw = 148 / MAP_COLS;
    const th = 106 / MAP_ROWS;

    // Draw stone walls in sleek slate color
    mctx.fillStyle = '#424c5e';
    for (let r = 0; r < MAP_ROWS; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
            if (MAP[r][c] === 1) {
                mctx.fillRect(c * tw, r * th, Math.ceil(tw), Math.ceil(th));
            }
        }
    }
}

function generateMap() {
    MAP.length = 0;
    for (let r = 0; r < MAP_ROWS; r++) {
        MAP[r] = [];
        for (let c = 0; c < MAP_COLS; c++) {
            // Perimeter border walls
            if (r === 0 || r === MAP_ROWS - 1 || c === 0 || c === MAP_COLS - 1) {
                MAP[r][c] = 1;
            } else {
                MAP[r][c] = 0;
            }
        }
    }

    // Add perimeter alcoves and entrances (like in the picture)
    for (let c = 12; c < MAP_COLS - 12; c += 14) {
        MAP[1][c] = 1;
        MAP[MAP_ROWS - 2][c] = 1;
    }
    for (let r = 8; r < MAP_ROWS - 8; r += 10) {
        MAP[r][1] = 1;
        MAP[r][MAP_COLS - 2] = 1;
    }

    // Add architectural stone pillars across the large dungeon
    const spacingX = 8, spacingY = 7;
    for (let r = 4; r < MAP_ROWS - 4; r += spacingY) {
        for (let c = 5; c < MAP_COLS - 5; c += spacingX) {
            // Keep central arena open
            const distFromCenter = Math.hypot(c - MAP_COLS / 2, r - MAP_ROWS / 2);
            if (distFromCenter > 4) {
                MAP[r][c] = 1;
                // Some pillars 2-tiles wide or tall
                if ((r + c) % 3 === 0) MAP[r][c + 1] = 1;
                else if ((r + c) % 5 === 0) MAP[r + 1][c] = 1;
            }
        }
    }

    // Update the cached minimap graphic
    updateMiniMapCache();
}

function isWall(x, y) {
    const c = Math.floor(x / TILE);
    const r = Math.floor(y / TILE);
    if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true;
    return MAP[r] && MAP[r][c] === 1;
}

function isWallBox(x, y, radius = 14) {
    const m = radius;
    return isWall(x - m, y - m) || isWall(x + m, y - m) ||
           isWall(x - m, y + m) || isWall(x + m, y + m) ||
           isWall(x, y - m) || isWall(x, y + m) ||
           isWall(x - m, y) || isWall(x + m, y);
}

function wallSlide(obj, nx, ny, radius = 14) {
    const m = radius;
    // 1. Direct move
    if (!isWallBox(nx, ny, m)) {
        obj.x = nx; obj.y = ny; return true;
    }
    // 2. Slide X only
    if (!isWallBox(nx, obj.y, m)) {
        obj.x = nx; return true;
    }
    // 3. Slide Y only
    if (!isWallBox(obj.x, ny, m)) {
        obj.y = ny; return true;
    }
    // 4. Corner nudges: if caught on a convex corner, nudge along open tangent
    const step = 4;
    if (!isWallBox(obj.x + step, obj.y, m)) { obj.x += step; return true; }
    if (!isWallBox(obj.x - step, obj.y, m)) { obj.x -= step; return true; }
    if (!isWallBox(obj.x, obj.y + step, m)) { obj.y += step; return true; }
    if (!isWallBox(obj.x, obj.y - step, m)) { obj.y -= step; return true; }
    return false;
}

function drawMap() {
    // Frustum Culling based on camera
    const startCol = Math.max(0, Math.floor(camera.x / TILE) - 1);
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((camera.x + BASE_W) / TILE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE) - 1);
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camera.y + BASE_H) / TILE) + 1);

    for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
            const x = c * TILE;
            const y = r * TILE;

            if (MAP[r][c] === 1) {
                // ── Slate Stone Wall (Clean 2.5D Cartoon Style) ──
                // Wall base body
                ctx.fillStyle = '#39414e';
                ctx.fillRect(x, y, TILE, TILE);

                // Top block highlight (bevel)
                ctx.fillStyle = '#4f596b';
                ctx.fillRect(x + 2, y + 2, TILE - 4, 8);

                // Wall inner shadow bottom & right
                ctx.fillStyle = '#262c36';
                ctx.fillRect(x + 2, y + TILE - 5, TILE - 4, 3);
                ctx.fillRect(x + TILE - 5, y + 2, 3, TILE - 4);

                // Outer crisp black cartoon border
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);

            } else {
                // ── Dark Grid Floor Tiles (Identical to reference screenshot) ──
                ctx.fillStyle = '#181b22';
                ctx.fillRect(x, y, TILE, TILE);

                // Tile grid border
                ctx.strokeStyle = '#252934';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(x, y, TILE, TILE);

                // Subtle floor detail (subtle dot or brick pattern on some tiles)
                if ((r * 7 + c * 13) % 19 === 0) {
                    ctx.fillStyle = '#212530';
                    ctx.fillRect(x + 8, y + 8, 4, 4);
                }
            }
        }
    }
}

// ─── Player Entity (Red Hooded Mage) ─────────────────────────
const player = {
    x: WORLD_W / 2,
    y: WORLD_H / 2,
    angle: 0,
    speed: 195,
    hp: 100,
    maxHp: 100,
    mana: 100,
    maxMana: 100,
    manaRegen: 10,
    queue: [],
    castCooldown: 0,
    castCooldownMax: 0.38,
    invincible: 0,
    bodyRadius: 15,
    walkPhase: 0,
    isMoving: false,
};

function drawPlayer() {
    const p = player;
    ctx.save();
    ctx.translate(p.x, p.y);

    // Subtle drop shadow under character
    ctx.save();
    ctx.scale(1, 0.45);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(0, p.bodyRadius + 8, p.bodyRadius * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.rotate(p.angle);

    const bob = p.isMoving ? Math.sin(p.walkPhase) * 2 : 0;
    const bodyColor = p.invincible > 0 && Math.floor(Date.now() / 80) % 2 === 0 ? '#ffffff' : '#e74c3c';
    const darkBodyColor = '#c0392b';

    // ── Staff & Wand (Drawn on Right Hand) ──
    ctx.save();
    ctx.strokeStyle = '#8d5524';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(8, 6 + bob);
    ctx.lineTo(24, 4 + bob);
    ctx.stroke();

    // Wand glowing golden orb tip
    const activeOrbColor = p.queue.length ? ELEMENTS[p.queue[p.queue.length - 1]].color : '#f1c40f';
    ctx.fillStyle = activeOrbColor;
    ctx.beginPath();
    ctx.arc(26, 4 + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle orb glow aura
    ctx.fillStyle = activeOrbColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(26, 4 + bob, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── Hands (Small cute mittens) ──
    ctx.fillStyle = '#ffb8b8';
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2;
    // Right hand
    ctx.beginPath();
    ctx.arc(9, 6 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Left hand
    ctx.beginPath();
    ctx.arc(9, -6 + bob, 3.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // ── Cloak / Body ──
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.ellipse(-2, bob, p.bodyRadius * 0.95, p.bodyRadius * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ── Hooded Head & Peak (Iconic Red Mage Look) ──
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    // Hood head circle
    ctx.arc(0, bob, p.bodyRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hood peak tip facing backwards
    ctx.beginPath();
    ctx.moveTo(-p.bodyRadius * 0.6, -p.bodyRadius * 0.5 + bob);
    ctx.lineTo(-p.bodyRadius * 1.35, bob);
    ctx.lineTo(-p.bodyRadius * 0.6, p.bodyRadius * 0.5 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // ── Dark Face Void inside Hood ──
    ctx.fillStyle = '#1c1417';
    ctx.beginPath();
    ctx.arc(3, bob, p.bodyRadius * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // ── Glowing Yellow Eyes ──
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(5, -3 + bob, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, 3 + bob, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // ── Floating Elements Queue Above Player (Identical to Image!) ──
    if (player.queue.length > 0) {
        drawQueueAbovePlayer();
    }
}

function drawQueueAbovePlayer() {
    const p = player;
    const total = p.queue.length;
    const gap = 30;
    const sz = 24;
    const startX = p.x - ((total - 1) * gap) / 2;
    const baseY = p.y - p.bodyRadius - 44;

    for (let i = 0; i < total; i++) {
        const el = ELEMENTS[p.queue[i]];
        const x = startX + i * gap;
        const bob = Math.sin(Date.now() * 0.005 + i * 1.5) * 3;
        const y = baseY + bob;

        // Circular background badge with clean border
        ctx.save();
        ctx.fillStyle = el.color;
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, sz / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Icon inside badge
        drawElementIcon(x, y, 7, el, 1.0, '#ffffff');

        // Key label pill underneath: [1], [2], etc.
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 10px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 3;
        ctx.strokeText(`[${el.key}]`, x, y + sz / 2 + 12);
        ctx.fillText(`[${el.key}]`, x, y + sz / 2 + 12);

        ctx.restore();
    }
}

function drawElementIcon(x, y, r, el, alpha = 1, iconColor = null) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = iconColor || el.color;
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2;

    if (el.icon === 'triangle') {
        // Fire Triangle
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r * 0.9, y + r * 0.75);
        ctx.lineTo(x - r * 0.9, y + r * 0.75);
        ctx.closePath();
        ctx.fill();
        if (!iconColor) ctx.stroke();
    } else if (el.icon === 'drop' || el.icon === 'circle') {
        // Water Drop
        ctx.beginPath();
        ctx.arc(x, y + r * 0.15, r * 0.8, 0, Math.PI);
        ctx.lineTo(x, y - r * 1.05);
        ctx.closePath();
        ctx.fill();
        if (!iconColor) ctx.stroke();
    } else if (el.icon === 'square') {
        // Earth Square
        ctx.beginPath();
        ctx.roundRect(x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6, 2.5);
        ctx.fill();
        if (!iconColor) ctx.stroke();
    } else if (el.icon === 'bolt') {
        // Lightning Bolt
        ctx.beginPath();
        ctx.moveTo(x + r * 0.35, y - r);
        ctx.lineTo(x - r * 0.25, y - r * 0.05);
        ctx.lineTo(x + r * 0.35, y - r * 0.05);
        ctx.lineTo(x - r * 0.35, y + r);
        ctx.lineTo(x + r * 0.15, y + r * 0.1);
        ctx.lineTo(x - r * 0.25, y + r * 0.1);
        ctx.closePath();
        ctx.fill();
        if (!iconColor) ctx.stroke();
    }
    ctx.restore();
}

// ─── Enemies (Clean Flat Cartoon Style) ──────────────────────
const enemies = [];
let enemyIdCounter = 0;

const ENEMY_TYPES = {
    goblin: {
        name: 'Goblin', hp: 65, speed: 85, damage: 9, radius: 14,
        color: '#6bb343', darkColor: '#4d8a2f',
        xpValue: 5, drawFn: drawGoblin
    },
    skeleton: {
        name: 'Skeleton', hp: 50, speed: 105, damage: 7, radius: 13,
        color: '#e4e7eb', darkColor: '#2c3e50',
        xpValue: 4, drawFn: drawSkeleton
    },
    golem: {
        name: 'Golem', hp: 220, speed: 50, damage: 22, radius: 22,
        color: '#576574', darkColor: '#222f3e',
        xpValue: 20, drawFn: drawGolem
    },
    wizard: {
        name: 'Wizard', hp: 85, speed: 60, damage: 12, radius: 14,
        color: '#8e44ad', darkColor: '#5b2c6f',
        xpValue: 15, drawFn: drawWizardEnemy, ranged: true, shootCd: 0, shootRate: 2.3
    },
    wraith: {
        name: 'Wraith', hp: 60, speed: 125, damage: 13, radius: 12,
        color: '#9b59b6', darkColor: '#4a235a',
        xpValue: 10, drawFn: drawWraith, phaseTimer: 0
    },
};

function spawnEnemy(type, x, y) {
    const t = ENEMY_TYPES[type];
    const e = {
        id: enemyIdCounter++,
        type, ...t,
        x, y,
        hp: t.hp, maxHp: t.hp,
        angle: 0,
        vx: 0, vy: 0,
        walkPhase: rng(0, Math.PI * 2),
        flashTimer: 0,
        stunTimer: 0,
        slowTimer: 0, slowFactor: 1,
        burnTimer: 0,
        shootCd: t.shootCd || 0,
        phaseTimer: t.phaseTimer || 0,
        dead: false,
        // Anti-stuck & navigation system
        lastX: x,
        lastY: y,
        stuckTimer: 0,
        steerTimer: 0,
        steerAngle: 0,
    };
    enemies.push(e);
    return e;
}

// ── Goblin: Cute chubby green goblin with loincloth (matches reference) ──
function drawGoblin(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Drop shadow
    ctx.save();
    ctx.scale(1, 0.45);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(0, e.radius + 6, e.radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const skinColor = isHit ? '#ffffff' : e.color;
    const pantsColor = isHit ? '#ffffff' : '#6d4c41';
    const legSwing = Math.sin(e.walkPhase) * 6;
    const armSwing = Math.sin(e.walkPhase + Math.PI) * 7;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Legs
    ctx.fillStyle = skinColor;
    // Left leg
    ctx.beginPath();
    ctx.roundRect(-7, e.radius * 0.3 + legSwing, 5, 8, 2);
    ctx.fill(); ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.roundRect(2, e.radius * 0.3 - legSwing, 5, 8, 2);
    ctx.fill(); ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.9, -e.radius * 0.4 + armSwing, 4, 8, 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(e.radius * 0.6, -e.radius * 0.4 - armSwing, 4, 8, 2);
    ctx.fill(); ctx.stroke();

    // Torso / Body
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.radius * 0.7, e.radius * 0.65, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Brown Loincloth / Shorts
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.6, e.radius * 0.1, e.radius * 1.2, e.radius * 0.55, 3);
    ctx.fill(); ctx.stroke();

    // Ears (Pointed goblin ears)
    ctx.fillStyle = skinColor;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-e.radius * 0.6, -e.radius * 0.6);
    ctx.lineTo(-e.radius * 1.3, -e.radius * 1.0);
    ctx.lineTo(-e.radius * 0.4, -e.radius * 0.9);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(e.radius * 0.6, -e.radius * 0.6);
    ctx.lineTo(e.radius * 1.3, -e.radius * 1.0);
    ctx.lineTo(e.radius * 0.4, -e.radius * 0.9);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Round Goblin Head
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(0, -e.radius * 0.65, e.radius * 0.75, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Eyes (Big cute cartoon black dots with white twinkle)
    if (!isHit) {
        ctx.fillStyle = '#181b22';
        ctx.beginPath();
        ctx.arc(3.5, -e.radius * 0.65, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-3.5, -e.radius * 0.65, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye twinkle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(4, -e.radius * 0.65 - 1, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-3, -e.radius * 0.65 - 1, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ── Skeleton: Cute pale grey stick-cartoon skeleton (matches reference) ──
function drawSkeleton(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Drop shadow
    ctx.save();
    ctx.scale(1, 0.4);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.arc(0, e.radius + 6, e.radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const boneColor = isHit ? '#ffffff' : e.color;
    const legSwing = Math.sin(e.walkPhase) * 7;
    const armSwing = Math.sin(e.walkPhase + Math.PI) * 8;

    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Skeleton Legs
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.roundRect(-6, e.radius * 0.2 + legSwing, 4, 10, 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(2, e.radius * 0.2 - legSwing, 4, 10, 2);
    ctx.fill(); ctx.stroke();

    // Skeleton Arms
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.9, -e.radius * 0.3 + armSwing, 3.5, 9, 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(e.radius * 0.6, -e.radius * 0.3 - armSwing, 3.5, 9, 2);
    ctx.fill(); ctx.stroke();

    // Ribcage / Spine Body
    ctx.fillStyle = boneColor;
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.45, -e.radius * 0.2, e.radius * 0.9, e.radius * 0.7, 3);
    ctx.fill(); ctx.stroke();

    // Skull Head
    ctx.beginPath();
    ctx.arc(0, -e.radius * 0.7, e.radius * 0.7, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Hollow Eye Sockets
    if (!isHit) {
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(3.5, -e.radius * 0.7, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-3.5, -e.radius * 0.7, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ── Golem: Chunky faceted rock monster with glowing runes ──
function drawGolem(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const stoneColor = isHit ? '#ffffff' : e.color;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.8;

    // Rock body
    ctx.fillStyle = stoneColor;
    ctx.beginPath();
    const pts = 8;
    for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const rad = e.radius * (0.85 + 0.15 * Math.sin(i * 3 + e.walkPhase * 0.5));
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Core / Rune Eyes
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(5, -4, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ── Wizard Enemy: Purple cultist with tall pointy hat ──
function drawWizardEnemy(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const robeColor = isHit ? '#ffffff' : e.color;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.4;

    // Robe body
    ctx.fillStyle = robeColor;
    ctx.beginPath();
    ctx.arc(0, 0, e.radius * 0.8, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Tall Pointed Hat
    ctx.fillStyle = isHit ? '#ffffff' : e.darkColor;
    ctx.beginPath();
    ctx.moveTo(-e.radius * 0.8, -e.radius * 0.4);
    ctx.lineTo(-e.radius * 1.8, 0);
    ctx.lineTo(-e.radius * 0.8, e.radius * 0.4);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Staff
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(4, 6);
    ctx.lineTo(20, 6);
    ctx.stroke();
    ctx.fillStyle = '#a29bfe';
    ctx.beginPath();
    ctx.arc(22, 6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ── Wraith: Translucent floating ghost with glowing eyes ──
function drawWraith(e) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const ghostColor = isHit ? '#ffffff' : e.color;
    const bob = Math.sin(e.phaseTimer * 4) * 3;

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = ghostColor;
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.2;

    // Wavy ghost tail
    ctx.beginPath();
    ctx.arc(0, 0, e.radius, Math.PI * 0.5, Math.PI * 1.5, true);
    ctx.lineTo(-e.radius * 1.4 + bob, -e.radius * 0.5);
    ctx.lineTo(-e.radius * 1.8 + bob, 0);
    ctx.lineTo(-e.radius * 1.4 + bob, e.radius * 0.5);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Red ghost eyes
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(4, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ─── Enemy Projectiles ───────────────────────────────────────
const enemyProjectiles = [];
function spawnEnemyProjectile(x, y, angle, speed, damage, color) {
    enemyProjectiles.push({ x, y, angle, speed, damage, color, radius: 7, life: 3.5 });
}
function updateEnemyProjectiles(dt) {
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const p = enemyProjectiles[i];
        p.x += Math.cos(p.angle) * p.speed * dt;
        p.y += Math.sin(p.angle) * p.speed * dt;
        p.life -= dt;
        if (p.life <= 0 || isWall(p.x, p.y)) {
            spawnBurst(p.x, p.y, p.color, 6, 60, 3, 0.3);
            enemyProjectiles.splice(i, 1);
            continue;
        }
        if (dist(p, player) < player.bodyRadius + p.radius && player.invincible <= 0) {
            damagePlayer(p.damage);
            spawnBurst(p.x, p.y, p.color, 8, 90, 4, 0.4);
            enemyProjectiles.splice(i, 1);
        }
    }
}
function drawEnemyProjectiles() {
    for (const p of enemyProjectiles) {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ─── Player Spells (Radically Overhauled Visuals) ─────────────
const spells = [];

function castSpell(type) {
    if (!player.queue.length) return;
    const spell = getSpell(player.queue);
    if (!spell) { player.queue = []; return; }

    const manaCost = 10 + player.queue.length * 6;
    if (player.mana < manaCost) {
        spawnFloat(player.x, player.y - 30, 'Mana Kurang!', '#3498db');
        return;
    }
    player.mana -= manaCost;

    if (type === 'left' && spell.type === 'projectile') {
        launchProjectile(spell);
    } else {
        triggerArea(spell);
    }

    player.queue = [];
    player.castCooldown = player.castCooldownMax;
}

function launchProjectile(spell) {
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const ox = Math.cos(angle) * (player.bodyRadius + spell.radius + 4);
    const oy = Math.sin(angle) * (player.bodyRadius + spell.radius + 4);

    spells.push({
        kind: 'projectile',
        x: player.x + ox,
        y: player.y + oy,
        angle,
        speed: spell.speed,
        damage: spell.damage,
        radius: spell.radius,
        hitRadius: spell.hitRadius || spell.radius * 2,
        visual: spell.visual,
        color: spell.color,
        glow: spell.glow,
        pierce: spell.pierce || false,
        chain: spell.chain || 0,
        chainCount: spell.chain || 0,
        aoe: spell.aoe || 0,
        burn: spell.burn || false,
        slow: spell.slow || 0,
        stun: spell.stun || 0,
        knockback: spell.knockback || 0,
        name: spell.name,
        life: 4.5,
        hit: new Set(),
        trail: [],
        animTime: 0,
    });

    doShake(2.5, 0.08);
    spawnBurst(player.x + ox, player.y + oy, spell.glow, 8, 110, 4, 0.35);
}

function triggerArea(spell) {
    spells.push({
        kind: 'area',
        x: player.x,
        y: player.y,
        damage: spell.damage,
        radius: 0,
        maxRadius: spell.radius,
        visual: spell.visual,
        color: spell.color,
        glow: spell.glow,
        duration: spell.duration || 0.6,
        maxDuration: spell.duration || 0.6,
        chain: spell.chain || 0,
        chainCount: spell.chain || 0,
        burn: spell.burn || false,
        slow: spell.slow || 0,
        stun: spell.stun || 0,
        knockback: spell.knockback || 0,
        aoe: spell.aoe || 0,
        hit: new Set(),
        name: spell.name,
        animTime: 0,
    });

    doShake(4.5, 0.2);
    spawnBurst(player.x, player.y, spell.color, 24, 200, 7, 0.65);
}

function updateSpells(dt) {
    for (let i = spells.length - 1; i >= 0; i--) {
        const s = spells[i];
        s.animTime += dt;

        if (s.kind === 'projectile') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 10) s.trail.shift();

            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            // Wall collision
            if (isWall(s.x, s.y)) {
                explodeSpell(s);
                spells.splice(i, 1);
                continue;
            }

            // Hit enemies
            let hitAny = false;
            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.hitRadius * 0.5) {
                    applySpellHit(s, e);
                    s.hit.add(e.id);
                    if (!s.pierce) { hitAny = true; break; }
                }
            }

            if (hitAny && !s.pierce) {
                explodeSpell(s);
                spells.splice(i, 1);
                continue;
            }

            if (s.life <= 0) { spells.splice(i, 1); continue; }

            // Dynamic trails per spell type
            if (s.visual === 'magma' || s.visual === 'meteor') {
                if (Math.random() < 0.6) {
                    spawnParticle(s.x + rng(-4, 4), s.y + rng(-4, 4), rng(-25, 25), rng(-25, 25), '#ff4757', 0.3, rng(3, 7));
                }
            } else if (s.visual === 'water' || s.visual === 'shock_water') {
                if (Math.random() < 0.5) {
                    spawnParticle(s.x, s.y, rng(-20, 20), rng(-20, 20), '#74b9ff', 0.25, rng(2, 5));
                }
            } else if (s.visual === 'stone' || s.visual === 'boulder') {
                if (Math.random() < 0.4) {
                    spawnParticle(s.x, s.y, rng(-15, 15), rng(-15, 15), '#b7791f', 0.2, rng(2, 4), 0, true, 'square');
                }
            } else if (s.visual === 'spark' || s.visual === 'plasma') {
                if (Math.random() < 0.5) {
                    lightningFlashes.push({
                        x1: s.x, y1: s.y,
                        x2: s.x + rng(-20, 20), y2: s.y + rng(-20, 20),
                        color: s.glow, life: 0.08, maxLife: 0.08
                    });
                }
            }

        } else if (s.kind === 'area') {
            s.duration -= dt;
            const progress = 1 - (s.duration / s.maxDuration);
            s.radius = s.maxRadius * Math.sin(progress * Math.PI * 0.5);

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.radius + e.radius) {
                    applySpellHit(s, e);
                    s.hit.add(e.id);
                }
            }

            // Lightning chain pulse in area
            if (s.chain > 0 && s.chainCount > 0 && Math.random() < 0.35) {
                doChainLightning(s.x, s.y, s.radius * 1.3, s.chain, s.damage * 0.4, s.glow, new Set());
            }

            if (s.duration <= 0) { spells.splice(i, 1); continue; }
        }
    }
}

function explodeSpell(s) {
    spawnBurst(s.x, s.y, s.color, 14, 130, s.radius * 0.7, 0.45);
    spawnBurst(s.x, s.y, s.glow, 8, 90, s.radius * 0.5, 0.3);
    doShake(3.5, 0.14);

    if (s.aoe > 0) {
        for (const e of enemies) {
            if (e.dead) continue;
            if (dist(s, e) < s.aoe + e.radius) {
                applySpellHit(s, e);
            }
        }
        spells.push({
            kind: 'area', x: s.x, y: s.y,
            damage: 0, radius: 0, maxRadius: s.aoe,
            color: s.color, glow: s.glow, visual: 'explosion_ring',
            duration: 0.35, maxDuration: 0.35,
            chain: 0, burn: false, slow: 0, stun: 0, knockback: 0, aoe: 0,
            hit: new Set(), name: 'explosion', animTime: 0
        });
    }

    if (s.chain > 0) {
        doChainLightning(s.x, s.y, 130, s.chainCount, s.damage * 0.55, s.glow, new Set([...s.hit]));
    }
}

function doChainLightning(x, y, range, chains, damage, color, alreadyHit) {
    if (chains <= 0) return;
    let nearest = null, nd = Infinity;
    for (const e of enemies) {
        if (e.dead || alreadyHit.has(e.id)) continue;
        const d = Math.hypot(e.x - x, e.y - y);
        if (d < range && d < nd) { nd = d; nearest = e; }
    }
    if (!nearest) return;
    alreadyHit.add(nearest.id);

    lightningFlashes.push({ x1: x, y1: y, x2: nearest.x, y2: nearest.y, color, life: 0.16, maxLife: 0.16 });
    hitEnemy(nearest, damage, color);
    doChainLightning(nearest.x, nearest.y, range * 0.9, chains - 1, damage * 0.85, color, alreadyHit);
}

function applySpellHit(s, e) {
    const dmg = s.damage + rng(-s.damage * 0.1, s.damage * 0.1);
    hitEnemy(e, dmg, s.color);
    if (s.knockback > 0) {
        const a = Math.atan2(e.y - s.y, e.x - s.x);
        e.vx += Math.cos(a) * s.knockback;
        e.vy += Math.sin(a) * s.knockback;
    }
    if (s.burn) e.burnTimer = Math.max(e.burnTimer, 3);
    if (s.slow > 0) { e.slowTimer = Math.max(e.slowTimer, 2.5); e.slowFactor = s.slow; }
    if (s.stun > 0) e.stunTimer = Math.max(e.stunTimer, s.stun);
}

function hitEnemy(e, damage, color = '#ffffff') {
    e.hp -= damage;
    e.flashTimer = 0.14;
    const rounded = Math.round(damage);
    const floatColor = damage >= 90 ? '#ff3838' : damage >= 45 ? '#e67e22' : '#ffffff';
    spawnFloat(e.x, e.y - e.radius, `-${rounded}`, floatColor);
    spawnBurst(e.x, e.y, color, 6, 75, 3.5, 0.3);
    if (e.hp <= 0) killEnemy(e);
}

function killEnemy(e) {
    e.dead = true;
    wave.kills++;
    player.mana = Math.min(player.maxMana, player.mana + 7);
    spawnBurst(e.x, e.y, e.color, 18, 140, 5, 0.55);
    spawnBurst(e.x, e.y, '#ffffff', 8, 90, 3, 0.35);
    doShake(2.5, 0.12);
}

function damagePlayer(amount) {
    player.hp -= amount;
    player.invincible = 0.55;
    spawnBurst(player.x, player.y, '#ff3838', 14, 110, 5, 0.45);
    doShake(5.5, 0.22);
    if (player.hp <= 0) {
        player.hp = 0;
        gameState = 'dead';
    }
}

// ── Custom Drawing per Spell (Magma, Water, Stone, Lightning, etc.) ──
function drawSpells() {
    for (const s of spells) {
        if (s.kind === 'projectile') {
            // Draw Trail
            for (let t = 0; t < s.trail.length; t++) {
                const alpha = (t / s.trail.length) * 0.45;
                const r = s.radius * (t / s.trail.length) * 0.8;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = s.glow;
                ctx.beginPath();
                ctx.arc(s.trail[t].x, s.trail[t].y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            ctx.save();
            ctx.translate(s.x, s.y);

            if (s.visual === 'magma' || s.visual === 'meteor') {
                // ── Magma Ball: Exact match to uploaded reference picture! ──
                // Outer blazing orange corona
                ctx.fillStyle = '#ff793f';
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * 1.35, 0, Math.PI * 2);
                ctx.fill();

                // Vibrant fiery red middle ring
                ctx.fillStyle = '#d63031';
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * 1.05, 0, Math.PI * 2);
                ctx.fill();

                // Dark scorched rock/magma core with black border
                ctx.fillStyle = '#532f1d';
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * 0.65, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

            } else if (s.visual === 'water' || s.visual === 'shock_water') {
                // ── Aqua Shot / Shock Current ──
                ctx.rotate(s.angle);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2;
                // Teardrop water dart
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, Math.PI * 0.5, Math.PI * 1.5);
                ctx.lineTo(s.radius * 1.6, 0);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(s.radius * 0.2, -s.radius * 0.3, s.radius * 0.25, 0, Math.PI * 2);
                ctx.fill();

            } else if (s.visual === 'stone' || s.visual === 'boulder' || s.visual === 'volt_spike') {
                // ── Stone Spike / Rolling Boulder ──
                ctx.rotate(s.animTime * 12);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;

                // Faceted rocky polygon
                ctx.beginPath();
                const pts = 6;
                for (let i = 0; i < pts; i++) {
                    const a = (i / pts) * Math.PI * 2;
                    const rad = s.radius * (0.8 + 0.25 * ((i % 2 === 0) ? 1 : -0.5));
                    if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            } else if (s.visual === 'spark' || s.visual === 'plasma') {
                // ── High Energy Spark / Plasma Bolt ──
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

            } else {
                // Standard Vibrant Fireball / Flame Burst
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#f1c40f';
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

        } else if (s.kind === 'area') {
            // ── Area Spells (Waves, Earthquakes, Shockwaves) ──
            const progress = s.duration / s.maxDuration;
            ctx.save();
            ctx.globalAlpha = Math.min(1, progress * 1.3);

            if (s.visual === 'lightning' || s.visual === 'thunderstorm') {
                // Purple electrical aura
                ctx.strokeStyle = s.glow;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.stroke();

            } else if (s.visual === 'wave' || s.visual === 'flood') {
                // Surging blue tidal wave ring
                ctx.fillStyle = 'rgba(9, 132, 227, 0.25)';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#74b9ff';
                ctx.lineWidth = 5;
                ctx.stroke();

            } else if (s.visual === 'earthquake') {
                // Earth shatter fissures
                ctx.strokeStyle = '#b7791f';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.stroke();

            } else {
                // Classic expanding shockwave ring
                ctx.strokeStyle = s.color;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}

// ─── Enemy Updates & AI ──────────────────────────────────────
function updateEnemies(dt) {
    const toRemove = [];
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.dead) { toRemove.push(i); continue; }

        e.flashTimer = Math.max(0, e.flashTimer - dt);
        e.walkPhase += dt * 5;
        if (e.type === 'wraith') e.phaseTimer += dt;

        if (e.stunTimer > 0) { e.stunTimer -= dt; continue; }
        if (e.burnTimer > 0) {
            e.burnTimer -= dt;
            if (Math.floor(e.burnTimer * 4) % 2 === 0) {
                hitEnemy(e, 5, '#ff4757');
                spawnFire(e.x, e.y - e.radius, 2);
            }
        }
        if (e.slowTimer > 0) e.slowTimer -= dt;
        else e.slowFactor = 1;

        e.vx *= Math.pow(0.03, dt);
        e.vy *= Math.pow(0.03, dt);

        // ── Smart Anti-Stuck & Navigation AI ──
        const directAngle = Math.atan2(player.y - e.y, player.x - e.x);
        
        // Track displacement to detect if stuck against an obstacle
        const movedDist = Math.hypot(e.x - (e.lastX || e.x), e.y - (e.lastY || e.y));
        e.lastX = e.x;
        e.lastY = e.y;

        if (movedDist < e.speed * dt * 0.25 && e.stunTimer <= 0) {
            e.stuckTimer = (e.stuckTimer || 0) + dt;
        } else {
            e.stuckTimer = Math.max(0, (e.stuckTimer || 0) - dt * 2.5);
        }

        // If stuck for over 0.18s, pick an evasive angle to glide around the obstacle
        if (e.stuckTimer > 0.18) {
            e.steerTimer = 0.55;
            const side = (e.id % 2 === 0) ? 1 : -1;
            const testOffsets = [side * 1.1, -side * 1.1, side * 1.7, -side * 1.7];
            let bestAngle = directAngle + side * 1.3;
            for (const off of testOffsets) {
                const probeA = directAngle + off;
                const probeX = e.x + Math.cos(probeA) * e.radius * 2.5;
                const probeY = e.y + Math.sin(probeA) * e.radius * 2.5;
                if (!isWallBox(probeX, probeY, e.radius)) {
                    bestAngle = probeA;
                    break;
                }
            }
            e.steerAngle = bestAngle;
            e.stuckTimer = 0;
        }

        if (e.steerTimer > 0) {
            e.steerTimer -= dt;
        }

        const moveAngle = (e.steerTimer > 0) ? e.steerAngle : directAngle;
        e.angle = directAngle; // Always face player for visual aiming

        if (e.type === 'wizard' && e.ranged) {
            const d = dist(e, player);
            const preferDist = 240;
            const moveDir = d < preferDist ? -1 : (d > 320 ? 1 : 0);
            const spd = e.speed * e.slowFactor;
            const moveDirAngle = moveDir < 0 ? moveAngle + Math.PI : moveAngle;
            const nx = e.x + (moveDir !== 0 ? Math.cos(moveDirAngle) * spd + e.vx : e.vx) * dt;
            const ny = e.y + (moveDir !== 0 ? Math.sin(moveDirAngle) * spd + e.vy : e.vy) * dt;
            wallSlide(e, nx, ny, e.radius);

            e.shootCd -= dt;
            if (e.shootCd <= 0) {
                e.shootCd = e.shootRate;
                spawnEnemyProjectile(e.x, e.y, directAngle + rng(-0.15, 0.15), 180, e.damage, e.color);
            }
        } else {
            const spd = e.speed * e.slowFactor;
            const nx = e.x + (Math.cos(moveAngle) * spd + e.vx) * dt;
            const ny = e.y + (Math.sin(moveAngle) * spd + e.vy) * dt;
            wallSlide(e, nx, ny, e.radius);

            if (dist(e, player) < player.bodyRadius + e.radius + 3 && player.invincible <= 0) {
                damagePlayer(e.damage * dt * 2.2);
            }
        }

        // Failsafe: if an enemy ever gets inside a wall, gently push out toward open floor
        if (isWall(e.x, e.y)) {
            const tcX = Math.floor(e.x / TILE) * TILE + TILE / 2;
            const tcY = Math.floor(e.y / TILE) * TILE + TILE / 2;
            const pushX = e.x - tcX || rng(-1, 1);
            const pushY = e.y - tcY || rng(-1, 1);
            const pushLen = Math.hypot(pushX, pushY) || 1;
            e.x += (pushX / pushLen) * 70 * dt;
            e.y += (pushY / pushLen) * 70 * dt;
        }

        // Boid separation between enemies
        for (let j = 0; j < enemies.length; j++) {
            if (i === j || enemies[j].dead) continue;
            const dx = e.x - enemies[j].x, dy = e.y - enemies[j].y;
            const d = Math.hypot(dx, dy);
            const minD = e.radius + enemies[j].radius + 2;
            if (d < minD && d > 0) {
                const push = (minD - d) / minD * 45;
                e.vx += (dx / d) * push;
                e.vy += (dy / d) * push;
            }
        }
    }

    for (const i of toRemove) enemies.splice(i, 1);
}

function drawEnemies() {
    for (const e of enemies) {
        e.drawFn(e);

        // HP bar above enemy head (Clean Pill Style)
        if (e.hp < e.maxHp) {
            const bw = e.radius * 2.2;
            const bx = e.x - bw / 2;
            const by = e.y - e.radius - 12;

            ctx.fillStyle = '#181b22';
            ctx.beginPath();
            ctx.roundRect(bx - 1, by - 1, bw + 2, 6, 3);
            ctx.fill();

            const pct = Math.max(0, e.hp / e.maxHp);
            ctx.fillStyle = pct > 0.5 ? '#2ed573' : pct > 0.25 ? '#ffa502' : '#ff4757';
            ctx.beginPath();
            ctx.roundRect(bx, by, bw * pct, 4, 2);
            ctx.fill();
        }
    }
}

// ─── Waves & Spawning (Adapted for Big Map) ──────────────────
const wave = {
    number: 0,
    kills: 0,
    toSpawn: [],
    spawnTimer: 0,
    spawnInterval: 1.1,
    betweenWaveTimer: 0,
    betweenWaveMax: 3.5,
    active: false,
};

function buildWave(wn) {
    const list = [];
    const goblins = Math.min(4 + wn * 3, 25);
    const skeletons = wn >= 2 ? Math.min(wn * 2, 12) : 0;
    const golems = wn >= 3 ? Math.floor(wn / 2) : 0;
    const wizards = wn >= 4 ? Math.floor(wn / 3) : 0;
    const wraiths = wn >= 5 ? Math.min(wn - 2, 6) : 0;

    for (let i = 0; i < goblins; i++) list.push('goblin');
    for (let i = 0; i < skeletons; i++) list.push('skeleton');
    for (let i = 0; i < golems; i++) list.push('golem');
    for (let i = 0; i < wizards; i++) list.push('wizard');
    for (let i = 0; i < wraiths; i++) list.push('wraith');

    // Shuffle
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    wave.toSpawn = list;
}

function getSpawnPos(type = 'goblin') {
    const rad = ENEMY_TYPES[type]?.radius || 15;
    let x, y, tries = 0;
    do {
        const ang = rng(0, Math.PI * 2);
        const d = rng(450, 780);
        x = clamp(player.x + Math.cos(ang) * d, TILE * 2.5, WORLD_W - TILE * 2.5);
        y = clamp(player.y + Math.sin(ang) * d, TILE * 2.5, WORLD_H - TILE * 2.5);
        tries++;
    } while (isWallBox(x, y, rad + 4) && tries < 60);

    // If still in wall after 60 tries, scan open floor tiles with distance
    if (isWallBox(x, y, rad + 4)) {
        for (let r = 4; r < MAP_ROWS - 4; r += 2) {
            for (let c = 4; c < MAP_COLS - 4; c += 2) {
                const tx = c * TILE + TILE / 2;
                const ty = r * TILE + TILE / 2;
                if (!isWallBox(tx, ty, rad + 4) && dist({ x: tx, y: ty }, player) > 320) {
                    return { x: tx, y: ty };
                }
            }
        }
    }
    return { x, y };
}

function startNextWave() {
    wave.number++;
    wave.kills = 0;
    buildWave(wave.number);
    wave.active = true;
    wave.spawnTimer = 0;
    wave.betweenWaveTimer = 0;
}

function updateWave(dt) {
    if (!wave.active) {
        if (wave.betweenWaveTimer <= 0 && wave.number === 0) {
            startNextWave();
            return;
        }
        wave.betweenWaveTimer -= dt;
        if (wave.betweenWaveTimer <= 0) startNextWave();
        return;
    }

    if (wave.toSpawn.length > 0) {
        wave.spawnTimer -= dt;
        if (wave.spawnTimer <= 0) {
            wave.spawnTimer = wave.spawnInterval * Math.max(0.35, 1 - wave.number * 0.04);
            const type = wave.toSpawn.shift();
            const pos = getSpawnPos(type);
            spawnEnemy(type, pos.x, pos.y);
        }
    }

    if (wave.toSpawn.length === 0 && enemies.filter(e => !e.dead).length === 0) {
        wave.active = false;
        wave.betweenWaveTimer = wave.betweenWaveMax;
        player.hp = Math.min(player.maxHp, player.hp + 30);
        player.mana = player.maxMana;
    }
}

// ─── Player Update Loop ──────────────────────────────────────
function updatePlayer(dt) {
    const p = player;

    // Movement
    let dx = 0, dy = 0;
    if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
        dx /= len; dy /= len;
        p.isMoving = true;
        p.walkPhase += dt * 8;
    } else {
        p.isMoving = false;
    }

    const nx = p.x + dx * p.speed * dt;
    const ny = p.y + dy * p.speed * dt;
    wallSlide(p, nx, ny, p.bodyRadius);

    // Dynamic mouse world coordinates
    mouse.x = mouse.screenX + camera.x;
    mouse.y = mouse.screenY + camera.y;
    p.angle = Math.atan2(mouse.y - p.y, mouse.x - p.x);

    p.castCooldown = Math.max(0, p.castCooldown - dt);
    p.invincible = Math.max(0, p.invincible - dt);
    p.mana = Math.min(p.maxMana, p.mana + p.manaRegen * dt);

    if (mouse.leftPending) {
        if (p.castCooldown <= 0) castSpell('left');
        mouse.leftPending = false;
    }
    if (mouse.rightPending) {
        if (p.castCooldown <= 0) castSpell('right');
        mouse.rightPending = false;
    }
}

// ─── HUD / UI (Identical to reference screenshot) ─────────────
function drawHUD() {
    ctx.save();

    // ── 1. Top-Left: Avatar Portrait & HP / Mana Bars ──
    const avatarX = 40, avatarY = 40, avatarR = 24;

    // HP Capsule Bar
    const hpX = avatarX + avatarR + 10, hpY = avatarY - avatarR + 4, hpW = 160, hpH = 18;
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW, hpH, 9);
    ctx.fill();

    const hpPct = clamp(player.hp / player.maxHp, 0, 1);
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW * hpPct, hpH, 9);
    ctx.fill();

    // White outline for HP
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW, hpH, 9);
    ctx.stroke();

    // Mana Capsule Bar
    const manaX = hpX, manaY = hpY + hpH + 6, manaW = 145, manaH = 14;
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW, manaH, 7);
    ctx.fill();

    const manaPct = clamp(player.mana / player.maxMana, 0, 1);
    ctx.fillStyle = '#0984e3';
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW * manaPct, manaH, 7);
    ctx.fill();

    // White outline for Mana
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW, manaH, 7);
    ctx.stroke();

    // Circular Avatar Frame with Red Hooded Mage inside
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Mini Avatar inside
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR - 3, 0, Math.PI * 2);
    ctx.clip();
    // Hood body
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY + 2, 16, 0, Math.PI * 2);
    ctx.fill();
    // Dark face opening
    ctx.fillStyle = '#181b22';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY + 2, 9, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(avatarX - 3, avatarY + 1, 2, 0, Math.PI * 2);
    ctx.arc(avatarX + 3, avatarY + 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();


    // ── 2. Top-Right: Minimap & Tactical Radar ──
    const mmW = 148, mmH = 106;
    const mmX = BASE_W - mmW - 20;
    const mmY = 16;

    // Minimap Background Panel
    ctx.save();
    ctx.fillStyle = 'rgba(16, 20, 28, 0.92)';
    ctx.strokeStyle = '#3e495c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(mmX, mmY, mmW, mmH, 8);
    ctx.fill(); ctx.stroke();

    // Clip to minimap interior
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(mmX + 1, mmY + 1, mmW - 2, mmH - 2, 7);
    ctx.clip();

    // Draw cached dungeon wall map
    if (miniMapCanvas) {
        ctx.drawImage(miniMapCanvas, mmX, mmY, mmW, mmH);
    }

    // Draw Camera Viewport Box on Minimap
    const camVX = mmX + (camera.x / WORLD_W) * mmW;
    const camVY = mmY + (camera.y / WORLD_H) * mmH;
    const camVW = (BASE_W / WORLD_W) * mmW;
    const camVH = (BASE_H / WORLD_H) * mmH;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(camVX, camVY, camVW, camVH);

    // Draw Enemies on Minimap
    for (const e of enemies) {
        if (e.dead) continue;
        const ex = mmX + (e.x / WORLD_W) * mmW;
        const ey = mmY + (e.y / WORLD_H) * mmH;
        const dotR = e.type === 'golem' ? 3.5 : 2.5;
        const dotColor = e.type === 'wraith' ? '#a29bfe' : e.type === 'golem' ? '#ffa502' : '#ff4757';
        
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Player on Minimap
    const px = mmX + (player.x / WORLD_W) * mmW;
    const py = mmY + (player.y / WORLD_H) * mmH;
    
    // Player pulsing dot
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Player heading line on minimap
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(player.angle) * 6, py + Math.sin(player.angle) * 6);
    ctx.stroke();

    ctx.restore(); // end clip

    // Radar title
    ctx.fillStyle = '#8395a7';
    ctx.font = '800 9px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('RADAR', mmX + 6, mmY + 12);
    ctx.restore();

    // ── Wave, Kills, and Remaining Enemy Counters (Left of Minimap) ──
    const textRightX = mmX - 16;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`WAVE ${String(wave.number).padStart(2, '0')}`, textRightX, 38);

    ctx.font = '800 14px "Segoe UI", sans-serif';
    ctx.fillStyle = '#c8d6e5';
    ctx.fillText(`KILLS: ${wave.kills}`, textRightX, 58);

    const aliveCount = enemies.filter(e => !e.dead).length;
    ctx.fillStyle = aliveCount > 0 ? '#ff6b6b' : '#1dd1a1';
    ctx.font = '800 13px "Segoe UI", sans-serif';
    ctx.fillText(`MUSUH: ${aliveCount}`, textRightX, 78);

    // ── Off-screen Enemy Pointers (Radar Edge Arrows) ──
    for (const e of enemies) {
        if (e.dead) continue;
        const isOffScreen = e.x < camera.x || e.x > camera.x + BASE_W || e.y < camera.y || e.y > camera.y + BASE_H;
        if (!isOffScreen) continue;

        // Calculate vector from camera center to enemy
        const screenCenterX = BASE_W / 2;
        const screenCenterY = BASE_H / 2;
        const dx = e.x - (camera.x + screenCenterX);
        const dy = e.y - (camera.y + screenCenterY);
        const ang = Math.atan2(dy, dx);

        // Intersect ray with screen edge margins
        const pad = 24;
        const halfW = (BASE_W / 2) - pad;
        const halfH = (BASE_H / 2) - pad;
        const rayScale = Math.min(
            Math.abs(halfW / Math.cos(ang)),
            Math.abs(halfH / Math.sin(ang))
        );

        const arrowX = screenCenterX + Math.cos(ang) * rayScale;
        const arrowY = screenCenterY + Math.sin(ang) * rayScale;

        // Draw clean chevron arrow pointing to offscreen enemy
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(ang);
        ctx.fillStyle = '#ff4757';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
    }


    // ── 3. Bottom-Center: Hotbar (Keys 1-4) & Spell Queue ──
    const btnSize = 48, btnGap = 8;
    const totalEl = 4;
    const totalQueueSlots = 5;

    const elBarW = totalEl * (btnSize + btnGap) - btnGap;
    const qBarW = totalQueueSlots * (btnSize + btnGap) - btnGap;
    const barTotalW = elBarW + 20 + qBarW;

    const startBarX = (BASE_W - barTotalW) / 2;
    const barY = BASE_H - btnSize - 32;

    // Background Container for Elements & Queue
    ctx.fillStyle = 'rgba(24, 27, 36, 0.9)';
    ctx.strokeStyle = '#383e4d';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(startBarX - 12, barY - 10, elBarW + 24, btnSize + 20, 12);
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(startBarX + elBarW + 14, barY - 10, qBarW + 24, btnSize + 20, 12);
    ctx.fill(); ctx.stroke();

    // ── Element Slots [1], [2], [3], [4] ──
    const elementKeys = ['1', '2', '3', '4'];
    for (let i = 0; i < 4; i++) {
        const k = elementKeys[i];
        const el = ELEMENTS[k];
        const bx = startBarX + i * (btnSize + btnGap);
        const by = barY;

        // Button body
        ctx.fillStyle = el.color + '22';
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(bx, by, btnSize, btnSize, 8);
        ctx.fill(); ctx.stroke();

        // Icon inside button
        drawElementIcon(bx + btnSize / 2, by + btnSize / 2, 13, el);

        // Key Tab Pill on top: [1], [2], [3], [4]
        ctx.fillStyle = '#1c202a';
        ctx.strokeStyle = '#4f596b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx + btnSize / 2 - 11, by - 16, 22, 16, 4);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.key, bx + btnSize / 2, by - 4);
    }

    // ── Queue Slots (Shows current crafted elements) ──
    const queueStartX = startBarX + elBarW + 26;
    for (let i = 0; i < totalQueueSlots; i++) {
        const qx = queueStartX + i * (btnSize + btnGap);
        const qy = barY;
        const queuedKey = player.queue[i];

        if (queuedKey) {
            const el = ELEMENTS[queuedKey];
            ctx.fillStyle = el.color + '33';
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(qx, qy, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();

            // Element Key Label inside Queue Box
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 18px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(el.key, qx + btnSize / 2, qy + btnSize / 2 + 6);
        } else {
            // Empty slot
            ctx.fillStyle = 'rgba(16, 18, 25, 0.7)';
            ctx.strokeStyle = '#2d3340';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(qx, qy, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();
        }
    }

    // ── Active Spell Preview Tooltip ──
    const spell = getSpell(player.queue);
    if (spell) {
        ctx.fillStyle = 'rgba(20, 23, 31, 0.95)';
        ctx.strokeStyle = '#ff793f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 180, barY - 44, 360, 26, 6);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f1c40f';
        ctx.font = '800 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ${spell.name}  —  ${spell.desc}`, BASE_W / 2, barY - 27);
    }

    // ── Controls Hint Text (Bottom-most) ──
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 11px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WASD: Gerak  |  1-4: Racik Elemen  |  Klik Kiri: Tembak  |  Klik Kanan: Area/Bertahan  |  Backspace: Hapus', BASE_W / 2, BASE_H - 10);

    // ── Between Waves Banner ──
    if (!wave.active && wave.betweenWaveTimer > 0) {
        ctx.fillStyle = 'rgba(18, 20, 28, 0.85)';
        ctx.strokeStyle = '#2ed573';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 160, 80, 320, 38, 8);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#2ed573';
        ctx.font = '900 15px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Wave ${wave.number + 1} dimulai dalam ${Math.ceil(wave.betweenWaveTimer)}s...`, BASE_W / 2, 104);
    }

    ctx.restore();
}

// ─── Screen Overlays (Start, Dead, Pause) ─────────────────────
function drawStartScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.9)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ff4757';
    ctx.font = '900 52px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PASSURA', BASE_W / 2, BASE_H / 2 - 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Segoe UI", sans-serif';
    ctx.fillText('ELEMENTAL ARENA', BASE_W / 2, BASE_H / 2 - 45);

    ctx.fillStyle = '#a4b0be';
    ctx.font = '600 14px "Segoe UI", sans-serif';
    ctx.fillText('WASD: Gerak   |   1 2 3 4: Pilih Elemen   |   Klik Kiri: Tembak   |   Klik Kanan: Area', BASE_W / 2, BASE_H / 2 + 10);
    ctx.fillText('Gabungkan 1, 2, hingga 3 elemen untuk menciptakan puluhan mantra mematikan!', BASE_W / 2, BASE_H / 2 + 35);

    ctx.fillStyle = '#2ed573';
    ctx.font = '900 20px "Segoe UI", sans-serif';
    ctx.fillText('Tekan SPACE untuk Mulai Petualangan', BASE_W / 2, BASE_H / 2 + 85);
}

function drawDeadScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.88)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ff4757';
    ctx.font = '900 56px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GUGUR', BASE_W / 2, BASE_H / 2 - 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Segoe UI", sans-serif';
    ctx.fillText(`Mencapai Wave ${wave.number}  •  Kills: ${wave.kills}`, BASE_W / 2, BASE_H / 2 + 15);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '800 18px "Segoe UI", sans-serif';
    ctx.fillText('Tekan SPACE untuk Bermain Lagi', BASE_W / 2, BASE_H / 2 + 60);
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.75)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', BASE_W / 2, BASE_H / 2 - 10);

    ctx.font = '600 16px "Segoe UI", sans-serif';
    ctx.fillStyle = '#a4b0be';
    ctx.fillText('Tekan ESC untuk Melanjutkan', BASE_W / 2, BASE_H / 2 + 28);
}

// ─── Game State & Reset ──────────────────────────────────────
let gameState = 'start'; // 'start' | 'playing' | 'paused' | 'dead'

function startGame() {
    generateMap();
    player.x = WORLD_W / 2;
    player.y = WORLD_H / 2;
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    player.queue = [];
    player.castCooldown = 0;
    player.invincible = 0;

    camera.x = player.x - BASE_W / 2;
    camera.y = player.y - BASE_H / 2;

    enemies.length = 0;
    spells.length = 0;
    particles.length = 0;
    floats.length = 0;
    lightningFlashes.length = 0;
    enemyProjectiles.length = 0;

    wave.number = 0;
    wave.kills = 0;
    wave.toSpawn = [];
    wave.active = false;
    wave.betweenWaveTimer = 1.0;

    gameState = 'playing';
}

// ─── Main Game Loop ──────────────────────────────────────────
let lastTime = 0;

function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, BASE_W, BASE_H);

    if (gameState === 'start') {
        drawStartScreen();
        requestAnimationFrame(loop);
        return;
    }

    if (gameState === 'dead') {
        // Draw World in background
        ctx.save();
        ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
        drawMap();
        drawEnemies();
        ctx.restore();
        drawDeadScreen();
        requestAnimationFrame(loop);
        return;
    }

    if (gameState === 'paused') {
        ctx.save();
        ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
        drawMap();
        drawEnemies();
        drawPlayer();
        ctx.restore();
        drawPauseScreen();
        requestAnimationFrame(loop);
        return;
    }

    // ── UPDATE ──
    updateShake(dt);
    updatePlayer(dt);
    camera.update(dt);
    updateEnemies(dt);
    updateSpells(dt);
    updateEnemyProjectiles(dt);
    updateParticles(dt);
    updateFloats(dt);
    updateLightningFlashes(dt);
    updateWave(dt);

    // ── RENDER WORLD (With Camera & Shake) ──
    ctx.save();
    ctx.translate(shake.x - Math.round(camera.x), shake.y - Math.round(camera.y));

    drawMap();
    drawParticles();
    drawEnemyProjectiles();
    drawSpells();
    drawLightningFlashes();
    drawEnemies();
    drawPlayer();
    drawFloats();

    ctx.restore();

    // ── RENDER HUD (Screen-space, always fixed on screen) ──
    drawHUD();

    requestAnimationFrame(loop);
}

// ─── Initialization ──────────────────────────────────────────
generateMap();
requestAnimationFrame(t => { lastTime = t; requestAnimationFrame(loop); });
