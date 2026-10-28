// ============================================================
//  PASSURA: Elemental Arena — js/main.js
//  Game Initialization, State Transitions & Master Frame Loop
// ============================================================

// ─── Game State & Reset ──────────────────────────────────────
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
    puddles.length = 0;
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
    drawPuddles();
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

