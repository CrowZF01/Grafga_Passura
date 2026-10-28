// ============================================================
//  PASSURA: Elemental Arena — js/spells.js
//  Spell Recipes (33 Distinct Modes), Casting, Physics & VFX
// ============================================================

// ─── Spell Recipes & Combinations ───────────────────────────
const RECIPES = {
    // ── Single Element (Tier 1) ──
    '1': { name: 'Fireball', mode: 'single_shot', speed: 390, damage: 34, radius: 13, visual: 'fire', color: '#ff4757', glow: '#ffa502', hitRadius: 30, desc: 'Bola api meluncur dengan ekor bara panas' },
    '2': { name: 'Aqua Shot', mode: 'multishot_cone', count: 3, spread: 0.38, speed: 420, damage: 20, radius: 10, visual: 'water', color: '#00a8ff', glow: '#4cd137', hitRadius: 24, knockback: 140, desc: 'Tembakan 3 tetesan air menyebar ke depan' },
    '3': { name: 'Stone Spike', mode: 'single_shot', speed: 410, damage: 52, radius: 14, visual: 'stone', color: '#b7791f', glow: '#e1b12c', hitRadius: 28, pierce: true, desc: 'Paku batu berputar menembus barisan musuh' },
    '4': { name: 'Spark', mode: 'bouncing_bolt', bounces: 4, speed: 530, damage: 24, radius: 9, visual: 'spark', color: '#9b59b6', glow: '#e056fd', hitRadius: 22, desc: 'Kilat listrik cepat yang memantul di dinding' },

    // ── Two Elements (Tier 2) ──
    '11': { name: 'Flame Burst', mode: 'cluster_bomb', speed: 340, damage: 60, radius: 16, visual: 'flame_burst', color: '#ff3838', glow: '#ff9f43', hitRadius: 36, aoe: 65, desc: 'Bom api yang pecah menjadi 4 bom mini saat benturan' },
    '12': { name: 'Steam Blast', mode: 'steam_cone', damage: 45, radius: 85, visual: 'steam', color: '#dfe6e9', glow: '#b2bec3', desc: 'Semburan kerucut uap mendidih di depan penyihir' },
    '13': { name: 'Magma Ball', mode: 'magma_dripper', speed: 250, damage: 78, radius: 19, visual: 'magma', color: '#d63031', glow: '#ff7675', hitRadius: 40, burn: true, desc: 'Bola magma berlapis yang meneteskan genangan lahar di lantai' },
    '14': { name: 'Thunder Fire', mode: 'helix_twins', speed: 380, damage: 56, radius: 12, visual: 'thunder_fire', color: '#ff793f', glow: '#a29bfe', hitRadius: 30, desc: 'Sepasang bola api & petir berputar melingkar seperti DNA' },
    '22': { name: 'Tidal Wave', mode: 'tsunami_wall', speed: 280, damage: 44, radius: 110, visual: 'wave', color: '#0984e3', glow: '#74b9ff', knockback: 260, desc: 'Dinding ombak tsunami besar menyapu dan memukul mundur musuh' },
    '23': { name: 'Mud Glob', mode: 'ground_trap', speed: 280, damage: 38, radius: 15, visual: 'mud', color: '#6d4c41', glow: '#8d6e63', hitRadius: 32, slow: 0.70, desc: 'Gumpalan lumpur yang menciptakan kubangan lengket pelemah musuh' },
    '24': { name: 'Shock Current', mode: 'single_shot', speed: 450, damage: 48, radius: 11, visual: 'shock_water', color: '#00d2d3', glow: '#9b59b6', hitRadius: 26, chain: 4, desc: 'Aliran air terestrial beraliran listrik kejut ke 4 target' },
    '33': { name: 'Boulder Toss', mode: 'single_shot', speed: 210, damage: 100, radius: 22, visual: 'boulder', color: '#795548', glow: '#d7ccc8', hitRadius: 46, pierce: true, desc: 'Batu raksasa bergulir melindas segalanya dalam garis lurus' },
    '34': { name: 'Volt Spike', mode: 'electric_pylon', damage: 42, radius: 16, visual: 'volt_spike', color: '#a29bfe', glow: '#fdcb6e', desc: 'Menancapkan pilar batu berpetir yang berdenyut gelombang kejut' },
    '44': { name: 'Chain Lightning', mode: 'chain_lightning', damage: 65, radius: 140, chain: 7, visual: 'lightning', color: '#a29bfe', glow: '#6c5ce7', desc: 'Pohon petir ungu bercabang menyengat kawanan musuh seketika' },

    // ── Three Elements (Tier 3) ──
    '113': { name: 'Meteor Strike', mode: 'sky_meteor', damage: 150, aoe: 95, visual: 'meteor', color: '#c0392b', glow: '#ff793f', desc: 'Membidik tanah dengan kursor & memanggil meteor jatuh dari langit!' },
    '114': { name: 'Plasma Bolt', mode: 'death_ray', damage: 105, visual: 'plasma', color: '#ff3838', glow: '#e056fd', desc: 'Laser kematian plasma instan yang menembus sepanjang layar' },
    '112': { name: 'Fire Storm', mode: 'moving_vortex', damage: 75, visual: 'fire_storm', color: '#ff4757', glow: '#ff9f43', desc: 'Pusaran tornado api yang menyedot dan membakar musuh' },
    '123': { name: 'Lava Splash', mode: 'lava_mortar', damage: 65, visual: 'lava', color: '#d63031', glow: '#e17055', desc: 'Melontarkan 4 gumpalan lahar yang pecah menjadi kolam membara' },
    '124': { name: 'Tempest', mode: 'moving_vortex', damage: 60, visual: 'tempest', color: '#74b9ff', glow: '#e056fd', knockback: 200, desc: 'Badai topan puyuh bercampur sengatan petir liar' },
    '134': { name: 'Volcano Burst', mode: 'radial_nova', count: 8, damage: 88, visual: 'volcano', color: '#c0392b', glow: '#f39c12', desc: 'Erupsi gunung berapi memuntahkan 8 serpihan lahar ke segala arah' },
    '224': { name: 'Thunder Rain', mode: 'storm_cloud', damage: 55, radius: 80, visual: 'thunder_rain', color: '#0984e3', glow: '#a29bfe', desc: 'Menciptakan awan mendung di kursor yang menghujani petir terus-menerus' },
    '223': { name: 'Flash Flood', mode: 'tsunami_wall', speed: 350, damage: 50, radius: 120, visual: 'flood', color: '#00cec9', glow: '#0984e3', knockback: 300, desc: 'Banjir bandang kilat yang menerjang dan menghempaskan musuh' },
    '234': { name: 'Storm Spike', mode: 'homing_shards', damage: 85, visual: 'storm_spike', color: '#2d3436', glow: '#a29bfe', desc: 'Menembakkan 4 belati badai yang berbelok mengejar musuh terdekat' },
    '334': { name: 'Golem Fist', mode: 'rocket_fist', damage: 170, radius: 26, visual: 'golem_fist', color: '#576574', glow: '#feca57', stun: 2.0, desc: 'Tinju raksasa batu meluncur kencang memukul musuh hingga mental' },
    '133': { name: 'Inferno Rock', mode: 'single_shot', speed: 220, damage: 130, radius: 22, visual: 'inferno_rock', color: '#b71540', glow: '#ff793f', hitRadius: 48, burn: true, aoe: 75, desc: 'Batu pijar membara dengan jejak api panas di tanah' },
    '233': { name: 'Mudslide', mode: 'tsunami_wall', speed: 240, damage: 68, visual: 'mudslide', color: '#4b2810', glow: '#8d6e63', knockback: 180, desc: 'Longsoran tanah dan lumpur tebal yang meredam laju musuh' },
    '344': { name: 'Thunder Clap', mode: 'sonic_shockwave', damage: 78, radius: 95, visual: 'thunder_clap', color: '#8e44ad', glow: '#f1c40f', stun: 1.0, desc: 'Hentakan gelombang suara petir yang mengguncang dan melumpuhkan' },
    '144': { name: 'Arc Flash', mode: 'multishot_cone', count: 5, spread: 0.6, speed: 450, damage: 70, visual: 'arc_flash', color: '#ff4757', glow: '#a29bfe', desc: 'Tembakan shotgun 5 cabang kilatan petir berapi' },
    '244': { name: 'Electric Storm', mode: 'orbiting_shield', damage: 65, visual: 'electric_storm', color: '#0984e3', glow: '#e056fd', desc: 'Menciptakan 3 bola pelindung berputar di sekitar penyihir selama 4.5s' },
    '111': { name: 'Sun Flare', mode: 'radial_nova', count: 8, damage: 115, visual: 'sun_flare', color: '#fed330', glow: '#fa8231', aoe: 110, desc: 'Ledakan surya menyilaukan yang melepaskan 8 suar api ke 8 arah' },
    '222': { name: 'Ocean Surge', mode: 'expanding_tsunami_rings', damage: 70, radius: 150, visual: 'ocean_surge', color: '#0984e3', glow: '#00d2d3', knockback: 340, desc: 'Tiga cincin ombak samudra purba yang bergelombang berturut-turut' },
    '333': { name: 'Earthquake', mode: 'fissure_crack', damage: 100, visual: 'earthquake', color: '#3d1f05', glow: '#d69e2e', stun: 1.8, desc: 'Membelah tanah dengan retakan gempa besar yang meremukkan musuh' },
    '444': { name: 'Thunderstorm', mode: 'heavens_wrath', damage: 90, visual: 'thunderstorm', color: '#6c5ce7', glow: '#fd79a8', desc: 'Hujan badai petir tiada henti menyambar 14 titik di arena' },
};

function getSpell(queue) {
    if (!queue.length) return null;
    const key = [...queue].sort().join('');
    return RECIPES[key] || RECIPES[queue[0]] || null;
}


// ─── Ground Hazard Puddles ──────────────────────────────────
const puddles = [];
function spawnPuddle(x, y, radius, type, duration, damage = 8, slow = 0) {
    puddles.push({
        x, y, radius, type,
        duration, maxDuration: duration,
        damage, slow, tickTimer: 0
    });
}
function updatePuddles(dt) {
    for (let i = puddles.length - 1; i >= 0; i--) {
        const p = puddles[i];
        p.duration -= dt;
        p.tickTimer -= dt;
        if (p.tickTimer <= 0) {
            p.tickTimer = 0.3;
            for (const e of enemies) {
                if (e.dead) continue;
                if (dist(p, e) < p.radius + e.radius) {
                    hitEnemy(e, p.damage, p.type === 'lava' ? '#ff4757' : '#8d6e63');
                    if (p.type === 'lava') e.burnTimer = Math.max(e.burnTimer, 2.5);
                    if (p.slow > 0) {
                        e.slowTimer = Math.max(e.slowTimer, 0.6);
                        e.slowFactor = Math.min(e.slowFactor, 1 - p.slow);
                    }
                }
            }
        }
        if (p.duration <= 0) puddles.splice(i, 1);
    }
}
function drawPuddles() {
    for (const p of puddles) {
        const alpha = clamp(p.duration / p.maxDuration * 1.5, 0, 0.85);
        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.type === 'lava') {
            ctx.fillStyle = '#ff3838';
            ctx.strokeStyle = '#ff9f43';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.7, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.radius * 0.5, p.radius * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#4b2810';
            ctx.strokeStyle = '#2d1505';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.radius, p.radius * 0.7, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }
        ctx.restore();
    }
}

// ─── Player Spells (Every Combo Has A Unique Output Form) ────

// ─── Active Spells & Casting System ─────────────────────────
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

    executeSpell(spell, type);

    player.queue = [];
    player.castCooldown = player.castCooldownMax;
}

function launchSingleProjectile(spell, x, y, angle) {
    const p = {
        kind: 'projectile',
        x, y, angle,
        speed: spell.speed || 380,
        damage: spell.damage,
        radius: spell.radius || 12,
        hitRadius: spell.hitRadius || (spell.radius ? spell.radius * 2 : 24),
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
        bounces: 0,
        isCluster: false,
        dripLava: false,
        dripTimer: 0,
        trapType: null,
    };
    spells.push(p);
    return p;
}

function launchHelixProjectile(spell, x, y, baseAngle, phaseOffset, orbColor) {
    spells.push({
        kind: 'helix',
        forwardX: x, forwardY: y,
        x, y,
        baseAngle,
        helixPhase: phaseOffset,
        speed: spell.speed || 380,
        damage: spell.damage * 0.6,
        radius: spell.radius || 11,
        hitRadius: 26,
        visual: 'helix_orb',
        color: orbColor,
        glow: spell.glow,
        life: 3.5,
        hit: new Set(),
        trail: [],
        animTime: 0,
    });
}

function fireDeathRay(startX, startY, angle, length, damage, color, glow) {
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    // Hit all enemies along the line
    for (const e of enemies) {
        if (e.dead) continue;
        const d = distToSegment({ x: e.x, y: e.y }, { x: startX, y: startY }, { x: endX, y: endY });
        if (d < e.radius + 16) {
            hitEnemy(e, damage, color);
            spawnBurst(e.x, e.y, color, 8, 100, 4, 0.35);
        }
    }

    spells.push({
        kind: 'death_ray',
        startX, startY, endX, endY,
        angle, length,
        color, glow,
        duration: 0.28, maxDuration: 0.28,
    });
}

function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

function executeSpell(spell, castType) {
    const mouseAngle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const targetX = mouse.x;
    const targetY = mouse.y;
    const wandDist = player.bodyRadius + 16;
    const wandX = player.x + Math.cos(mouseAngle) * wandDist;
    const wandY = player.y + Math.sin(mouseAngle) * wandDist;

    switch (spell.mode) {
        case 'single_shot':
            launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            doShake(2.5, 0.08);
            spawnBurst(wandX, wandY, spell.glow, 6, 80, 4, 0.3);
            break;

        case 'multishot_cone': {
            const count = spell.count || 3;
            const spread = spell.spread || 0.45;
            const startA = mouseAngle - spread / 2;
            const stepA = spread / (count - 1);
            for (let i = 0; i < count; i++) {
                launchSingleProjectile(spell, wandX, wandY, startA + i * stepA);
            }
            doShake(3, 0.1);
            spawnBurst(wandX, wandY, spell.glow, 10, 110, 4, 0.35);
            break;
        }

        case 'bouncing_bolt': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.bounces = spell.bounces || 4;
            doShake(2, 0.08);
            break;
        }

        case 'cluster_bomb': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.isCluster = true;
            p.clusterCount = 4;
            doShake(3, 0.1);
            break;
        }

        case 'steam_cone':
            spells.push({
                kind: 'steam_cone',
                duration: 0.85, maxDuration: 0.85,
                angle: mouseAngle,
                damage: spell.damage,
                color: spell.color,
                tickTimer: 0,
            });
            doShake(2.5, 0.15);
            break;

        case 'magma_dripper': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.dripLava = true;
            p.dripTimer = 0;
            doShake(3, 0.1);
            break;
        }

        case 'helix_twins':
            launchHelixProjectile(spell, wandX, wandY, mouseAngle, 0, '#ff4757');
            launchHelixProjectile(spell, wandX, wandY, mouseAngle, Math.PI, '#a29bfe');
            doShake(3, 0.1);
            break;

        case 'tsunami_wall':
            spells.push({
                kind: 'tsunami_wall',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: spell.speed || 300,
                width: 140, height: 35,
                damage: spell.damage,
                knockback: spell.knockback || 260,
                color: spell.color, glow: spell.glow,
                visual: spell.visual,
                life: 1.8,
                hit: new Set(),
            });
            doShake(4.5, 0.18);
            break;

        case 'ground_trap': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.trapType = 'mud';
            doShake(2.5, 0.08);
            break;
        }

        case 'death_ray':
            fireDeathRay(player.x, player.y, mouseAngle, 850, spell.damage, spell.color, spell.glow);
            doShake(5.5, 0.2);
            break;

        case 'sky_meteor':
            spells.push({
                kind: 'sky_meteor',
                targetX, targetY,
                damage: spell.damage,
                aoe: spell.aoe || 95,
                color: spell.color, glow: spell.glow,
                progress: 0,
                duration: 0.42,
            });
            doShake(3, 0.1);
            break;

        case 'moving_vortex':
            spells.push({
                kind: 'moving_vortex',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: 150,
                radius: 65,
                damage: spell.damage,
                color: spell.color, glow: spell.glow,
                visual: spell.visual,
                life: 3.2,
                tickTimer: 0,
            });
            doShake(3.5, 0.15);
            break;

        case 'radial_nova': {
            const count = spell.count || 8;
            for (let i = 0; i < count; i++) {
                const a = (i / count) * Math.PI * 2;
                launchSingleProjectile(spell, player.x, player.y, a);
            }
            doShake(5, 0.22);
            break;
        }

        case 'lava_mortar':
            for (let i = 0; i < 4; i++) {
                const spreadA = mouseAngle + rng(-0.55, 0.55);
                const p = launchSingleProjectile(spell, wandX, wandY, spreadA);
                p.speed *= rng(0.75, 1.25);
                p.life = rng(0.5, 0.9);
                p.trapType = 'lava';
            }
            doShake(3.5, 0.12);
            break;

        case 'storm_cloud':
            spells.push({
                kind: 'storm_cloud',
                x: targetX, y: targetY,
                radius: 80,
                duration: 3.5,
                damage: spell.damage,
                tickTimer: 0,
            });
            doShake(3, 0.15);
            break;

        case 'homing_shards': {
            const count = 4;
            for (let i = 0; i < count; i++) {
                const a = mouseAngle + (i - 1.5) * 0.35;
                spells.push({
                    kind: 'homing_shard',
                    x: wandX, y: wandY,
                    angle: a,
                    speed: 350,
                    damage: spell.damage,
                    radius: 12,
                    color: spell.color, glow: spell.glow,
                    life: 3.5,
                    hit: new Set(),
                    trail: [],
                });
            }
            doShake(3, 0.1);
            break;
        }

        case 'fissure_crack':
            spells.push({
                kind: 'fissure_crack',
                startX: player.x, startY: player.y,
                angle: mouseAngle,
                length: 340,
                damage: spell.damage,
                stun: spell.stun || 1.8,
                progress: 0,
                duration: 0.65,
                hit: new Set(),
            });
            doShake(4.5, 0.25);
            break;

        case 'rocket_fist':
            spells.push({
                kind: 'rocket_fist',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: 480,
                radius: 28,
                damage: spell.damage,
                knockback: 350,
                stun: 2.0,
                life: 1.4,
                hit: new Set(),
                trail: [],
            });
            doShake(5.5, 0.22);
            break;

        case 'orbiting_shield': {
            // Remove previous shields & summon 3 new ones
            for (let i = spells.length - 1; i >= 0; i--) {
                if (spells[i].kind === 'orbiting_shield') spells.splice(i, 1);
            }
            const count = 3;
            for (let i = 0; i < count; i++) {
                spells.push({
                    kind: 'orbiting_shield',
                    orbitIndex: i,
                    totalOrbits: count,
                    radius: 14,
                    damage: spell.damage,
                    color: spell.color, glow: spell.glow,
                    duration: 4.5,
                    maxDuration: 4.5,
                    hitCooldowns: new Map(),
                });
            }
            doShake(3, 0.1);
            break;
        }

        case 'electric_pylon':
            spells.push({
                kind: 'electric_pylon',
                x: targetX, y: targetY,
                radius: 18,
                pulseRadius: 110,
                duration: 4.0,
                damage: spell.damage,
                pulseTimer: 0.3,
            });
            doShake(3, 0.12);
            break;

        case 'chain_lightning':
            doChainLightning(player.x, player.y, 280, spell.chain || 7, spell.damage, spell.glow, new Set());
            doShake(4, 0.15);
            break;

        case 'heavens_wrath':
            spells.push({
                kind: 'heavens_wrath',
                duration: 2.6,
                strikeTimer: 0.1,
                damage: spell.damage,
                color: spell.color, glow: spell.glow,
            });
            doShake(5.5, 0.3);
            break;

        case 'expanding_tsunami_rings':
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    spells.push({
                        kind: 'area',
                        x: player.x, y: player.y,
                        damage: spell.damage * 0.7,
                        radius: 0, maxRadius: (spell.radius || 150) * (0.8 + i * 0.2),
                        visual: 'ocean_surge',
                        color: spell.color, glow: spell.glow,
                        duration: 0.7, maxDuration: 0.7,
                        knockback: spell.knockback || 300,
                        hit: new Set(),
                    });
                    doShake(3.5, 0.12);
                }, i * 220);
            }
            break;

        case 'sonic_shockwave':
        default:
            triggerArea(spell);
            break;
    }
}

function triggerArea(spell) {
    spells.push({
        kind: 'area',
        x: player.x, y: player.y,
        damage: spell.damage,
        radius: 0,
        maxRadius: spell.radius || 100,
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
    // Update ground puddles
    updatePuddles(dt);

    for (let i = spells.length - 1; i >= 0; i--) {
        const s = spells[i];
        s.animTime = (s.animTime || 0) + dt;

        // ── 1. Standard / Bouncing / Cluster / Dripper Projectiles ──
        if (s.kind === 'projectile') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 10) s.trail.shift();

            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            // Magma dripper leaves lava puddles on ground
            if (s.dripLava) {
                s.dripTimer += dt;
                if (s.dripTimer >= 0.18) {
                    s.dripTimer = 0;
                    spawnPuddle(s.x, s.y, 16, 'lava', 3.5, 7);
                }
            }

            // Wall Collision
            if (isWall(s.x, s.y)) {
                if (s.bounces > 0) {
                    s.bounces--;
                    // Bounce angle inversion
                    const prevX = s.x - Math.cos(s.angle) * s.speed * dt;
                    const prevY = s.y - Math.sin(s.angle) * s.speed * dt;
                    if (isWall(s.x, prevY)) s.angle = Math.PI - s.angle;
                    else s.angle = -s.angle;
                    spawnBurst(s.x, s.y, s.glow, 6, 90, 3, 0.25);
                } else {
                    explodeSpell(s);
                    spells.splice(i, 1);
                    continue;
                }
            }

            // Hit Enemies
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

            if (s.life <= 0) {
                if (s.trapType) {
                    spawnPuddle(s.x, s.y, 28, s.trapType, 5.0, 9, s.trapType === 'mud' ? 0.7 : 0);
                }
                spells.splice(i, 1);
                continue;
            }

            // Trail particles
            if (Math.random() < 0.4) {
                spawnParticle(s.x + rng(-3, 3), s.y + rng(-3, 3), rng(-20, 20), rng(-20, 20), s.glow, 0.25, rng(2, 5));
            }

        // ── 2. DNA Helix Projectiles ──
        } else if (s.kind === 'helix') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 8) s.trail.shift();

            s.forwardX += Math.cos(s.baseAngle) * s.speed * dt;
            s.forwardY += Math.sin(s.baseAngle) * s.speed * dt;
            s.helixPhase += dt * 14;
            const perp = s.baseAngle + Math.PI / 2;
            const offset = Math.sin(s.helixPhase) * 16;
            s.x = s.forwardX + Math.cos(perp) * offset;
            s.y = s.forwardY + Math.sin(perp) * offset;
            s.life -= dt;

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + 14) {
                    hitEnemy(e, s.damage, s.color);
                    s.hit.add(e.id);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.color, 6, 80, 3, 0.25);
                spells.splice(i, 1);
                continue;
            }

        // ── 3. Tsunami Advancing Wall ──
        } else if (s.kind === 'tsunami_wall') {
            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.width * 0.45 + e.radius) {
                    hitEnemy(e, s.damage, s.color);
                    e.vx += Math.cos(s.angle) * s.knockback;
                    e.vy += Math.sin(s.angle) * s.knockback;
                    s.hit.add(e.id);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.color, 12, 100, 5, 0.4);
                spells.splice(i, 1);
                continue;
            }

        // ── 4. Steam Cone (Frontal Flamethrower) ──
        } else if (s.kind === 'steam_cone') {
            s.duration -= dt;
            s.tickTimer -= dt;
            const wandA = player.angle;
            const wandTipX = player.x + Math.cos(wandA) * 26;
            const wandTipY = player.y + Math.sin(wandA) * 26;

            // Spawn steam clouds
            for (let k = 0; k < 3; k++) {
                const spreadA = wandA + rng(-0.55, 0.55);
                const spd = rng(160, 280);
                spawnParticle(wandTipX, wandTipY, Math.cos(spreadA) * spd, Math.sin(spreadA) * spd, '#dfe6e9', rng(0.2, 0.45), rng(6, 14), 0, true);
            }

            if (s.tickTimer <= 0) {
                s.tickTimer = 0.15;
                for (const e of enemies) {
                    if (e.dead) continue;
                    const d = dist(player, e);
                    if (d < 140) {
                        const angToEnemy = Math.atan2(e.y - player.y, e.x - player.x);
                        let diff = Math.abs(angToEnemy - wandA);
                        if (diff > Math.PI) diff = Math.PI * 2 - diff;
                        if (diff < 0.6) {
                            hitEnemy(e, s.damage * 0.35, '#dfe6e9');
                            e.vx += Math.cos(wandA) * 120;
                            e.vy += Math.sin(wandA) * 120;
                        }
                    }
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 5. Death Ray Laser Beam ──
        } else if (s.kind === 'death_ray') {
            s.duration -= dt;
            if (s.duration <= 0) spells.splice(i, 1);

        // ── 6. Sky Strike Meteor ──
        } else if (s.kind === 'sky_meteor') {
            s.progress += dt / s.duration;
            if (s.progress >= 1) {
                // Detonation
                doShake(6, 0.25);
                spawnBurst(s.targetX, s.targetY, '#c0392b', 24, 220, 8, 0.65);
                spawnBurst(s.targetX, s.targetY, '#f1c40f', 16, 160, 5, 0.4);
                spawnPuddle(s.targetX, s.targetY, 32, 'lava', 4.5, 12);

                for (const e of enemies) {
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - s.targetX, e.y - s.targetY);
                    if (d < s.aoe + e.radius) {
                        hitEnemy(e, s.damage, s.color);
                        e.burnTimer = 3.5;
                        const a = Math.atan2(e.y - s.targetY, e.x - s.targetX);
                        e.vx += Math.cos(a) * 220;
                        e.vy += Math.sin(a) * 220;
                    }
                }
                spells.splice(i, 1);
            }

        // ── 7. Moving Vortex (Fire Storm & Tempest) ──
        } else if (s.kind === 'moving_vortex') {
            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;
            s.tickTimer -= dt;

            // Pull enemies into vortex
            for (const e of enemies) {
                if (e.dead) continue;
                const d = dist(s, e);
                if (d < s.radius * 1.6) {
                    const a = Math.atan2(s.y - e.y, s.x - e.x);
                    e.vx += Math.cos(a) * 90;
                    e.vy += Math.sin(a) * 90;
                }
            }

            if (s.tickTimer <= 0) {
                s.tickTimer = 0.22;
                for (const e of enemies) {
                    if (e.dead) continue;
                    if (dist(s, e) < s.radius + e.radius) {
                        hitEnemy(e, s.damage * 0.3, s.color);
                    }
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) spells.splice(i, 1);

        // ── 8. Storm Rain Cloud ──
        } else if (s.kind === 'storm_cloud') {
            s.duration -= dt;
            s.tickTimer -= dt;

            if (Math.random() < 0.6) {
                const rx = s.x + rng(-s.radius * 0.7, s.radius * 0.7);
                const ry = s.y + rng(-15, 15);
                spawnParticle(rx, ry, rng(-10, 10), rng(80, 140), '#74b9ff', 0.25, 2);
            }

            if (s.tickTimer <= 0) {
                s.tickTimer = 0.28;
                for (const e of enemies) {
                    if (e.dead) continue;
                    if (dist(s, e) < s.radius + e.radius) {
                        hitEnemy(e, s.damage * 0.35, '#a29bfe');
                        lightningFlashes.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, color: '#a29bfe', life: 0.12, maxLife: 0.12 });
                    }
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 9. Homing Storm Shards ──
        } else if (s.kind === 'homing_shard') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 8) s.trail.shift();

            // Find nearest alive enemy
            let nearest = null, nd = 350;
            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                const d = dist(s, e);
                if (d < nd) { nd = d; nearest = e; }
            }

            if (nearest) {
                const targetA = Math.atan2(nearest.y - s.y, nearest.x - s.x);
                let diff = targetA - s.angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                s.angle += Math.sign(diff) * Math.min(Math.abs(diff), dt * 7);
            }

            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            let hit = false;
            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.radius) {
                    hitEnemy(e, s.damage, s.color);
                    s.hit.add(e.id);
                    hit = true; break;
                }
            }

            if (hit || s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.glow, 6, 80, 3, 0.25);
                spells.splice(i, 1);
            }

        // ── 10. Fissure Ground Crack ──
        } else if (s.kind === 'fissure_crack') {
            s.progress += dt / s.duration;
            const currentLen = s.length * Math.min(1, s.progress * 1.5);

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                const endX = s.startX + Math.cos(s.angle) * currentLen;
                const endY = s.startY + Math.sin(s.angle) * currentLen;
                const d = distToSegment({ x: e.x, y: e.y }, { x: s.startX, y: s.startY }, { x: endX, y: endY });
                if (d < e.radius + 18) {
                    hitEnemy(e, s.damage, '#d69e2e');
                    e.stunTimer = s.stun;
                    s.hit.add(e.id);
                    spawnBurst(e.x, e.y, '#b7791f', 8, 90, 4, 0.35, 'square');
                }
            }

            if (s.progress >= 1) spells.splice(i, 1);

        // ── 11. Golem Rocket Fist ──
        } else if (s.kind === 'rocket_fist') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 6) s.trail.shift();

            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.radius) {
                    hitEnemy(e, s.damage, '#576574');
                    e.vx += Math.cos(s.angle) * s.knockback;
                    e.vy += Math.sin(s.angle) * s.knockback;
                    e.stunTimer = s.stun;
                    s.hit.add(e.id);
                    doShake(3.5, 0.12);
                    spawnBurst(e.x, e.y, '#feca57', 10, 110, 4, 0.35);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, '#576574', 16, 130, 6, 0.45, 'square');
                doShake(4, 0.15);
                spells.splice(i, 1);
            }

        // ── 12. Orbiting Shield Orbs ──
        } else if (s.kind === 'orbiting_shield') {
            s.duration -= dt;
            const orbitSpeed = 4.2;
            const orbitA = (Date.now() * 0.003 * orbitSpeed) + (s.orbitIndex / s.totalOrbits) * Math.PI * 2;
            const orbitRadius = 65;
            s.x = player.x + Math.cos(orbitA) * orbitRadius;
            s.y = player.y + Math.sin(orbitA) * orbitRadius;

            // Damage cooldown per enemy
            for (const [eId, cd] of s.hitCooldowns) {
                s.hitCooldowns.set(eId, cd - dt);
                if (cd <= 0) s.hitCooldowns.delete(eId);
            }

            for (const e of enemies) {
                if (e.dead || s.hitCooldowns.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.radius + 4) {
                    hitEnemy(e, s.damage, s.color);
                    s.hitCooldowns.set(e.id, 0.4);
                    lightningFlashes.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, color: s.glow, life: 0.12, maxLife: 0.12 });
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 13. Electric Pylon Totem ──
        } else if (s.kind === 'electric_pylon') {
            s.duration -= dt;
            s.pulseTimer -= dt;

            if (s.pulseTimer <= 0) {
                s.pulseTimer = 0.7;
                doShake(2, 0.08);
                // Pulse shockwave
                for (const e of enemies) {
                    if (e.dead) continue;
                    if (dist(s, e) < s.pulseRadius + e.radius) {
                        hitEnemy(e, s.damage * 0.5, '#a29bfe');
                        e.stunTimer = Math.max(e.stunTimer, 0.6);
                        lightningFlashes.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, color: '#a29bfe', life: 0.12, maxLife: 0.12 });
                    }
                }
            }

            if (s.duration <= 0) {
                spawnBurst(s.x, s.y, '#a29bfe', 12, 100, 4, 0.35);
                spells.splice(i, 1);
            }

        // ── 14. Heaven's Wrath (Thunderstorm Barrage) ──
        } else if (s.kind === 'heavens_wrath') {
            s.duration -= dt;
            s.strikeTimer -= dt;

            if (s.strikeTimer <= 0) {
                s.strikeTimer = 0.16;
                // Pick target near camera or near an enemy
                let strikeX, strikeY;
                const alive = enemies.filter(e => !e.dead);
                if (alive.length > 0 && Math.random() < 0.75) {
                    const tgt = alive[Math.floor(Math.random() * alive.length)];
                    strikeX = tgt.x + rng(-25, 25);
                    strikeY = tgt.y + rng(-25, 25);
                } else {
                    strikeX = camera.x + rng(60, BASE_W - 60);
                    strikeY = camera.y + rng(60, BASE_H - 60);
                }

                lightningFlashes.push({
                    x1: strikeX, y1: strikeY - 300,
                    x2: strikeX, y2: strikeY,
                    color: '#6c5ce7', life: 0.18, maxLife: 0.18
                });
                doShake(3, 0.1);
                spawnBurst(strikeX, strikeY, '#a29bfe', 8, 100, 4, 0.3);

                for (const e of enemies) {
                    if (e.dead) continue;
                    if (Math.hypot(e.x - strikeX, e.y - strikeY) < 55) {
                        hitEnemy(e, s.damage * 0.45, '#a29bfe');
                    }
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 15. Classic Expanding Radial Area Spells ──
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

            if (s.duration <= 0) spells.splice(i, 1);
        }
    }
}

function explodeSpell(s) {
    spawnBurst(s.x, s.y, s.color, 14, 130, s.radius * 0.7, 0.45);
    spawnBurst(s.x, s.y, s.glow, 8, 90, s.radius * 0.5, 0.3);
    doShake(3.5, 0.14);

    // Cluster sub-munitions
    if (s.isCluster) {
        for (let i = 0; i < (s.clusterCount || 4); i++) {
            const a = s.angle + (i - 1.5) * 0.8;
            spells.push({
                kind: 'projectile',
                x: s.x, y: s.y,
                angle: a,
                speed: 310,
                damage: s.damage * 0.45,
                radius: 9,
                hitRadius: 20,
                visual: 'flame_burst',
                color: s.color, glow: s.glow,
                pierce: false,
                life: 0.8,
                hit: new Set(),
                trail: [],
            });
        }
    }

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
        const a = Math.atan2(e.y - (s.y || player.y), e.x - (s.x || player.x));
        e.vx += Math.cos(a) * s.knockback;
        e.vy += Math.sin(a) * s.knockback;
    }
    if (s.burn) e.burnTimer = Math.max(e.burnTimer, 3);
    if (s.slow > 0) { e.slowTimer = Math.max(e.slowTimer, 2.5); e.slowFactor = s.slow; }
    if (s.stun > 0) e.stunTimer = Math.max(e.stunTimer, s.stun);
}

// ─── Custom Drawing per Spell Output ────────────────────────
function drawSpells() {
    for (const s of spells) {
        // ── 1. Projectiles & Shards ──
        if (s.kind === 'projectile' || s.kind === 'helix' || s.kind === 'homing_shard') {
            for (let t = 0; t < (s.trail ? s.trail.length : 0); t++) {
                const alpha = (t / s.trail.length) * 0.45;
                const r = s.radius * (t / s.trail.length) * 0.8;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = s.glow || s.color;
                ctx.beginPath();
                ctx.arc(s.trail[t].x, s.trail[t].y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            ctx.save();
            ctx.translate(s.x, s.y);

            if (s.visual === 'magma') {
                // Magma concentric orb
                ctx.fillStyle = '#ff793f';
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 1.35, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d63031';
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 1.05, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#532f1d';
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 0.65, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            } else if (s.visual === 'water' || s.visual === 'shock_water') {
                // Teardrop water dart
                ctx.rotate(s.angle);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, Math.PI * 0.5, Math.PI * 1.5);
                ctx.lineTo(s.radius * 1.6, 0);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            } else if (s.visual === 'stone' || s.visual === 'boulder' || s.visual === 'inferno_rock') {
                // Faceted rotating boulder
                ctx.rotate((s.animTime || 0) * 10);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                const pts = 6;
                for (let k = 0; k < pts; k++) {
                    const a = (k / pts) * Math.PI * 2;
                    const rad = s.radius * (0.8 + 0.25 * ((k % 2 === 0) ? 1 : -0.5));
                    if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            } else if (s.kind === 'homing_shard') {
                // Aerodynamic storm dagger
                ctx.rotate(s.angle);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#a29bfe';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(s.radius * 1.5, 0);
                ctx.lineTo(-s.radius, -s.radius * 0.6);
                ctx.lineTo(-s.radius * 0.5, 0);
                ctx.lineTo(-s.radius, s.radius * 0.6);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            } else {
                // Vibrant fire/spark ball
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.arc(0, 0, s.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = s.glow || '#ffffff';
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 0.5, 0, Math.PI * 2); ctx.fill();
            }

            ctx.restore();

        // ── 2. Tsunami Advancing Wall ──
        } else if (s.kind === 'tsunami_wall') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);
            ctx.fillStyle = s.color + 'aa';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            // Crescent advancing wave
            ctx.beginPath();
            ctx.arc(0, 0, s.width * 0.5, -Math.PI * 0.45, Math.PI * 0.45);
            ctx.quadraticCurveTo(-20, 0, Math.cos(-Math.PI * 0.45) * s.width * 0.5, Math.sin(-Math.PI * 0.45) * s.width * 0.5);
            ctx.fill(); ctx.stroke();
            ctx.restore();

        // ── 3. Death Ray Laser Beam ──
        } else if (s.kind === 'death_ray') {
            const alpha = s.duration / s.maxDuration;
            ctx.save();
            ctx.globalAlpha = alpha;
            // Outer beam glow
            ctx.strokeStyle = s.glow;
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(s.startX, s.startY);
            ctx.lineTo(s.endX, s.endY);
            ctx.stroke();
            // Core laser
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(s.startX, s.startY);
            ctx.lineTo(s.endX, s.endY);
            ctx.stroke();
            ctx.restore();

        // ── 4. Sky Meteor Target Reticle & Shadow ──
        } else if (s.kind === 'sky_meteor') {
            ctx.save();
            // Reticle circle
            ctx.strokeStyle = '#ff3838';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(s.targetX, s.targetY, s.aoe * (1 - s.progress * 0.4), 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Falling comet shadow
            const meteorX = s.targetX + 160 * (1 - s.progress);
            const meteorY = s.targetY - 380 * (1 - s.progress);
            ctx.fillStyle = '#ff793f';
            ctx.beginPath();
            ctx.arc(meteorX, meteorY, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        // ── 5. Moving Vortex Tornado ──
        } else if (s.kind === 'moving_vortex') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate((s.animTime || 0) * 8);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 4;
            for (let k = 1; k <= 3; k++) {
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * (k / 3), 0, Math.PI * 1.4);
                ctx.stroke();
            }
            ctx.restore();

        // ── 6. Storm Rain Cloud ──
        } else if (s.kind === 'storm_cloud') {
            ctx.save();
            ctx.fillStyle = 'rgba(44, 62, 80, 0.85)';
            ctx.strokeStyle = '#74b9ff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(s.x - 22, s.y, 24, 0, Math.PI * 2);
            ctx.arc(s.x + 22, s.y, 24, 0, Math.PI * 2);
            ctx.arc(s.x, s.y - 12, 30, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

        // ── 7. Fissure Ground Crack ──
        } else if (s.kind === 'fissure_crack') {
            ctx.save();
            ctx.strokeStyle = '#b7791f';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            const curL = s.length * Math.min(1, s.progress * 1.5);
            ctx.beginPath();
            ctx.moveTo(s.startX, s.startY);
            ctx.lineTo(s.startX + Math.cos(s.angle) * curL, s.startY + Math.sin(s.angle) * curL);
            ctx.stroke();
            ctx.restore();

        // ── 8. Golem Rocket Fist ──
        } else if (s.kind === 'rocket_fist') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);
            ctx.fillStyle = '#576574';
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 3;
            // Stone Fist box & knuckles
            ctx.beginPath();
            ctx.roundRect(-s.radius * 0.8, -s.radius * 0.8, s.radius * 1.6, s.radius * 1.6, 8);
            ctx.fill(); ctx.stroke();
            // Knuckle ridges
            ctx.fillStyle = '#222f3e';
            for (let k = -2; k <= 2; k += 1.3) {
                ctx.beginPath();
                ctx.arc(s.radius * 0.8, k * 7, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

        // ── 9. Orbiting Shield Orbs ──
        } else if (s.kind === 'orbiting_shield') {
            ctx.save();
            ctx.fillStyle = s.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

        // ── 10. Electric Pylon Totem ──
        } else if (s.kind === 'electric_pylon') {
            ctx.save();
            // Totem body
            ctx.fillStyle = '#2c3e50';
            ctx.strokeStyle = '#a29bfe';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - s.radius * 1.6);
            ctx.lineTo(s.x + s.radius, s.y + s.radius);
            ctx.lineTo(s.x - s.radius, s.y + s.radius);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            // Pulse ring
            ctx.strokeStyle = '#a29bfe';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.pulseRadius * (1 - s.pulseTimer / 0.7), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

        // ── 11. Area Shockwave Rings ──
        } else if (s.kind === 'area') {
            const progress = s.duration / s.maxDuration;
            ctx.save();
            ctx.globalAlpha = Math.min(1, progress * 1.3);
            ctx.strokeStyle = s.glow || s.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

// ─── Enemy Updates & AI ──────────────────────────────────────
