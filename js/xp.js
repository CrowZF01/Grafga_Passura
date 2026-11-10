// ============================================================
//  PASSURA: Elemental Arena — js/xp.js
//  XP Gems Drops, Homing Magnet, Level-Up Progression & 3-Card Upgrades
// ============================================================

// ─── XP Gems Collection Array ────────────────────────────────
const xpGems = [];

// ─── Level Up & Upgrade System State ─────────────────────────
let pendingLevelUps = 0;
let currentUpgradeCards = [];
let hoveredUpgradeCard = -1;

const UPGRADE_DEFINITIONS = {
    strength: {
        id: 'strength',
        name: 'Kekuatan Sihir',
        sub: 'Spell Power',
        category: 'SERANGAN',
        color: '#ff4757',
        glow: '#ff6b81',
        weight: 30,
        isRare: false,
        desc: 'Meningkatkan seluruh daya hancur mantra sihir sebesar +20%.',
        statPreview: () => {
            const cur = Math.round(((player.damageMult || 1) - 1) * 100);
            const next = Math.round(((player.damageMult || 1) + 0.20 - 1) * 100);
            return `Damage: +${cur}% ➔ +${next}%`;
        },
        apply: () => {
            player.damageMult = (player.damageMult || 1.0) + 0.20;
            player.upgradeLevels.strength = (player.upgradeLevels.strength || 0) + 1;
        }
    },
    speed: {
        id: 'speed',
        name: 'Kelincahan Gerak',
        sub: 'Movement Speed',
        category: 'MOBILITAS',
        color: '#2ed573',
        glow: '#7bed9f',
        weight: 30,
        isRare: false,
        desc: 'Meningkatkan kelincahan lari penyihir sebesar +24 pixel/detik.',
        statPreview: () => {
            const cur = Math.round(player.speed);
            const next = Math.round(player.speed + 24);
            return `Speed: ${cur} ➔ ${next} px/s`;
        },
        apply: () => {
            player.speed += 24;
            player.upgradeLevels.speed = (player.upgradeLevels.speed || 0) + 1;
        }
    },
    hp: {
        id: 'hp',
        name: 'Vitalitas Jiwa',
        sub: 'Max HP & Heal',
        category: 'PERTAHANAN',
        color: '#ff3838',
        glow: '#ff7675',
        weight: 30,
        isRare: false,
        desc: 'Menambah +30 Max HP dan langsung menyembuhkan 45 HP seketika.',
        statPreview: () => {
            const cur = Math.round(player.maxHp);
            const next = Math.round(player.maxHp + 30);
            return `Max HP: ${cur} ➔ ${next}`;
        },
        apply: () => {
            player.maxHp += 30;
            player.hp = Math.min(player.maxHp, player.hp + 45);
            player.upgradeLevels.hp = (player.upgradeLevels.hp || 0) + 1;
        }
    },
    mana: {
        id: 'mana',
        name: 'Kapasitas Mana',
        sub: 'Mana & Regenerasi',
        category: 'SIHIR',
        color: '#0984e3',
        glow: '#74b9ff',
        weight: 30,
        isRare: false,
        desc: 'Menambah +25 Max Mana serta memulihkan +2.5 Mana per detik.',
        statPreview: () => {
            const cur = Math.round(player.maxMana);
            const next = Math.round(player.maxMana + 25);
            return `Mana: ${cur} ➔ ${next} (+2.5/s)`;
        },
        apply: () => {
            player.maxMana += 25;
            player.mana = player.maxMana;
            player.manaRegen += 2.5;
            player.upgradeLevels.mana = (player.upgradeLevels.mana || 0) + 1;
        }
    },
    magnet: {
        id: 'magnet',
        name: 'Magnet Penarik',
        sub: 'Pickup Range',
        category: 'LANGKA',
        color: '#f1c40f',
        glow: '#00d2d3',
        weight: 6, // RARE! (Langka)
        isRare: true,
        desc: 'Menyedot XP Gems dan Gulungan dari jarak sangat jauh (+65px radius).',
        statPreview: () => {
            const cur = Math.round(player.pickupRadius || 105);
            const next = Math.round((player.pickupRadius || 105) + 65);
            return `Radius: ${cur}px ➔ ${next}px`;
        },
        apply: () => {
            player.pickupRadius = (player.pickupRadius || 105) + 65;
            player.upgradeLevels.magnet = (player.upgradeLevels.magnet || 0) + 1;
        }
    }
};

// ─── Weighted Random Card Sampler (3 Unique Cards) ───────────
function rollUpgradeCards() {
    const keys = ['strength', 'speed', 'hp', 'mana', 'magnet'];
    const chosen = [];
    const pool = [...keys];

    for (let i = 0; i < 3; i++) {
        if (pool.length === 0) break;
        const totalWeight = pool.reduce((sum, k) => sum + UPGRADE_DEFINITIONS[k].weight, 0);
        let r = Math.random() * totalWeight;
        for (let j = 0; j < pool.length; j++) {
            const k = pool[j];
            r -= UPGRADE_DEFINITIONS[k].weight;
            if (r <= 0 || j === pool.length - 1) {
                chosen.push(UPGRADE_DEFINITIONS[k]);
                pool.splice(j, 1);
                break;
            }
        }
    }
    return chosen;
}

function openUpgradeMenu() {
    currentUpgradeCards = rollUpgradeCards();
    hoveredUpgradeCard = -1;
    gameState = 'upgrade';

    // Clear all held keyboard keys and mouse clicks so player stops immediately
    if (typeof keys !== 'undefined') {
        for (const k in keys) keys[k] = false;
    }
    if (typeof mouse !== 'undefined') {
        mouse.leftPending = false;
        mouse.rightPending = false;
    }
    if (typeof player !== 'undefined') {
        player.isMoving = false;
    }
}

function selectUpgradeCard(index) {
    if (!currentUpgradeCards || !currentUpgradeCards[index]) return;
    const card = currentUpgradeCards[index];

    // Apply upgrade effect
    card.apply();

    // Sound / Float notification & celebratory VFX
    if (typeof spawnFloat === 'function') {
        spawnFloat(player.x, player.y - player.bodyRadius - 26, `+ ${card.name}!`, card.color, 2.0);
    }
    if (typeof spawnBurst === 'function') {
        spawnBurst(player.x, player.y, card.color, 30, 180, 5, 0.6);
        spawnBurst(player.x, player.y, '#ffffff', 16, 120, 3.5, 0.4);
    }
    if (typeof doShake === 'function') doShake(3.5, 0.15);

    pendingLevelUps = Math.max(0, pendingLevelUps - 1);

    if (pendingLevelUps > 0) {
        // More level-ups queued!
        currentUpgradeCards = rollUpgradeCards();
        hoveredUpgradeCard = -1;
    } else {
        // Finished all level ups, resume normal gameplay
        gameState = 'playing';
        currentUpgradeCards = [];
        hoveredUpgradeCard = -1;

        // Clear keys again when resuming so no leftover pressed keys persist
        if (typeof keys !== 'undefined') {
            for (const k in keys) keys[k] = false;
        }
        if (typeof mouse !== 'undefined') {
            mouse.leftPending = false;
            mouse.rightPending = false;
        }
        if (typeof canvas !== 'undefined') {
            canvas.style.cursor = 'crosshair';
        }
    }
}

function getUpgradeCardAtPos(mx, my) {
    const cardW = 220;
    const cardH = 320;
    const cardGap = 26;
    const totalW = 3 * cardW + 2 * cardGap;
    const startX = (BASE_W - totalW) / 2;
    const baseY = 110;

    for (let i = 0; i < currentUpgradeCards.length; i++) {
        const cx = startX + i * (cardW + cardGap);
        const cy = baseY - 12;
        if (mx >= cx && mx <= cx + cardW && my >= cy && my <= cy + cardH + 20) {
            return i;
        }
    }
    return -1;
}

// ─── Spawn XP Gem Drop ───────────────────────────────────────
function spawnXpGem(x, y, value = 5) {
    let color = '#2ecc71';
    let glow = '#55efc4';
    let size = 5.5;

    if (value >= 20) {
        color = '#f1c40f';
        glow = '#ffeaa7';
        size = 8.5;
    } else if (value >= 15) {
        color = '#9b59b6';
        glow = '#e056fd';
        size = 7.0;
    } else if (value >= 10) {
        color = '#0984e3';
        glow = '#74b9ff';
        size = 6.5;
    } else if (value >= 5) {
        color = '#1dd1a1';
        glow = '#55efc4';
        size = 6.0;
    }

    const popAngle = rng(0, Math.PI * 2);
    const popSpeed = rng(30, 95);

    xpGems.push({
        x, y,
        vx: Math.cos(popAngle) * popSpeed,
        vy: Math.sin(popAngle) * popSpeed,
        value,
        color,
        glow,
        size,
        bobPhase: rng(0, Math.PI * 2),
        homing: false,
        speed: 180,
    });
}

// ─── Update XP Gems & Magnet Homing ──────────────────────────
function updateXpGems(dt) {
    const p = player;
    const magnetRadius = p.pickupRadius || 105;

    for (let i = xpGems.length - 1; i >= 0; i--) {
        const g = xpGems[i];

        g.vx *= Math.pow(0.04, dt);
        g.vy *= Math.pow(0.04, dt);
        g.x += g.vx * dt;
        g.y += g.vy * dt;

        const d = dist(g, p);

        if (d < magnetRadius) {
            g.homing = true;
        }

        if (g.homing) {
            const angle = Math.atan2(p.y - g.y, p.x - g.x);
            g.speed += dt * 680;
            g.x += Math.cos(angle) * g.speed * dt;
            g.y += Math.sin(angle) * g.speed * dt;

            if (Math.random() < 0.35 && typeof spawnParticle === 'function') {
                spawnParticle(g.x, g.y, rng(-15, 15), rng(-15, 15), g.color, 0.2, 2.5, 0, true);
            }
        }

        if (d < p.bodyRadius + g.size + 4) {
            addPlayerXp(g.value);
            if (typeof spawnBurst === 'function') {
                spawnBurst(g.x, g.y, g.color, 7, 85, 2.8, 0.28);
            }
            if (typeof spawnFloat === 'function') {
                spawnFloat(g.x, g.y - 12, `+${g.value} XP`, g.color, 0.85);
            }
            xpGems.splice(i, 1);
        }
    }
}

// ─── Add XP & Handle Level Up ────────────────────────────────
function addPlayerXp(amount) {
    player.xp = (player.xp || 0) + amount;

    while (player.xp >= player.nextXp) {
        player.xp -= player.nextXp;
        player.level = (player.level || 1) + 1;

        // Scaling XP requirement for subsequent levels
        player.nextXp = Math.floor(20 * Math.pow(1.32, player.level - 1) + (player.level - 1) * 6);

        // Instant gentle recovery on level up
        player.hp = Math.min(player.maxHp, player.hp + 15);
        player.mana = player.maxMana;

        pendingLevelUps++;

        // Celebratory visual and audio effects
        if (typeof spawnFloat === 'function') {
            spawnFloat(player.x, player.y - player.bodyRadius - 26, `LEVEL UP! [LV. ${player.level}]`, '#f1c40f', 1.7);
        }
        if (typeof spawnBurst === 'function') {
            spawnBurst(player.x, player.y, '#f1c40f', 26, 170, 5, 0.65);
            spawnBurst(player.x, player.y, '#2ecc71', 18, 130, 4, 0.5);
            spawnBurst(player.x, player.y, '#ffffff', 10, 90, 3, 0.35);
        }
        if (typeof doShake === 'function') doShake(5.0, 0.25);
    }

    if (pendingLevelUps > 0 && gameState === 'playing') {
        openUpgradeMenu();
    }
}

// ─── Render XP Gems (World-Space) ────────────────────────────
function drawXpGems() {
    for (const g of xpGems) {
        const bob = Math.sin(Date.now() * 0.006 + g.bobPhase) * 2.5;
        const y = g.y + bob;
        const r = g.size;

        ctx.save();
        ctx.translate(g.x, y);

        // Drop shadow under gem
        ctx.save();
        ctx.scale(1, 0.45);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(0, r * 1.6, r * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Pulsing glow halo
        const glowAlpha = 0.25 + 0.15 * Math.sin(Date.now() * 0.008 + g.bobPhase);
        ctx.fillStyle = g.glow;
        ctx.globalAlpha = glowAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2);
        ctx.fill();

        // Faceted Diamond Rhombus Sprite
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 1.8;
        ctx.lineJoin = 'round';

        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r * 1.3);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.lineTo(0, 0);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.35, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
