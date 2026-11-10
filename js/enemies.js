// ============================================================
//  PASSURA: Elemental Arena — js/enemies.js
//  Enemy Types, Bosses, Custom Sprites, AI, Projectiles & Hazards
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

    // ── Boss Types (Wave 5, 10, 15) ──
    boss_water: {
        name: 'Aqua Overlord', hp: 850, speed: 52, damage: 20, radius: 34,
        color: '#0984e3', darkColor: '#0c2461', glow: '#74b9ff',
        xpValue: 120, drawFn: drawAquaBoss, isBoss: true, bossElement: '2',
        title: 'Penguasa Samudra (Wave 5 Boss)'
    },
    boss_earth: {
        name: 'Terra Titan', hp: 1800, speed: 42, damage: 32, radius: 40,
        color: '#b7791f', darkColor: '#78350f', glow: '#d69e2e',
        xpValue: 240, drawFn: drawTerraBoss, isBoss: true, bossElement: '3',
        title: 'Raksasa Granit (Wave 10 Boss)'
    },
    boss_lightning: {
        name: 'Volt Archon', hp: 3200, speed: 70, damage: 34, radius: 32,
        color: '#9b59b6', darkColor: '#6c5ce7', glow: '#a29bfe',
        xpValue: 400, drawFn: drawVoltBoss, isBoss: true, bossElement: '4',
        title: 'Dewa Badai Halilintar (Wave 15 Boss)'
    },
};

function spawnEnemy(type, x, y) {
    const t = ENEMY_TYPES[type];
    if (!t) return null;
    const waveDmgMult = (typeof wave !== 'undefined' && wave.number > 1) ? (1 + (wave.number - 1) * 0.08) : 1;
    const finalDamage = Math.round(t.damage * (t.isBoss ? 1 : waveDmgMult));
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
        // Boss timers
        bossSkillTimer: 2.2,
        bossSkillIndex: 0,
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
    ctx.beginPath();
    ctx.roundRect(-7, e.radius * 0.3 + legSwing, 5, 8, 2);
    ctx.fill(); ctx.stroke();
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

    // Brown Loincloth
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.6, e.radius * 0.1, e.radius * 1.2, e.radius * 0.55, 3);
    ctx.fill(); ctx.stroke();

    // Ears
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.moveTo(-e.radius * 0.6, -e.radius * 0.6);
    ctx.lineTo(-e.radius * 1.3, -e.radius * 1.0);
    ctx.lineTo(-e.radius * 0.4, -e.radius * 0.9);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(e.radius * 0.6, -e.radius * 0.6);
    ctx.lineTo(e.radius * 1.3, -e.radius * 1.0);
    ctx.lineTo(e.radius * 0.4, -e.radius * 0.9);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Head
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(0, -e.radius * 0.65, e.radius * 0.75, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Eyes
    if (!isHit) {
        ctx.fillStyle = '#181b22';
        ctx.beginPath();
        ctx.arc(3.5, -e.radius * 0.65, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-3.5, -e.radius * 0.65, 2.5, 0, Math.PI * 2);
        ctx.fill();

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

    // Spine Body
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

// ── Boss 1: Aqua Overlord (Wave 10 Boss - Water Element) ─────
function drawAquaBoss(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Giant Drop Shadow
    ctx.save();
    ctx.scale(1, 0.45);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(0, e.radius + 10, e.radius * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Floating water bubbles orbiting the boss
    const time = Date.now() * 0.003;
    for (let k = 0; k < 4; k++) {
        const orbitA = time + (k / 4) * Math.PI * 2;
        const ox = Math.cos(orbitA) * (e.radius + 14);
        const oy = Math.sin(orbitA) * (e.radius + 14) * 0.6;
        ctx.fillStyle = '#74b9ff';
        ctx.strokeStyle = '#0984e3';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ox, oy, 4.5, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
    }

    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const bodyColor = isHit ? '#ffffff' : e.color;
    const darkColor = isHit ? '#ffffff' : e.darkColor;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 3.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Aquatic Dragon / Serpent Fins (Side flippers)
    const finWave = Math.sin(e.walkPhase * 0.8) * 4;
    ctx.fillStyle = darkColor;
    // Left fin
    ctx.beginPath();
    ctx.moveTo(-10, -e.radius * 0.7);
    ctx.lineTo(-e.radius * 1.3, -e.radius * 1.2 + finWave);
    ctx.lineTo(-e.radius * 0.4, -e.radius * 0.3);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Right fin
    ctx.beginPath();
    ctx.moveTo(-10, e.radius * 0.7);
    ctx.lineTo(-e.radius * 1.3, e.radius * 1.2 - finWave);
    ctx.lineTo(-e.radius * 0.4, e.radius * 0.3);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Armored Leviathan Body Shell
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.radius * 1.05, e.radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Crest / Crown Fins on Head
    ctx.fillStyle = '#00cec9';
    ctx.beginPath();
    ctx.moveTo(e.radius * 0.3, -e.radius * 0.7);
    ctx.lineTo(e.radius * 0.9, 0);
    ctx.lineTo(e.radius * 0.3, e.radius * 0.7);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Ocean Rune Shell Plates
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.arc(-e.radius * 0.3, 0, e.radius * 0.45, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Glowing Azure Eyes
    if (!isHit) {
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(e.radius * 0.45, -e.radius * 0.35, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.45, e.radius * 0.35, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e.radius * 0.5, -e.radius * 0.35, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.5, e.radius * 0.35, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ── Boss 2: Terra Titan (Wave 20 Boss - Earth Element) ───────
function drawTerraBoss(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Heavy Drop Shadow
    ctx.save();
    ctx.scale(1, 0.45);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.arc(0, e.radius + 12, e.radius * 1.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const stoneColor = isHit ? '#ffffff' : e.color;
    const darkStone = isHit ? '#ffffff' : e.darkColor;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Massive Boulder Fists on Left & Right
    const punchBob = Math.sin(e.walkPhase * 0.7) * 5;
    ctx.fillStyle = darkStone;
    // Left Fist
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.2, -e.radius * 1.3 + punchBob, e.radius * 0.75, e.radius * 0.65, 6);
    ctx.fill(); ctx.stroke();
    // Right Fist
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.2, e.radius * 0.7 - punchBob, e.radius * 0.75, e.radius * 0.65, 6);
    ctx.fill(); ctx.stroke();

    // Granite Angular Torso
    ctx.fillStyle = stoneColor;
    ctx.beginPath();
    const pts = 8;
    for (let i = 0; i < pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const rad = e.radius * (0.9 + 0.12 * Math.cos(i * 3));
        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Golden Runic Core in Chest
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.roundRect(-e.radius * 0.35, -e.radius * 0.35, e.radius * 0.7, e.radius * 0.7, 4);
    ctx.fill();
    ctx.strokeStyle = '#d69e2e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glowing Molten/Amber Eye Slits
    if (!isHit) {
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(e.radius * 0.55, -e.radius * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.55, e.radius * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e.radius * 0.6, -e.radius * 0.3, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.6, e.radius * 0.3, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ── Boss 3: Volt Archon (Wave 30 Boss - Lightning Element) ───
function drawVoltBoss(e) {
    ctx.save();
    ctx.translate(e.x, e.y);

    // Floating storm shadow
    ctx.save();
    ctx.scale(1, 0.45);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(0, e.radius + 10, e.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Floating magnetic runic obelisks orbiting the boss
    const time = Date.now() * 0.004;
    for (let k = 0; k < 5; k++) {
        const orbitA = time + (k / 5) * Math.PI * 2;
        const ox = Math.cos(orbitA) * (e.radius + 16);
        const oy = Math.sin(orbitA) * (e.radius + 16) * 0.7;

        // Runic obelisk diamond
        ctx.fillStyle = '#6c5ce7';
        ctx.strokeStyle = '#a29bfe';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ox, oy - 6);
        ctx.lineTo(ox + 4, oy);
        ctx.lineTo(ox, oy + 6);
        ctx.lineTo(ox - 4, oy);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Crackling spark between obelisks
        if (Math.random() < 0.25) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox + rng(-12, 12), oy + rng(-12, 12));
            ctx.stroke();
        }
    }

    ctx.rotate(e.angle);

    const isHit = e.flashTimer > 0;
    const shroudColor = isHit ? '#ffffff' : e.color;
    const darkShroud = isHit ? '#ffffff' : e.darkColor;

    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.8;

    // Outer Storm Robe Cloak
    ctx.fillStyle = shroudColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, e.radius, e.radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Inner Dark Void
    ctx.fillStyle = darkShroud;
    ctx.beginPath();
    ctx.arc(e.radius * 0.2, 0, e.radius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Thunder Crest Horns
    ctx.fillStyle = '#fdcb6e';
    ctx.beginPath();
    ctx.moveTo(e.radius * 0.2, -e.radius * 0.8);
    ctx.lineTo(e.radius * 0.85, -e.radius * 0.6);
    ctx.lineTo(e.radius * 0.4, -e.radius * 0.3);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(e.radius * 0.2, e.radius * 0.8);
    ctx.lineTo(e.radius * 0.85, e.radius * 0.6);
    ctx.lineTo(e.radius * 0.4, e.radius * 0.3);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Glowing Violet / Lightning Eyes
    if (!isHit) {
        ctx.fillStyle = '#e056fd';
        ctx.beginPath();
        ctx.arc(e.radius * 0.4, -e.radius * 0.22, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.4, e.radius * 0.22, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e.radius * 0.44, -e.radius * 0.22, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.radius * 0.44, e.radius * 0.22, 1.6, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ─── Enemy Projectiles ───────────────────────────────────────
const enemyProjectiles = [];

function spawnEnemyProjectile(x, y, angle, speed, damage, color, radius = 7, extra = {}) {
    enemyProjectiles.push({
        x, y, angle, speed, damage, color,
        radius,
        life: extra.life || 3.5,
        visual: extra.visual || 'ball', // 'ball' | 'water_jet' | 'boulder' | 'spark'
        bounces: extra.bounces || 0,
        spin: 0,
    });
}

function updateEnemyProjectiles(dt) {
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const p = enemyProjectiles[i];
        p.x += Math.cos(p.angle) * p.speed * dt;
        p.y += Math.sin(p.angle) * p.speed * dt;
        p.life -= dt;
        p.spin = (p.spin || 0) + dt * 5;

        if (p.life <= 0) {
            spawnBurst(p.x, p.y, p.color, 6, 60, 3, 0.3);
            enemyProjectiles.splice(i, 1);
            continue;
        }

        if (isWall(p.x, p.y)) {
            if (p.bounces > 0) {
                p.bounces--;
                const prevX = p.x - Math.cos(p.angle) * p.speed * dt;
                const prevY = p.y - Math.sin(p.angle) * p.speed * dt;
                if (isWall(p.x, prevY)) p.angle = Math.PI - p.angle;
                else p.angle = -p.angle;
                spawnBurst(p.x, p.y, p.color, 5, 80, 3, 0.2);
            } else {
                spawnBurst(p.x, p.y, p.color, 6, 60, 3, 0.3);
                enemyProjectiles.splice(i, 1);
                continue;
            }
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
        ctx.translate(p.x, p.y);

        if (p.visual === 'boulder') {
            ctx.rotate(p.spin || 0);
            ctx.fillStyle = '#795548';
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            ctx.strokeStyle = '#a1887f';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(-p.radius * 0.5, -p.radius * 0.3);
            ctx.lineTo(0, 0);
            ctx.lineTo(p.radius * 0.4, -p.radius * 0.5);
            ctx.stroke();
        } else if (p.visual === 'water_jet') {
            ctx.rotate(p.angle);
            ctx.fillStyle = '#0984e3';
            ctx.strokeStyle = '#74b9ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 1.3, p.radius * 0.8, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p.radius * 0.3, 0, p.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.visual === 'spark') {
            ctx.rotate(p.spin || p.angle);
            ctx.fillStyle = '#a29bfe';
            ctx.strokeStyle = '#6c5ce7';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -p.radius * 1.3);
            ctx.lineTo(p.radius * 0.7, 0);
            ctx.lineTo(0, p.radius * 1.3);
            ctx.lineTo(-p.radius * 0.7, 0);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = p.color;
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

// ─── Enemy Hazards (Ground Telegraphs & Traps) ───────────────
const enemyHazards = [];

function spawnEnemyHazard(x, y, radius, delay, duration, damage, type, color, glow) {
    enemyHazards.push({
        x, y, radius,
        delay, maxDelay: delay,
        duration, maxDuration: duration,
        damage, type, color, glow,
        triggered: false,
        hitPlayer: false,
    });
}

function updateEnemyHazards(dt) {
    for (let i = enemyHazards.length - 1; i >= 0; i--) {
        const h = enemyHazards[i];
        if (h.delay > 0) {
            h.delay -= dt;
            if (h.delay <= 0) {
                h.triggered = true;
                doShake(3.8, 0.16);
                spawnBurst(h.x, h.y, h.color, 16, 120, 5, 0.4);

                if (dist(h, player) < h.radius + player.bodyRadius && player.invincible <= 0) {
                    damagePlayer(h.damage);
                    h.hitPlayer = true;
                }
            }
        } else {
            h.duration -= dt;
            if (!h.hitPlayer && dist(h, player) < h.radius + player.bodyRadius && player.invincible <= 0) {
                damagePlayer(h.damage);
                h.hitPlayer = true;
            }
            if (h.duration <= 0) {
                enemyHazards.splice(i, 1);
            }
        }
    }
}

function drawEnemyHazards() {
    for (const h of enemyHazards) {
        ctx.save();
        if (h.delay > 0) {
            const progress = clamp(1 - (h.delay / h.maxDelay), 0, 1);
            const pulse = 0.25 + 0.15 * Math.sin(Date.now() * 0.015);

            ctx.strokeStyle = h.color;
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.75;
            ctx.beginPath();
            ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = h.color;
            ctx.globalAlpha = pulse * 0.55;
            ctx.beginPath();
            ctx.arc(h.x, h.y, h.radius * progress, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.85;
            ctx.font = '900 13px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️', h.x, h.y + 5);
        } else {
            const alpha = clamp(h.duration / h.maxDuration, 0, 1);
            ctx.globalAlpha = alpha;

            if (h.type === 'water_geyser') {
                ctx.fillStyle = '#74b9ff';
                ctx.strokeStyle = '#0984e3';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(h.x, h.y, h.radius, h.radius * 0.6, 0, 0, Math.PI * 2);
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.ellipse(h.x, h.y - 8, h.radius * 0.65, h.radius * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (h.type === 'earth_spike') {
                ctx.fillStyle = '#795548';
                ctx.strokeStyle = '#2d1505';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(h.x - h.radius * 0.6, h.y);
                ctx.lineTo(h.x, h.y - h.radius * 1.1);
                ctx.lineTo(h.x + h.radius * 0.6, h.y);
                ctx.closePath();
                ctx.fill(); ctx.stroke();
            } else if (h.type === 'lightning_strike') {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(h.x, h.y - 180);
                ctx.lineTo(h.x - 8, h.y - 90);
                ctx.lineTo(h.x + 8, h.y - 50);
                ctx.lineTo(h.x, h.y);
                ctx.stroke();

                ctx.fillStyle = '#a29bfe';
                ctx.beginPath();
                ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}

// ─── Boss Skill Casting System ───────────────────────────────
function castBossSkill(e, directAngle) {
    e.bossSkillIndex = ((e.bossSkillIndex || 0) + 1) % 3;
    const isEnraged = e.hp < e.maxHp * 0.35;

    if (e.type === 'boss_water') {
        // Water Boss Skills (Element 2)
        if (e.bossSkillIndex === 0) {
            spawnFloat(e.x, e.y - e.radius - 16, '🌊 SEMBURAN AIR!', '#74b9ff', 1.2);
            doShake(3.0, 0.12);
            const count = isEnraged ? 5 : 3;
            const spread = 0.45;
            for (let k = 0; k < count; k++) {
                const a = directAngle - spread / 2 + (k / Math.max(1, count - 1)) * spread;
                spawnEnemyProjectile(e.x, e.y, a, 280, 16, '#0984e3', 9, { visual: 'water_jet' });
            }
        } else if (e.bossSkillIndex === 1) {
            spawnFloat(e.x, e.y - e.radius - 16, '🌊 OMBAK TSUNAMI!', '#00a8ff', 1.2);
            doShake(4.5, 0.2);
            const count = isEnraged ? 12 : 8;
            for (let k = 0; k < count; k++) {
                const a = (k / count) * Math.PI * 2;
                spawnEnemyProjectile(e.x, e.y, a, 190, 18, '#74b9ff', 10, { visual: 'water_jet' });
            }
        } else {
            spawnFloat(e.x, e.y - e.radius - 16, '🌊 GEYSER MENDIDIH!', '#dfe6e9', 1.2);
            const count = isEnraged ? 3 : 2;
            for (let k = 0; k < count; k++) {
                const offset = k === 0 ? { x: 0, y: 0 } : { x: rng(-60, 60), y: rng(-60, 60) };
                spawnEnemyHazard(player.x + offset.x, player.y + offset.y, 42, 0.95, 0.5, 26, 'water_geyser', '#0984e3', '#74b9ff');
            }
        }
    } else if (e.type === 'boss_earth') {
        // Earth Boss Skills (Element 3)
        if (e.bossSkillIndex === 0) {
            spawnFloat(e.x, e.y - e.radius - 16, '⛰️ GELOMBANG BATU!', '#d69e2e', 1.2);
            doShake(4.0, 0.15);
            const count = isEnraged ? 3 : 2;
            const spread = 0.35;
            for (let k = 0; k < count; k++) {
                const a = directAngle - spread / 2 + (k / Math.max(1, count - 1)) * spread;
                spawnEnemyProjectile(e.x, e.y, a, 200, 28, '#795548', 16, { visual: 'boulder' });
            }
        } else if (e.bossSkillIndex === 1) {
            spawnFloat(e.x, e.y - e.radius - 16, '⛰️ GEMPA BUMI!', '#b7791f', 1.2);
            doShake(6.0, 0.25);
            spawnBurst(e.x, e.y, '#b7791f', 24, 180, 6, 0.5);
            for (let k = 0; k < 8; k++) {
                const a = (k / 8) * Math.PI * 2;
                spawnEnemyProjectile(e.x, e.y, a, 240, 22, '#d69e2e', 10, { visual: 'boulder' });
            }
        } else {
            spawnFloat(e.x, e.y - e.radius - 16, '⛰️ TOMBAK BUMI!', '#8d6e63', 1.2);
            const count = isEnraged ? 4 : 3;
            for (let k = 0; k < count; k++) {
                const a = rng(0, Math.PI * 2);
                const d = rng(40, 110);
                spawnEnemyHazard(player.x + Math.cos(a) * d, player.y + Math.sin(a) * d, 40, 0.9, 0.45, 30, 'earth_spike', '#b7791f', '#d69e2e');
            }
        }
    } else if (e.type === 'boss_lightning') {
        // Lightning Boss Skills (Element 4)
        if (e.bossSkillIndex === 0) {
            spawnFloat(e.x, e.y - e.radius - 16, '⚡ SAMBARAN PETIR!', '#a29bfe', 1.2);
            const count = isEnraged ? 4 : 3;
            for (let k = 0; k < count; k++) {
                const offset = k === 0 ? { x: 0, y: 0 } : { x: rng(-75, 75), y: rng(-75, 75) };
                spawnEnemyHazard(player.x + offset.x, player.y + offset.y, 38, 0.8, 0.4, 30, 'lightning_strike', '#9b59b6', '#a29bfe');
            }
        } else if (e.bossSkillIndex === 1) {
            spawnFloat(e.x, e.y - e.radius - 16, '⚡ NOVA KILAT!', '#e056fd', 1.2);
            doShake(3.5, 0.15);
            const count = isEnraged ? 12 : 8;
            for (let k = 0; k < count; k++) {
                const a = (k / count) * Math.PI * 2;
                spawnEnemyProjectile(e.x, e.y, a, 270, 18, '#9b59b6', 8, { visual: 'spark', bounces: 2 });
            }
        } else {
            spawnFloat(e.x, e.y - e.radius - 16, '⚡ TEMBAKAN PLASMA!', '#6c5ce7', 1.2);
            doShake(4.0, 0.15);
            for (let k = -1; k <= 1; k++) {
                spawnEnemyProjectile(e.x, e.y, directAngle + k * 0.22, 380, 24, '#a29bfe', 9, { visual: 'spark' });
            }
        }
    }
}

// ─── Damage & Elimination ────────────────────────────────────
function hitEnemy(e, damage, color = '#ffffff') {
    const mult = (typeof player !== 'undefined' && player.damageMult) ? player.damageMult : 1.0;
    const finalDamage = damage * mult;
    e.hp -= finalDamage;
    e.flashTimer = 0.14;
    const rounded = Math.round(finalDamage);
    const floatColor = finalDamage >= 90 ? '#ff3838' : finalDamage >= 45 ? '#e67e22' : '#ffffff';
    spawnFloat(e.x, e.y - e.radius, `-${rounded}`, floatColor);
    spawnBurst(e.x, e.y, color, 6, 75, 3.5, 0.3);
    if (e.hp <= 0) killEnemy(e);
}

function killEnemy(e) {
    e.dead = true;
    if (typeof wave !== 'undefined') wave.kills++;
    player.mana = Math.min(player.maxMana, player.mana + 7);

    if (e.isBoss) {
        doShake(8.0, 0.5);
        spawnBurst(e.x, e.y, e.color, 45, 260, 7, 0.8);
        spawnBurst(e.x, e.y, '#f1c40f', 30, 200, 5, 0.6);
        spawnBurst(e.x, e.y, '#ffffff', 20, 140, 4, 0.4);

        spawnFloat(e.x, e.y - e.radius - 20, '🏆 BOSS DIKALAHKAN!', '#f1c40f', 3.0);

        // Spawn XP Gems explosion!
        if (typeof spawnXpGem === 'function') {
            for (let k = 0; k < 12; k++) {
                spawnXpGem(e.x + rng(-25, 25), e.y + rng(-25, 25), Math.floor((e.xpValue || 200) / 10));
            }
        }

        // Spawn Elemental Scroll Drop
        if (typeof spawnScroll === 'function' && e.bossElement) {
            spawnScroll(e.x, e.y, e.bossElement);
        }
    } else {
        spawnBurst(e.x, e.y, e.color, 18, 140, 5, 0.55);
        spawnBurst(e.x, e.y, '#ffffff', 8, 90, 3, 0.35);
        doShake(2.5, 0.12);

        // Spawn XP Gem drop at enemy position
        if (typeof spawnXpGem === 'function') {
            spawnXpGem(e.x, e.y, e.xpValue || 5);
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

        const movedDist = Math.hypot(e.x - (e.lastX || e.x), e.y - (e.lastY || e.y));
        e.lastX = e.x;
        e.lastY = e.y;

        if (movedDist < e.speed * dt * 0.25 && e.stunTimer <= 0) {
            e.stuckTimer = (e.stuckTimer || 0) + dt;
        } else {
            e.stuckTimer = Math.max(0, (e.stuckTimer || 0) - dt * 2.5);
        }

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
        e.angle = directAngle;

        if (e.isBoss) {
            // Boss Movement AI
            const d = dist(e, player);
            const preferDist = 180;
            const moveDir = d < preferDist ? -0.4 : (d > 260 ? 1 : 0.2);
            const spd = e.speed * e.slowFactor * (e.hp < e.maxHp * 0.35 ? 1.25 : 1.0);
            const moveDirAngle = moveDir < 0 ? moveAngle + Math.PI : moveAngle;
            const nx = e.x + (moveDir !== 0 ? Math.cos(moveDirAngle) * spd + e.vx : e.vx) * dt;
            const ny = e.y + (moveDir !== 0 ? Math.sin(moveDirAngle) * spd + e.vy : e.vy) * dt;
            wallSlide(e, nx, ny, e.radius);

            if (dist(e, player) < player.bodyRadius + e.radius + 3 && player.invincible <= 0) {
                damagePlayer(e.damage);
            }

            // Boss Skill Casting Cycle
            e.bossSkillTimer -= dt;
            if (e.bossSkillTimer <= 0) {
                const isEnraged = e.hp < e.maxHp * 0.35;
                e.bossSkillTimer = isEnraged ? rng(1.8, 2.5) : rng(2.6, 3.4);
                castBossSkill(e, directAngle);
            }
        } else if (e.type === 'wizard' && e.ranged) {
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

        // Push out of walls failsafe
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
