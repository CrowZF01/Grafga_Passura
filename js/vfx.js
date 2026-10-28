// ============================================================
//  PASSURA: Elemental Arena — js/vfx.js
//  Screen Shake, Particle FX, Floating Combat Text & Lightning
// ============================================================

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

// ─── Floating Combat Damage Text ─────────────────────────────
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

