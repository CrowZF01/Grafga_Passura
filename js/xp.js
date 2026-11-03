// ============================================================
//  PASSURA: Elemental Arena — js/xp.js
//  XP Gems Drops, Homing Magnet, Level-Up Progression & Stats
// ============================================================

// ─── XP Gems Collection Array ────────────────────────────────
const xpGems = [];

// ─── Spawn XP Gem Drop ───────────────────────────────────────
function spawnXpGem(x, y, value = 5) {
    // Determine color, glow, and size by XP value tier
    let color = '#2ecc71'; // Default Emerald Green
    let glow = '#55efc4';
    let size = 5.5;

    if (value >= 20) {
        // High Tier: Golem (Amber Gold)
        color = '#f1c40f';
        glow = '#ffeaa7';
        size = 8.5;
    } else if (value >= 15) {
        // Medium-High Tier: Wizard (Amethyst Purple)
        color = '#9b59b6';
        glow = '#e056fd';
        size = 7.0;
    } else if (value >= 10) {
        // Medium Tier: Wraith (Sapphire Blue)
        color = '#0984e3';
        glow = '#74b9ff';
        size = 6.5;
    } else if (value >= 5) {
        // Common Tier: Goblin (Jade Green)
        color = '#1dd1a1';
        glow = '#55efc4';
        size = 6.0;
    }

    // Gentle pop impulse outward on death
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

        // 1. Damped pop velocity when landing
        g.vx *= Math.pow(0.04, dt);
        g.vy *= Math.pow(0.04, dt);
        g.x += g.vx * dt;
        g.y += g.vy * dt;

        // 2. Distance check to player
        const d = dist(g, p);

        // Trigger magnet attraction when within pickup range
        if (d < magnetRadius) {
            g.homing = true;
        }

        // Homing movement towards player
        if (g.homing) {
            const angle = Math.atan2(p.y - g.y, p.x - g.x);
            g.speed += dt * 680; // Accelerates as it flies towards player
            g.x += Math.cos(angle) * g.speed * dt;
            g.y += Math.sin(angle) * g.speed * dt;

            // Faint particle trail behind flying gem
            if (Math.random() < 0.35) {
                spawnParticle(g.x, g.y, rng(-15, 15), rng(-15, 15), g.color, 0.2, 2.5, 0, true);
            }
        }

        // 3. Collection collision
        if (d < p.bodyRadius + g.size + 4) {
            // Collect gem!
            addPlayerXp(g.value);
            spawnBurst(g.x, g.y, g.color, 7, 85, 2.8, 0.28);
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
    const required = player.nextXp || 20;

    // Check if player has enough XP to level up
    while (player.xp >= player.nextXp) {
        player.xp -= player.nextXp;
        player.level = (player.level || 1) + 1;

        // Scaling XP requirement for subsequent levels
        player.nextXp = Math.floor(20 * Math.pow(1.32, player.level - 1) + (player.level - 1) * 6);

        // Immediate stat improvements on level up
        player.maxHp += 5;
        player.hp = Math.min(player.maxHp, player.hp + 25); // Bonus heal
        player.maxMana += 5;
        player.mana = player.maxMana; // Fully replenish mana
        player.manaRegen += 1.2;
        player.pickupRadius = (player.pickupRadius || 105) + 5;

        // Celebratory visual and audio effects
        spawnFloat(player.x, player.y - player.bodyRadius - 26, `LEVEL UP! [LV. ${player.level}]`, '#f1c40f', 1.7);
        spawnBurst(player.x, player.y, '#f1c40f', 26, 170, 5, 0.65);
        spawnBurst(player.x, player.y, '#2ecc71', 18, 130, 4, 0.5);
        spawnBurst(player.x, player.y, '#ffffff', 10, 90, 3, 0.35);
        doShake(5.0, 0.25);
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

        // Outer Diamond
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3); // Top apex
        ctx.lineTo(r, 0);        // Right corner
        ctx.lineTo(0, r * 1.3);  // Bottom apex
        ctx.lineTo(-r, 0);       // Left corner
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top-left facet shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.3);
        ctx.lineTo(0, 0);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();

        // Sparkle glint dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-r * 0.25, -r * 0.35, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

