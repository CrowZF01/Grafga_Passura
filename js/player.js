// ============================================================
//  PASSURA: Elemental Arena — js/player.js
//  Player State, Movement, Rendering & Queue Display
// ============================================================

// ─── Player Object ───────────────────────────────────────────
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

// ─── Player Damage ───────────────────────────────────────────
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

// ─── Player Movement & State Update ──────────────────────────
function updatePlayer(dt) {
    const p = player;

    // Movement (WASD / Arrows)
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

// ─── Player Rendering ────────────────────────────────────────
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

// ─── Floating Element Queue Above Player ─────────────────────
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

// ─── Vector Icon Renderer for Elements ───────────────────────
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

