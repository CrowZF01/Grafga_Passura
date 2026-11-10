// ============================================================
//  PASSURA: Elemental Arena — js/wave.js
//  Wave Progression, Boss Spawning & Safe Placement
// ============================================================

// ─── Wave Management State ───────────────────────────────────
const wave = {
    number: 0,
    kills: 0,
    toSpawn: [],
    spawnTimer: 0,
    spawnInterval: 1.1,
    betweenWaveTimer: 0,
    betweenWaveMax: 3.5,
    active: false,
    bossWave: false,
    bossType: null,
    bossAlertTimer: 0,
    waitingForScroll: false,
};

// ─── Procedural Wave Composition ─────────────────────────────
function buildWave(wn) {
    const list = [];
    const isBoss = (wn > 0 && wn % 5 === 0);

    if (isBoss) {
        wave.bossWave = true;
        if (wn === 5) wave.bossType = 'boss_water';
        else if (wn === 10) wave.bossType = 'boss_earth';
        else if (wn === 15) wave.bossType = 'boss_lightning';
        else {
            const cycle = ['boss_water', 'boss_earth', 'boss_lightning'];
            wave.bossType = cycle[Math.floor(wn / 5) % 3];
        }

        // Minions for boss wave (focused escort squad)
        const goblins = Math.min(4 + Math.floor(wn / 4), 10);
        const skeletons = Math.min(Math.floor(wn / 3), 6);
        const wizards = Math.min(Math.floor(wn / 10), 3);

        for (let i = 0; i < goblins; i++) list.push('goblin');
        for (let i = 0; i < skeletons; i++) list.push('skeleton');
        for (let i = 0; i < wizards; i++) list.push('wizard');
    } else {
        wave.bossWave = false;
        wave.bossType = null;

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
    }

    // Shuffle minions
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    wave.toSpawn = list;
}

// ─── Safe Floor Placement for Spawning ───────────────────────
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

// ─── Wave Transition & Trigger ───────────────────────────────
function startNextWave() {
    wave.number++;
    wave.kills = 0;
    wave.waitingForScroll = false;
    buildWave(wave.number);
    wave.active = true;
    wave.spawnTimer = 0;
    wave.betweenWaveTimer = 0;

    // If it's a Boss wave, spawn the boss immediately!
    if (wave.bossWave && wave.bossType) {
        wave.bossAlertTimer = 3.5;
        const pos = getSpawnPos(wave.bossType);
        spawnEnemy(wave.bossType, pos.x, pos.y);
        doShake(6.5, 0.45);
    }
}

// ─── Wave Update Tick ────────────────────────────────────────
function updateWave(dt) {
    if (wave.bossAlertTimer > 0) {
        wave.bossAlertTimer -= dt;
    }

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
        // If there are uncollected scrolls on the ground, wait for player to pick it up!
        const hasUncollectedScroll = (typeof scrolls !== 'undefined' && scrolls.some(s => !s.collected));
        if (hasUncollectedScroll) {
            wave.waitingForScroll = true;
            return;
        }

        wave.waitingForScroll = false;
        wave.active = false;
        wave.betweenWaveTimer = wave.betweenWaveMax;
        player.hp = Math.min(player.maxHp, player.hp + 30);
        player.mana = player.maxMana;
    }
}
