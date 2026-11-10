// ============================================================
//  PASSURA: Elemental Arena — js/main.js
//  Game Initialization, State Transitions & Master Frame Loop
// ============================================================

// ─── Game State & Reset ──────────────────────────────────────
function startGame() {
    generateMap();
    player.x = WORLD_W / 2;
    player.y = WORLD_H / 2;
    player.maxHp = 100;
    player.maxMana = 100;
    player.manaRegen = 10;
    player.hp = player.maxHp;
    player.mana = player.maxMana;
    player.queue = [];
    player.castCooldown = 0;
    player.invincible = 0;
    player.level = 1;
    player.xp = 0;
    player.nextXp = 20;
    player.pickupRadius = 105;

    // Reset element unlocks: Only Element 1 (Api) is unlocked at the beginning!
    player.unlockedElements = { '1': true, '2': false, '3': false, '4': false };

    // Reset stats & upgrades
    player.damageMult = 1.0;
    player.upgradeLevels = { strength: 0, speed: 0, hp: 0, mana: 0, magnet: 0 };
    if (typeof pendingLevelUps !== 'undefined') pendingLevelUps = 0;
    if (typeof currentUpgradeCards !== 'undefined') currentUpgradeCards = [];
    if (typeof hoveredUpgradeCard !== 'undefined') hoveredUpgradeCard = -1;

    camera.x = player.x - BASE_W / 2;
    camera.y = player.y - BASE_H / 2;

    enemies.length = 0;
    spells.length = 0;
    puddles.length = 0;
    particles.length = 0;
    floats.length = 0;
    lightningFlashes.length = 0;
    enemyProjectiles.length = 0;
    if (typeof xpGems !== 'undefined') xpGems.length = 0;
    if (typeof scrolls !== 'undefined') scrolls.length = 0;
    if (typeof enemyHazards !== 'undefined') enemyHazards.length = 0;
    if (typeof activeUnlockBanner !== 'undefined') activeUnlockBanner = null;
    if (typeof spellCooldowns !== 'undefined') spellCooldowns.clear();
    if (typeof spellCooldownMax !== 'undefined') spellCooldownMax.clear();
    if (typeof recentReadySpells !== 'undefined') recentReadySpells.clear();

    wave.number = 0;
    wave.kills = 0;
    wave.toSpawn = [];
    wave.active = false;
    wave.bossWave = false;
    wave.bossType = null;
    wave.bossAlertTimer = 0;
    wave.waitingForScroll = false;
    wave.betweenWaveTimer = 1.0;

    gameState = 'playing';
}

// ─── Debug Helper for Testing Waves (e.g. jumpToWave(5)) ──────
window.jumpToWave = function(wn) {
    wave.number = wn - 1;
    wave.active = false;
    wave.betweenWaveTimer = 0.1;
    wave.toSpawn.length = 0;
    for (const e of enemies) e.dead = true;
    console.log(`[PASSURA] Jumping to Wave ${wn}...`);
};

// ─── Debug Helper for Testing Level Up (e.g. addXp(50)) ───────
window.addXp = function(amount = 50) {
    if (typeof addPlayerXp === 'function') {
        addPlayerXp(amount);
        console.log(`[PASSURA] Added ${amount} XP. Level: ${player.level}`);
    }
};

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

    if (gameState === 'upgrade') {
        // Draw World in background (paused)
        ctx.save();
        ctx.translate(shake.x - Math.round(camera.x), shake.y - Math.round(camera.y));
        drawMap();
        drawPuddles();
        if (typeof drawEnemyHazards === 'function') drawEnemyHazards();
        if (typeof drawXpGems === 'function') drawXpGems();
        if (typeof drawScrolls === 'function') drawScrolls();
        drawParticles();
        drawEnemyProjectiles();
        drawSpells();
        drawLightningFlashes();
        drawEnemies();
        drawPlayer();
        drawFloats();
        ctx.restore();

        // Draw HUD behind upgrade overlay
        drawHUD();

        // Draw 3-Card Roguelike Upgrade Screen
        if (typeof drawUpgradeScreen === 'function') {
            drawUpgradeScreen();
        }

        requestAnimationFrame(loop);
        return;
    }

    // ── UPDATE ──
    updateShake(dt);
    updatePlayer(dt);
    camera.update(dt);
    updateEnemies(dt);
    if (typeof updateXpGems === 'function') updateXpGems(dt);
    if (typeof updateScrolls === 'function') updateScrolls(dt);
    if (typeof updateEnemyHazards === 'function') updateEnemyHazards(dt);
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
    drawPuddles();
    if (typeof drawEnemyHazards === 'function') drawEnemyHazards();
    if (typeof drawXpGems === 'function') drawXpGems();
    if (typeof drawScrolls === 'function') drawScrolls();
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
