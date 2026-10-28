// ============================================================
//  PASSURA: Elemental Arena — js/enemies.js
//  Enemy Types, Custom Procedural Sprites, AI & Projectiles
// ============================================================

// ─── Enemy State & Definitions ───────────────────────────────
const enemies = [];
let enemyIdCounter = 0;

const ENEMY_TYPES = {
    goblin: {
        name: 'Goblin', hp: 65, speed: 85, damage: 16, radius: 14,
        color: '#6bb343', darkColor: '#4d8a2f',
        xpValue: 5, drawFn: drawGoblin
    },
    skeleton: {
        name: 'Skeleton', hp: 50, speed: 105, damage: 14, radius: 13,
        color: '#e4e7eb', darkColor: '#2c3e50',
        xpValue: 4, drawFn: drawSkeleton
    },
    golem: {
        name: 'Golem', hp: 220, speed: 50, damage: 38, radius: 22,
        color: '#576574', darkColor: '#222f3e',
        xpValue: 20, drawFn: drawGolem
    },
    wizard: {
        name: 'Wizard', hp: 85, speed: 60, damage: 22, radius: 14,
        color: '#8e44ad', darkColor: '#5b2c6f',
        xpValue: 15, drawFn: drawWizardEnemy, ranged: true, shootCd: 0, shootRate: 2.3
    },
    wraith: {
        name: 'Wraith', hp: 60, speed: 125, damage: 24, radius: 12,
        color: '#9b59b6', darkColor: '#4a235a',
        xpValue: 10, drawFn: drawWraith, phaseTimer: 0
    },
};

function spawnEnemy(type, x, y) {
    const t = ENEMY_TYPES[type];
    const waveDmgMult = (typeof wave !== 'undefined' && wave.number > 1) ? (1 + (wave.number - 1) * 0.08) : 1;
    const finalDamage = Math.round(t.damage * waveDmgMult);
    const e = {
        id: enemyIdCounter++,
        type, ...t,
        damage: finalDamage,
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

// ── Goblin: Cute chubby green goblin with loincloth ──────────
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

// ── Skeleton: Cute pale grey stick-cartoon skeleton ──────────
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

// ── Golem: Chunky faceted rock monster with glowing runes ────
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

// ── Wizard Enemy: Purple cultist with tall pointy hat ────────
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

// ── Wraith: Translucent floating ghost with glowing eyes ─────
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

// ─── Damage & Elimination ────────────────────────────────────
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
    if (typeof wave !== 'undefined') wave.kills++;
    player.mana = Math.min(player.maxMana, player.mana + 7);
    spawnBurst(e.x, e.y, e.color, 18, 140, 5, 0.55);
    spawnBurst(e.x, e.y, '#ffffff', 8, 90, 3, 0.35);
    doShake(2.5, 0.12);
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
                damagePlayer(e.damage);
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

// ─── Enemy Rendering & Head HP Bars ──────────────────────────
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

