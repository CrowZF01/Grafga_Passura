// ============================================================
//  PASSURA: Elemental Arena — js/spells.js
//  34 Unique Spell Recipes, Physics, VFX & Mechanics Overhaul
//  Elements: 1 = Api, 2 = Air, 3 = Tanah, 4 = Petir
// ============================================================

// ─── Spell Recipes & Combinations (34 Distinct Combinations) ─
const RECIPES = {
    // ══════════════════════════════════════════════════════════════
    //  TIER 1: SINGLE ELEMENT (4 Combinations)
    // ══════════════════════════════════════════════════════════════
    '1': {
        name: 'Fireball',
        mode: 'fireball',
        speed: 420, damage: 50, radius: 13, hitRadius: 28,
        visual: 'fireball', color: '#ff4757', glow: '#ffa502',
        burn: true,
        desc: 'Bola api meluncur dengan ekor bara panas, meledak dan membakar musuh'
    },
    '2': {
        name: 'Aqua Shot',
        mode: 'aqua_jets',
        count: 3, spread: 0.38, speed: 450, damage: 20, radius: 11, hitRadius: 26,
        visual: 'aqua_jets', color: '#00a8ff', glow: '#74b9ff',
        knockback: 420,
        desc: 'Tembakan 3 semprotan air kencang yang mementalkan musuh mundur sangat jauh'
    },
    '3': {
        name: 'Stone Spike',
        mode: 'stone_lance',
        speed: 410, damage: 42, radius: 14, hitRadius: 28,
        visual: 'stone_lance', color: '#b7791f', glow: '#d69e2e',
        pierce: true, maxHits: 3, stun: 1.0, shatter: true, shatterCount: 4,
        desc: 'Tombak batu runcing yang menembus musuh, men-stun, dan pecah jadi 4 serpihan tajam'
    },
    '4': {
        name: 'Spark',
        mode: 'ricochet_spark',
        bounces: 5, speed: 620, damage: 18, radius: 9, hitRadius: 22,
        visual: 'ricochet_spark', color: '#9b59b6', glow: '#a29bfe',
        stun: 0.35,
        desc: 'Kilatan petir cepat yang memantul 5x di dinding dan melompat memburu antar musuh'
    },

    // ══════════════════════════════════════════════════════════════
    //  TIER 2: TWO ELEMENTS (10 Combinations)
    // ══════════════════════════════════════════════════════════════
    '11': {
        name: 'Flame Burst',
        mode: 'cluster_bomb',
        speed: 340, damage: 75, radius: 16, hitRadius: 36, aoe: 75,
        visual: 'cluster_bomb', color: '#ff3838', glow: '#ff9f43',
        burn: true,
        desc: 'Bom api membakar yang meledak dan pecah menjadi 4 bom mini berpencar'
    },
    '12': {
        name: 'Steam Blast',
        mode: 'steam_flamethrower',
        damage: 48, radius: 85,
        visual: 'steam_cloud', color: '#dfe6e9', glow: '#b2bec3',
        knockback: 140,
        desc: 'Semburan uap air mendidih terus-menerus di depan penyihir'
    },
    '13': {
        name: 'Magma Ball',
        mode: 'magma_dripper',
        speed: 250, damage: 80, radius: 19, hitRadius: 40,
        visual: 'magma_dripper', color: '#d63031', glow: '#ff7675',
        burn: true,
        desc: 'Bola magma bergulir yang meneteskan genangan lahar membara di lantai'
    },
    '14': {
        name: 'Thunder Fire',
        mode: 'helix_twins',
        speed: 390, damage: 58, radius: 12, hitRadius: 30,
        visual: 'helix_twins', color: '#ff793f', glow: '#a29bfe',
        desc: 'Sepasang bola api & petir berputar meliuk-liuk membentuk gelombang DNA'
    },
    '22': {
        name: 'Tidal Wave',
        mode: 'tsunami_wall',
        speed: 300, damage: 45, radius: 120, width: 160,
        visual: 'tsunami_wall', color: '#0984e3', glow: '#74b9ff',
        knockback: 500,
        desc: 'Dinding ombak tsunami selebar 160px yang menyapu dan mementalkan seluruh musuh'
    },
    '23': {
        name: 'Mud Glob',
        mode: 'quicksand_trap',
        speed: 310, damage: 38, radius: 16, hitRadius: 32,
        visual: 'quicksand_trap', color: '#6d4c41', glow: '#8d6e63',
        slow: 0.75,
        desc: 'Gumpalan lumpur yang menciptakan kubangan hisap 85px yang memperlambat musuh 75%'
    },
    '24': {
        name: 'Shock Current',
        mode: 'electric_tether',
        speed: 460, damage: 44, radius: 11, hitRadius: 26,
        visual: 'electric_tether', color: '#00d2d3', glow: '#9b59b6',
        chain: 5, knockback: 220,
        desc: 'Jarum air terestrial beraliran listrik yang menancap & men-tether 5 musuh'
    },
    '33': {
        name: 'Boulder Toss',
        mode: 'rolling_boulder',
        speed: 230, damage: 95, radius: 25, hitRadius: 50,
        visual: 'rolling_boulder', color: '#795548', glow: '#d7ccc8',
        pierce: true, stun: 1.5, shatter: true, shatterCount: 6,
        desc: 'Batu granit raksasa bergulir melindas musuh dan meledak jadi 6 serpihan batu'
    },
    '34': {
        name: 'Volt Spike',
        mode: 'electric_pylon',
        damage: 40, radius: 18, pulseRadius: 115, duration: 4.2,
        visual: 'electric_pylon', color: '#a29bfe', glow: '#fdcb6e',
        desc: 'Menancapkan obelisk batu runik yang berdenyut memancarkan gelombang kejut petir'
    },
    '44': {
        name: 'Chain Lightning',
        mode: 'chain_lightning',
        damage: 40, radius: 170, chain: 8,
        visual: 'chain_lightning', color: '#a29bfe', glow: '#6c5ce7',
        stun: 0.45,
        desc: 'Pohon petir ungu bercabang yang menyengat 8 musuh seketika tanpa delay'
    },

    // ══════════════════════════════════════════════════════════════
    //  TIER 3: THREE ELEMENTS (20 Combinations)
    // ══════════════════════════════════════════════════════════════
    '111': {
        name: 'Sun Flare',
        mode: 'solar_supernova',
        damage: 145, radius: 130,
        visual: 'solar_supernova', color: '#fed330', glow: '#fa8231',
        burn: true,
        desc: 'Supernova surya menyilaukan yang meledak 360° dan melepaskan 12 tombak cahaya api'
    },
    '112': {
        name: 'Fire Storm',
        mode: 'fire_tornado',
        damage: 82, radius: 70, speed: 140, life: 3.5,
        visual: 'fire_tornado', color: '#ff4757', glow: '#ff9f43',
        burn: true,
        desc: 'Pusaran tornado api yang menyedot paksa semua monster di sekitar ke intinya'
    },
    '113': {
        name: 'Meteor Strike',
        mode: 'sky_meteor',
        damage: 195, aoe: 100,
        visual: 'sky_meteor', color: '#c0392b', glow: '#ff793f',
        burn: true,
        desc: 'Membidik tanah dengan kursor & memanggil meteor kolosal jatuh dari langit!'
    },
    '114': {
        name: 'Plasma Bolt',
        mode: 'death_ray',
        damage: 110,
        visual: 'death_ray', color: '#ff3838', glow: '#e056fd',
        desc: 'Laser kematian plasma instan yang menembus sepanjang layar 850px'
    },
    '122': {
        name: 'Boiling Geyser',
        mode: 'steam_geysers',
        damage: 52,
        visual: 'steam_geysers', color: '#00a8ff', glow: '#dfe6e9',
        knockback: 400, burn: true,
        desc: 'Membuka garis 4 geyser air mendidih yang meletus beruntun mementalkan musuh'
    },
    '123': {
        name: 'Lava Splash',
        mode: 'lava_mortar',
        damage: 72,
        visual: 'lava_mortar', color: '#d63031', glow: '#e17055',
        desc: 'Melontarkan 4 bom lahar yang jatuh dan membentuk kolam magma membara di lantai'
    },
    '124': {
        name: 'Tempest',
        mode: 'cyclone_twins',
        damage: 62, speed: 360,
        visual: 'cyclone_twins', color: '#74b9ff', glow: '#e056fd',
        knockback: 340,
        desc: 'Sepasang bilah topan angin berpetir melengkung kiri-kanan yang menyilang dan melempar musuh'
    },
    '133': {
        name: 'Inferno Rock',
        mode: 'molten_juggernaut',
        speed: 240, damage: 140, radius: 26, hitRadius: 52,
        visual: 'molten_juggernaut', color: '#b71540', glow: '#ff793f',
        burn: true, stun: 1.4, shatter: true, shatterCount: 8,
        desc: 'Batu lahar raksasa bergulir meninggalkan jejak api dan pecah jadi 8 serpihan api'
    },
    '134': {
        name: 'Volcano Burst',
        mode: 'volcanic_mortar',
        damage: 92, aoe: 90,
        visual: 'volcanic_mortar', color: '#c0392b', glow: '#f39c12',
        burn: true,
        desc: 'Erupsi vulkanik di bawah kursor memuntahkan 8 serpihan lahar melingkar'
    },
    '144': {
        name: 'Arc Flash',
        mode: 'plasma_shotgun',
        count: 5, spread: 0.65, speed: 480, damage: 68,
        visual: 'plasma_shotgun', color: '#ff4757', glow: '#a29bfe',
        desc: 'Tembakan shotgun 5 jarum plasma overcharged yang masing-masing menyengat petir cabang'
    },
    '222': {
        name: 'Ocean Surge',
        mode: 'expanding_tsunami_rings',
        damage: 68, radius: 170,
        visual: 'expanding_tsunami_rings', color: '#0984e3', glow: '#74b9ff',
        knockback: 520,
        desc: 'Tiga cincin ombak samudra purba yang bergelombang berturut-turut mementalkan musuh 3x'
    },
    '223': {
        name: 'Flash Flood',
        mode: 'hydro_geyser',
        damage: 60,
        visual: 'hydro_geyser', color: '#00a8ff', glow: '#74b9ff',
        knockback: 540,
        desc: 'Semburan meriam air jet bertekanan tinggi yang berujung pada letusan geyser dahsyat'
    },
    '224': {
        name: 'Thunder Rain',
        mode: 'storm_cloud',
        damage: 48, radius: 85, duration: 3.5,
        visual: 'storm_cloud', color: '#0984e3', glow: '#a29bfe',
        desc: 'Menciptakan awan mendung di kursor yang menghujani musuh dengan petir terus-menerus'
    },
    '233': {
        name: 'Mudslide',
        mode: 'rock_avalanche',
        speed: 250, damage: 72,
        visual: 'rock_avalanche', color: '#5d4037', glow: '#8d6e63',
        stun: 1.3, shatter: true,
        desc: 'Runtuhan 3 batu longsor berurutan yang menimpa musuh dan membentuk lumpur hisap'
    },
    '234': {
        name: 'Storm Spike',
        mode: 'homing_shards',
        damage: 78, speed: 360, count: 4,
        visual: 'homing_shards', color: '#2d3436', glow: '#a29bfe',
        desc: 'Menembakkan 4 belati badai aerodinamis yang berbelok tajam memburu musuh otomatis'
    },
    '244': {
        name: 'Electric Storm',
        mode: 'orbiting_shield',
        damage: 58, duration: 4.5,
        visual: 'orbiting_shield', color: '#0984e3', glow: '#e056fd',
        knockback: 260,
        desc: 'Menciptakan 3 bola badai berputar di sekitar penyihir sebagai perisai aktif selama 4.5s'
    },
    '333': {
        name: 'Earthquake',
        mode: 'fissure_crack',
        damage: 110, length: 350,
        visual: 'fissure_crack', color: '#3d1f05', glow: '#d69e2e',
        stun: 2.0,
        desc: 'Membelah lantai dengan retakan gempa besar 350px yang meremukkan musuh dengan stun 2 detik'
    },
    '334': {
        name: 'Golem Fist',
        mode: 'rocket_fist',
        speed: 490, damage: 180, radius: 28,
        visual: 'rocket_fist', color: '#576574', glow: '#feca57',
        stun: 2.0, knockback: 400,
        desc: 'Tinju raksasa batu bertenaga roket meluncur kencang memukul musuh hingga mental jauh dan stun'
    },
    '344': {
        name: 'Thunder Clap',
        mode: 'sonic_shockwave',
        damage: 72, radius: 100,
        visual: 'sonic_shockwave', color: '#8e44ad', glow: '#f1c40f',
        stun: 1.2,
        desc: 'Hentakan gelombang sonik getaran gempa petir 360° yang mengguncang dan melumpuhkan musuh'
    },
    '444': {
        name: 'Thunderstorm',
        mode: 'heavens_wrath',
        damage: 64, duration: 2.6,
        visual: 'heavens_wrath', color: '#6c5ce7', glow: '#fd79a8',
        stun: 0.5,
        desc: 'Hujan badai petir langit tiada henti menyambar 16 titik di arena pertempuran bertubi-tubi'
    },
};

function getSpell(queue) {
    if (!queue || !queue.length) return null;
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
        maxHits: spell.maxHits || (spell.pierce ? 999 : 1),
        hitsCount: 0,
        chain: spell.chain || 0,
        chainCount: spell.chain || 0,
        aoe: spell.aoe || 0,
        burn: spell.burn || false,
        slow: spell.slow || 0,
        stun: spell.stun || 0,
        knockback: spell.knockback || 0,
        shatter: spell.shatter || false,
        shatterCount: spell.shatterCount || 4,
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
        isTether: false,
        isPlasmaNeedle: false,
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
        speed: spell.speed || 390,
        damage: spell.damage * 0.55,
        radius: spell.radius || 12,
        hitRadius: 28,
        visual: 'helix_twins',
        color: orbColor,
        glow: spell.glow,
        life: 3.5,
        hit: new Set(),
        trail: [],
        animTime: 0,
    });
}

function launchCyclone(wandX, wandY, baseAngle, curveDir, spell) {
    spells.push({
        kind: 'cyclone',
        x: wandX, y: wandY,
        angle: baseAngle + curveDir * 0.25,
        curveDir,
        speed: spell.speed || 360,
        radius: 26,
        damage: spell.damage,
        knockback: spell.knockback || 340,
        color: spell.color,
        glow: spell.glow,
        life: 1.6,
        hitCooldowns: new Map(),
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
        if (d < e.radius + 18) {
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

// ─── Execute Spell (All 34 Modes Fully Distinct) ─────────────
function executeSpell(spell, castType) {
    const mouseAngle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const targetX = mouse.x;
    const targetY = mouse.y;
    const wandDist = player.bodyRadius + 16;
    const wandX = player.x + Math.cos(mouseAngle) * wandDist;
    const wandY = player.y + Math.sin(mouseAngle) * wandDist;

    switch (spell.mode) {
        // ── 1. Fireball (T1 Api) ──
        case 'fireball':
            launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            doShake(2.5, 0.08);
            spawnBurst(wandX, wandY, spell.glow, 6, 80, 4, 0.3);
            break;

        // ── 2. Aqua Jets (T1 Air) ──
        case 'aqua_jets': {
            const count = spell.count || 3;
            const spread = spell.spread || 0.38;
            const startA = mouseAngle - spread / 2;
            const stepA = spread / (count - 1);
            for (let i = 0; i < count; i++) {
                const p = launchSingleProjectile(spell, wandX, wandY, startA + i * stepA);
                p.knockback = spell.knockback || 420;
            }
            doShake(3, 0.1);
            spawnBurst(wandX, wandY, '#74b9ff', 8, 110, 4, 0.3);
            break;
        }

        // ── 3. Stone Lance (T1 Tanah) ──
        case 'stone_lance': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.pierce = true;
            p.maxHits = spell.maxHits || 3;
            p.stun = spell.stun || 1.0;
            p.shatter = true;
            p.shatterCount = spell.shatterCount || 4;
            doShake(3.5, 0.1);
            break;
        }

        // ── 4. Ricochet Spark (T1 Petir) ──
        case 'ricochet_spark': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.bounces = spell.bounces || 5;
            p.chainCount = 3;
            p.stun = spell.stun || 0.35;
            doShake(2, 0.08);
            break;
        }

        // ── 5. Cluster Bomb (T2 Api+Api) ──
        case 'cluster_bomb': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.isCluster = true;
            p.clusterCount = 4;
            p.aoe = spell.aoe || 75;
            p.burn = true;
            doShake(3.5, 0.12);
            break;
        }

        // ── 6. Steam Flamethrower (T2 Api+Air) ──
        case 'steam_flamethrower':
            spells.push({
                kind: 'steam_cone',
                duration: 0.9, maxDuration: 0.9,
                angle: mouseAngle,
                damage: spell.damage,
                color: spell.color,
                knockback: spell.knockback || 140,
                tickTimer: 0,
            });
            doShake(2.5, 0.15);
            break;

        // ── 7. Magma Dripper (T2 Api+Tanah) ──
        case 'magma_dripper': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.dripLava = true;
            p.dripTimer = 0;
            p.burn = true;
            doShake(3, 0.1);
            break;
        }

        // ── 8. Helix Twins (T2 Api+Petir) ──
        case 'helix_twins':
            launchHelixProjectile(spell, wandX, wandY, mouseAngle, 0, '#ff4757');
            launchHelixProjectile(spell, wandX, wandY, mouseAngle, Math.PI, '#a29bfe');
            doShake(3, 0.1);
            break;

        // ── 9. Tsunami Wall (T2 Air+Air) ──
        case 'tsunami_wall':
            spells.push({
                kind: 'tsunami_wall',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: spell.speed || 300,
                width: spell.width || 160,
                height: 42,
                damage: spell.damage,
                knockback: spell.knockback || 500,
                color: spell.color, glow: spell.glow,
                visual: spell.visual,
                life: 1.8,
                hit: new Set(),
            });
            doShake(4.5, 0.18);
            break;

        // ── 10. Quicksand Trap (T2 Air+Tanah) ──
        case 'quicksand_trap': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.trapType = 'mud';
            p.slow = spell.slow || 0.75;
            doShake(2.5, 0.08);
            break;
        }

        // ── 11. Electric Tether (T2 Air+Petir) ──
        case 'electric_tether': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.isTether = true;
            p.chainCount = spell.chain || 5;
            p.knockback = spell.knockback || 220;
            doShake(3, 0.1);
            break;
        }

        // ── 12. Rolling Boulder (T2 Tanah+Tanah) ──
        case 'rolling_boulder': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.pierce = true;
            p.stun = spell.stun || 1.5;
            p.shatter = true;
            p.shatterCount = spell.shatterCount || 6;
            doShake(4.5, 0.18);
            break;
        }

        // ── 13. Electric Pylon (T2 Tanah+Petir) ──
        case 'electric_pylon':
            spells.push({
                kind: 'electric_pylon',
                x: targetX, y: targetY,
                radius: spell.radius || 18,
                pulseRadius: spell.pulseRadius || 115,
                duration: spell.duration || 4.2,
                damage: spell.damage,
                pulseTimer: 0.3,
            });
            doShake(3, 0.12);
            break;

        // ── 14. Chain Lightning (T2 Petir+Petir) ──
        case 'chain_lightning':
            doChainLightning(player.x, player.y, spell.radius || 170, spell.chain || 8, spell.damage, spell.glow, new Set());
            doShake(4, 0.15);
            break;

        // ── 15. Solar Supernova (T3 Api+Api+Api) ──
        case 'solar_supernova':
            spells.push({
                kind: 'solar_supernova',
                x: player.x, y: player.y,
                radius: 0,
                maxRadius: spell.radius || 130,
                damage: spell.damage,
                burn: true,
                duration: 0.55, maxDuration: 0.55,
                color: spell.color, glow: spell.glow,
                hit: new Set(),
            });
            for (let k = 0; k < 12; k++) {
                const a = (k / 12) * Math.PI * 2;
                const p = launchSingleProjectile({
                    speed: 440, damage: Math.round(spell.damage * 0.4),
                    radius: 8, hitRadius: 20,
                    visual: 'fireball', color: '#fed330', glow: '#fa8231',
                    burn: true
                }, player.x, player.y, a);
                p.life = 0.5;
            }
            doShake(5.5, 0.25);
            break;

        // ── 16. Fire Tornado (T3 Api+Api+Air) ──
        case 'fire_tornado':
            spells.push({
                kind: 'fire_tornado',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: spell.speed || 140,
                radius: spell.radius || 70,
                damage: spell.damage,
                color: spell.color, glow: spell.glow,
                visual: 'fire_tornado',
                life: spell.life || 3.5,
                tickTimer: 0,
            });
            doShake(4.0, 0.16);
            break;

        // ── 17. Sky Meteor (T3 Api+Api+Tanah) ──
        case 'sky_meteor':
            spells.push({
                kind: 'sky_meteor',
                targetX, targetY,
                damage: spell.damage,
                aoe: spell.aoe || 100,
                color: spell.color, glow: spell.glow,
                progress: 0,
                duration: 0.42,
            });
            doShake(3, 0.1);
            break;

        // ── 18. Death Ray (T3 Api+Api+Petir) ──
        case 'death_ray':
            fireDeathRay(player.x, player.y, mouseAngle, 850, spell.damage, spell.color, spell.glow);
            doShake(5.5, 0.2);
            break;

        // ── 19. Steam Geysers (T3 Api+Air+Air) ──
        case 'steam_geysers':
            spells.push({
                kind: 'steam_geysers',
                startX: wandX, startY: wandY,
                angle: mouseAngle,
                damage: spell.damage,
                count: 4,
                spacing: 70,
                timer: 0,
                triggeredIndex: 0,
                color: spell.color,
                glow: spell.glow,
                hit: new Set(),
            });
            doShake(4.5, 0.2);
            break;

        // ── 20. Lava Mortar (T3 Api+Air+Tanah) ──
        case 'lava_mortar':
            for (let i = 0; i < 4; i++) {
                const spreadA = mouseAngle + rng(-0.55, 0.55);
                const p = launchSingleProjectile(spell, wandX, wandY, spreadA);
                p.speed *= rng(0.75, 1.25);
                p.life = rng(0.45, 0.85);
                p.trapType = 'lava';
            }
            doShake(3.5, 0.12);
            break;

        // ── 21. Cyclone Twins (T3 Api+Air+Petir) ──
        case 'cyclone_twins':
            launchCyclone(wandX, wandY, mouseAngle, -1, spell);
            launchCyclone(wandX, wandY, mouseAngle, 1, spell);
            doShake(3.5, 0.14);
            break;

        // ── 22. Molten Juggernaut (T3 Api+Tanah+Tanah) ──
        case 'molten_juggernaut': {
            const p = launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            p.pierce = true;
            p.dripLava = true;
            p.dripTimer = 0;
            p.burn = true;
            p.stun = spell.stun || 1.4;
            p.shatter = true;
            p.shatterCount = spell.shatterCount || 8;
            doShake(4.5, 0.2);
            break;
        }

        // ── 23. Volcanic Mortar (T3 Api+Tanah+Petir) ──
        case 'volcanic_mortar':
            spells.push({
                kind: 'volcanic_fissure',
                x: targetX, y: targetY,
                damage: spell.damage,
                aoe: spell.aoe || 90,
                progress: 0,
                duration: 0.35,
                color: spell.color, glow: spell.glow,
            });
            for (let k = 0; k < 8; k++) {
                const a = (k / 8) * Math.PI * 2 + rng(-0.2, 0.2);
                const p = launchSingleProjectile({
                    speed: rng(180, 260),
                    damage: Math.round(spell.damage * 0.45),
                    radius: 10, hitRadius: 24,
                    visual: 'magma_dripper',
                    color: '#c0392b', glow: '#f39c12',
                    burn: true
                }, targetX, targetY, a);
                p.life = rng(0.35, 0.65);
                p.trapType = 'lava';
            }
            doShake(5, 0.22);
            break;

        // ── 24. Plasma Shotgun (T3 Api+Petir+Petir) ──
        case 'plasma_shotgun': {
            const count = spell.count || 5;
            const spread = spell.spread || 0.65;
            const startA = mouseAngle - spread / 2;
            const stepA = spread / (count - 1);
            for (let i = 0; i < count; i++) {
                const p = launchSingleProjectile(spell, wandX, wandY, startA + i * stepA);
                p.isPlasmaNeedle = true;
            }
            doShake(4, 0.15);
            break;
        }

        // ── 25. Expanding Tsunami Rings (T3 Air+Air+Air) ──
        case 'expanding_tsunami_rings':
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    spells.push({
                        kind: 'area',
                        x: player.x, y: player.y,
                        damage: spell.damage * 0.7,
                        radius: 0,
                        maxRadius: (spell.radius || 170) * (0.8 + i * 0.2),
                        visual: 'expanding_tsunami_rings',
                        color: spell.color, glow: spell.glow,
                        duration: 0.7, maxDuration: 0.7,
                        knockback: spell.knockback || 520,
                        hit: new Set(),
                    });
                    doShake(3.5, 0.12);
                }, i * 220);
            }
            break;

        // ── 26. Hydro Geyser (T3 Air+Air+Tanah) ──
        case 'hydro_geyser': {
            const distToTarget = Math.min(dist(player, { x: targetX, y: targetY }), 480);
            const burstX = player.x + Math.cos(mouseAngle) * distToTarget;
            const burstY = player.y + Math.sin(mouseAngle) * distToTarget;

            for (const e of enemies) {
                if (e.dead) continue;
                const d = distToSegment({ x: e.x, y: e.y }, { x: wandX, y: wandY }, { x: burstX, y: burstY });
                if (d < e.radius + 22) {
                    hitEnemy(e, spell.damage * 0.75, '#00a8ff');
                    const a = Math.atan2(e.y - wandY, e.x - wandX);
                    e.vx += Math.cos(a) * 440;
                    e.vy += Math.sin(a) * 440;
                    wallSlide(e, e.x + Math.cos(a) * 25, e.y + Math.sin(a) * 25, e.radius);
                }
            }

            spells.push({
                kind: 'hydro_geyser',
                x: burstX, y: burstY,
                radius: 15, maxRadius: 85,
                damage: spell.damage,
                knockback: spell.knockback || 540,
                color: '#00a8ff', glow: '#74b9ff',
                duration: 0.65, maxDuration: 0.65,
                hit: new Set(),
            });

            for (let k = 0; k < 20; k++) {
                const a = rng(0, Math.PI * 2);
                const s = rng(80, 220);
                spawnParticle(burstX, burstY, Math.cos(a) * s, Math.sin(a) * s, '#74b9ff', 0.45, rng(3, 7));
            }
            doShake(5.0, 0.22);
            break;
        }

        // ── 27. Storm Cloud (T3 Air+Air+Petir) ──
        case 'storm_cloud':
            spells.push({
                kind: 'storm_cloud',
                x: targetX, y: targetY,
                radius: spell.radius || 85,
                duration: spell.duration || 3.5,
                damage: spell.damage,
                tickTimer: 0,
            });
            doShake(3, 0.15);
            break;

        // ── 28. Rock Avalanche (T3 Air+Tanah+Tanah) ──
        case 'rock_avalanche': {
            const spread = 0.28;
            for (let k = -1; k <= 1; k++) {
                const a = mouseAngle + k * spread;
                const p = launchSingleProjectile(spell, wandX, wandY, a);
                p.speed = (spell.speed || 250) + rng(-25, 25);
                p.radius = 18;
                p.hitRadius = 38;
                p.pierce = true;
                p.stun = spell.stun || 1.3;
                p.shatter = true;
                p.shatterCount = 5;
                p.trapType = 'mud';
            }
            doShake(4.5, 0.22);
            break;
        }

        // ── 29. Homing Shards (T3 Air+Tanah+Petir) ──
        case 'homing_shards': {
            const count = spell.count || 4;
            for (let i = 0; i < count; i++) {
                const a = mouseAngle + (i - 1.5) * 0.35;
                spells.push({
                    kind: 'homing_shard',
                    x: wandX, y: wandY,
                    angle: a,
                    speed: spell.speed || 360,
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

        // ── 30. Orbiting Shield (T3 Air+Petir+Petir) ──
        case 'orbiting_shield': {
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
                    knockback: spell.knockback || 260,
                    color: spell.color, glow: spell.glow,
                    duration: spell.duration || 4.5,
                    maxDuration: spell.duration || 4.5,
                    hitCooldowns: new Map(),
                });
            }
            doShake(3, 0.1);
            break;
        }

        // ── 31. Fissure Crack (T3 Tanah+Tanah+Tanah) ──
        case 'fissure_crack':
            spells.push({
                kind: 'fissure_crack',
                startX: player.x, startY: player.y,
                angle: mouseAngle,
                length: spell.length || 350,
                damage: spell.damage,
                stun: spell.stun || 2.0,
                progress: 0,
                duration: 0.65,
                hit: new Set(),
            });
            doShake(4.5, 0.25);
            break;

        // ── 32. Rocket Fist (T3 Tanah+Tanah+Petir) ──
        case 'rocket_fist':
            spells.push({
                kind: 'rocket_fist',
                x: wandX, y: wandY,
                angle: mouseAngle,
                speed: spell.speed || 490,
                radius: spell.radius || 28,
                damage: spell.damage,
                knockback: spell.knockback || 400,
                stun: spell.stun || 2.0,
                life: 1.4,
                hit: new Set(),
                trail: [],
            });
            doShake(5.5, 0.22);
            break;

        // ── 33. Sonic Shockwave (T3 Tanah+Petir+Petir) ──
        case 'sonic_shockwave':
            spells.push({
                kind: 'sonic_shockwave',
                x: player.x, y: player.y,
                damage: spell.damage,
                radius: 0,
                maxRadius: spell.radius || 100,
                visual: spell.visual,
                color: spell.color, glow: spell.glow,
                duration: 0.55, maxDuration: 0.55,
                stun: spell.stun || 1.2,
                hit: new Set(),
            });
            doShake(4.5, 0.2);
            spawnBurst(player.x, player.y, spell.color, 24, 200, 7, 0.65);
            break;

        // ── 34. Heaven's Wrath (T3 Petir+Petir+Petir) ──
        case 'heavens_wrath':
            spells.push({
                kind: 'heavens_wrath',
                duration: spell.duration || 2.6,
                strikeTimer: 0.08,
                damage: spell.damage,
                color: spell.color, glow: spell.glow,
                stun: spell.stun || 0.5,
            });
            doShake(5.5, 0.3);
            break;

        default:
            launchSingleProjectile(spell, wandX, wandY, mouseAngle);
            break;
    }
}

// ─── Update Spells Loop ──────────────────────────────────────
function updateSpells(dt) {
    updatePuddles(dt);

    for (let i = spells.length - 1; i >= 0; i--) {
        const s = spells[i];
        s.animTime = (s.animTime || 0) + dt;

        // ── 1. Projectiles ──
        if (s.kind === 'projectile') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 10) s.trail.shift();

            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            // Magma dripper leaves lava puddles on ground
            if (s.dripLava) {
                s.dripTimer += dt;
                if (s.dripTimer >= 0.16) {
                    s.dripTimer = 0;
                    spawnPuddle(s.x, s.y, 16, 'lava', 3.5, 8);
                }
            }

            // Wall Collision
            if (isWall(s.x, s.y)) {
                if (s.bounces > 0) {
                    s.bounces--;
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
            let hitEnemyRef = null;
            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.hitRadius * 0.5) {
                    applySpellHit(s, e);
                    s.hit.add(e.id);
                    s.hitsCount = (s.hitsCount || 0) + 1;
                    hitEnemyRef = e;

                    // Electric tether dart effect
                    if (s.isTether) {
                        doChainLightning(s.x, s.y, 180, s.chainCount, s.damage * 0.55, s.glow, new Set([e.id]));
                    }
                    // Plasma needle discharge arc
                    if (s.isPlasmaNeedle) {
                        doChainLightning(s.x, s.y, 130, 2, s.damage * 0.6, s.glow, new Set([e.id]));
                    }

                    if (!s.pierce || s.hitsCount >= s.maxHits) break;
                }
            }

            if (hitEnemyRef && (!s.pierce || s.hitsCount >= s.maxHits)) {
                if (s.bounces > 0) {
                    s.bounces--;
                    let nextTarget = null, minD = 260;
                    for (const other of enemies) {
                        if (other.dead || s.hit.has(other.id)) continue;
                        const d = dist(s, other);
                        if (d < minD) { minD = d; nextTarget = other; }
                    }
                    if (nextTarget) {
                        s.angle = Math.atan2(nextTarget.y - s.y, nextTarget.x - s.x);
                        lightningFlashes.push({ x1: s.x, y1: s.y, x2: nextTarget.x, y2: nextTarget.y, color: s.glow, life: 0.14, maxLife: 0.14 });
                    } else {
                        s.angle += rng(Math.PI * 0.5, Math.PI * 1.5);
                    }
                    spawnBurst(s.x, s.y, s.glow, 6, 95, 3, 0.25);
                } else {
                    explodeSpell(s);
                    spells.splice(i, 1);
                    continue;
                }
            }

            if (s.life <= 0) {
                if (s.trapType) {
                    spawnPuddle(s.x, s.y, 32, s.trapType, 5.0, 9, s.trapType === 'mud' ? 0.75 : 0);
                }
                spells.splice(i, 1);
                continue;
            }

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
            const offset = Math.sin(s.helixPhase) * 18;
            s.x = s.forwardX + Math.cos(perp) * offset;
            s.y = s.forwardY + Math.sin(perp) * offset;
            s.life -= dt;

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < e.radius + 15) {
                    hitEnemy(e, s.damage, s.color);
                    s.hit.add(e.id);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.color, 6, 80, 3, 0.25);
                spells.splice(i, 1);
                continue;
            }

        // ── 3. Cyclone Twins ──
        } else if (s.kind === 'cyclone') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 8) s.trail.shift();

            s.angle += s.curveDir * dt * 2.2;
            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            // Suction pull
            for (const e of enemies) {
                if (e.dead) continue;
                const d = dist(s, e);
                if (d < s.radius * 2.2) {
                    const a = Math.atan2(s.y - e.y, s.x - e.x);
                    e.vx += Math.cos(a) * 110;
                    e.vy += Math.sin(a) * 110;
                }
            }

            // Damage cooldown per enemy
            for (const [eId, cd] of s.hitCooldowns) {
                s.hitCooldowns.set(eId, cd - dt);
                if (cd <= 0) s.hitCooldowns.delete(eId);
            }

            for (const e of enemies) {
                if (e.dead || s.hitCooldowns.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.radius) {
                    hitEnemy(e, s.damage * 0.45, s.color);
                    s.hitCooldowns.set(e.id, 0.25);
                    const pushA = s.angle + s.curveDir * Math.PI * 0.4;
                    e.vx += Math.cos(pushA) * (s.knockback * 0.6);
                    e.vy += Math.sin(pushA) * (s.knockback * 0.6);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.color, 10, 90, 4, 0.3);
                spells.splice(i, 1);
                continue;
            }

        // ── 4. Tsunami Advancing Wall ──
        } else if (s.kind === 'tsunami_wall') {
            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.width * 0.48 + e.radius) {
                    hitEnemy(e, s.damage, s.color);
                    e.vx += Math.cos(s.angle) * s.knockback;
                    e.vy += Math.sin(s.angle) * s.knockback;
                    wallSlide(e, e.x + Math.cos(s.angle) * 35, e.y + Math.sin(s.angle) * 35, e.radius);
                    s.hit.add(e.id);
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) {
                spawnBurst(s.x, s.y, s.color, 14, 110, 5, 0.4);
                spells.splice(i, 1);
                continue;
            }

        // ── 5. Steam Cone (Flamethrower) ──
        } else if (s.kind === 'steam_cone') {
            s.duration -= dt;
            s.tickTimer -= dt;
            const wandA = player.angle;
            const wandTipX = player.x + Math.cos(wandA) * 26;
            const wandTipY = player.y + Math.sin(wandA) * 26;

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
                    if (d < 145) {
                        const angToEnemy = Math.atan2(e.y - player.y, e.x - player.x);
                        let diff = Math.abs(angToEnemy - wandA);
                        if (diff > Math.PI) diff = Math.PI * 2 - diff;
                        if (diff < 0.62) {
                            hitEnemy(e, s.damage * 0.35, '#dfe6e9');
                            e.vx += Math.cos(wandA) * (s.knockback || 140);
                            e.vy += Math.sin(wandA) * (s.knockback || 140);
                        }
                    }
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 6. Steam Geysers ──
        } else if (s.kind === 'steam_geysers') {
            s.timer += dt;
            if (s.timer >= 0.11 && s.triggeredIndex < s.count) {
                const gx = s.startX + Math.cos(s.angle) * s.spacing * (s.triggeredIndex + 1);
                const gy = s.startY + Math.sin(s.angle) * s.spacing * (s.triggeredIndex + 1);

                for (let k = 0; k < 12; k++) {
                    const a = rng(0, Math.PI * 2);
                    spawnParticle(gx, gy, Math.cos(a) * rng(50, 160), Math.sin(a) * rng(50, 160), '#74b9ff', 0.35, rng(3, 6));
                    spawnParticle(gx, gy, rng(-20, 20), rng(-60, -120), '#dfe6e9', 0.45, rng(5, 10));
                }

                for (const e of enemies) {
                    if (e.dead || s.hit.has(e.id)) continue;
                    if (dist({ x: gx, y: gy }, e) < 48 + e.radius) {
                        hitEnemy(e, s.damage, '#00a8ff');
                        e.burnTimer = Math.max(e.burnTimer, 2.5);
                        const pushA = Math.atan2(e.y - gy, e.x - gx);
                        e.vx += Math.cos(pushA) * 380;
                        e.vy += Math.sin(pushA) * 380;
                        s.hit.add(e.id);
                    }
                }

                s.triggeredIndex++;
                s.timer = 0;
                doShake(2.5, 0.08);
            }

            if (s.triggeredIndex >= s.count && s.timer >= 0.25) {
                spells.splice(i, 1);
            }

        // ── 7. Death Ray Laser Beam ──
        } else if (s.kind === 'death_ray') {
            s.duration -= dt;
            if (s.duration <= 0) spells.splice(i, 1);

        // ── 8. Sky Strike Meteor ──
        } else if (s.kind === 'sky_meteor') {
            s.progress += dt / s.duration;
            if (s.progress >= 1) {
                doShake(6, 0.25);
                spawnBurst(s.targetX, s.targetY, '#c0392b', 24, 220, 8, 0.65);
                spawnBurst(s.targetX, s.targetY, '#f1c40f', 16, 160, 5, 0.4);
                spawnPuddle(s.targetX, s.targetY, 34, 'lava', 4.5, 12);

                for (const e of enemies) {
                    if (e.dead) continue;
                    const d = Math.hypot(e.x - s.targetX, e.y - s.targetY);
                    if (d < s.aoe + e.radius) {
                        hitEnemy(e, s.damage, s.color);
                        e.burnTimer = 3.5;
                        const a = Math.atan2(e.y - s.targetY, e.x - s.targetX);
                        e.vx += Math.cos(a) * 240;
                        e.vy += Math.sin(a) * 240;
                    }
                }
                spells.splice(i, 1);
            }

        // ── 9. Volcanic Fissure Eruption ──
        } else if (s.kind === 'volcanic_fissure') {
            s.progress += dt / s.duration;
            if (s.progress >= 1) {
                doShake(5.0, 0.2);
                spawnBurst(s.x, s.y, '#c0392b', 18, 180, 6, 0.5);
                spawnBurst(s.x, s.y, '#f39c12', 12, 120, 4, 0.35);
                spawnPuddle(s.x, s.y, 28, 'lava', 4.0, 10);

                for (const e of enemies) {
                    if (e.dead) continue;
                    if (dist(s, e) < s.aoe + e.radius) {
                        hitEnemy(e, s.damage, s.color);
                        e.burnTimer = 3.5;
                    }
                }
                spells.splice(i, 1);
            }

        // ── 10. Solar Supernova ──
        } else if (s.kind === 'solar_supernova') {
            s.duration -= dt;
            const progress = 1 - (s.duration / s.maxDuration);
            s.radius = s.maxRadius * Math.sin(progress * Math.PI * 0.5);

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.radius + e.radius) {
                    hitEnemy(e, s.damage, s.color);
                    e.burnTimer = 4.5;
                    const a = Math.atan2(e.y - s.y, e.x - s.x);
                    e.vx += Math.cos(a) * 160;
                    e.vy += Math.sin(a) * 160;
                    s.hit.add(e.id);
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 11. Fire Tornado ──
        } else if (s.kind === 'fire_tornado') {
            s.x += Math.cos(s.angle) * s.speed * dt;
            s.y += Math.sin(s.angle) * s.speed * dt;
            s.life -= dt;
            s.tickTimer -= dt;

            // Gravitational vortex pull
            for (const e of enemies) {
                if (e.dead) continue;
                const d = dist(s, e);
                if (d < s.radius * 1.8) {
                    const a = Math.atan2(s.y - e.y, s.x - e.x);
                    e.vx += Math.cos(a) * 130;
                    e.vy += Math.sin(a) * 130;
                }
            }

            if (s.tickTimer <= 0) {
                s.tickTimer = 0.18;
                for (const e of enemies) {
                    if (e.dead) continue;
                    if (dist(s, e) < s.radius + e.radius) {
                        hitEnemy(e, s.damage * 0.32, s.color);
                        e.burnTimer = Math.max(e.burnTimer, 2.5);
                    }
                }
            }

            if (s.life <= 0 || isWall(s.x, s.y)) spells.splice(i, 1);

        // ── 12. Storm Rain Cloud ──
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

        // ── 13. Homing Storm Shards ──
        } else if (s.kind === 'homing_shard') {
            s.trail.push({ x: s.x, y: s.y });
            if (s.trail.length > 8) s.trail.shift();

            let nearest = null, nd = 360;
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
                s.angle += Math.sign(diff) * Math.min(Math.abs(diff), dt * 7.5);
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

        // ── 14. Fissure Ground Crack ──
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

        // ── 15. Golem Rocket Fist ──
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

        // ── 16. Orbiting Shield Orbs ──
        } else if (s.kind === 'orbiting_shield') {
            s.duration -= dt;
            const orbitSpeed = 4.2;
            const orbitA = (Date.now() * 0.003 * orbitSpeed) + (s.orbitIndex / s.totalOrbits) * Math.PI * 2;
            const orbitRadius = 65;
            s.x = player.x + Math.cos(orbitA) * orbitRadius;
            s.y = player.y + Math.sin(orbitA) * orbitRadius;

            for (const [eId, cd] of s.hitCooldowns) {
                s.hitCooldowns.set(eId, cd - dt);
                if (cd <= 0) s.hitCooldowns.delete(eId);
            }

            for (const e of enemies) {
                if (e.dead || s.hitCooldowns.has(e.id)) continue;
                if (dist(s, e) < e.radius + s.radius + 4) {
                    hitEnemy(e, s.damage, s.color);
                    e.vx += Math.cos(orbitA) * s.knockback;
                    e.vy += Math.sin(orbitA) * s.knockback;
                    s.hitCooldowns.set(e.id, 0.4);
                    lightningFlashes.push({ x1: s.x, y1: s.y, x2: e.x, y2: e.y, color: s.glow, life: 0.12, maxLife: 0.12 });
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 17. Electric Pylon Totem ──
        } else if (s.kind === 'electric_pylon') {
            s.duration -= dt;
            s.pulseTimer -= dt;

            if (s.pulseTimer <= 0) {
                s.pulseTimer = 0.7;
                doShake(2, 0.08);
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

        // ── 18. Sonic Shockwave ──
        } else if (s.kind === 'sonic_shockwave') {
            s.duration -= dt;
            const progress = 1 - (s.duration / s.maxDuration);
            s.radius = s.maxRadius * Math.sin(progress * Math.PI * 0.5);

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.radius + e.radius) {
                    hitEnemy(e, s.damage, s.color);
                    e.stunTimer = Math.max(e.stunTimer, s.stun);
                    s.hit.add(e.id);
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 19. Heaven's Wrath (Thunderstorm Barrage) ──
        } else if (s.kind === 'heavens_wrath') {
            s.duration -= dt;
            s.strikeTimer -= dt;

            if (s.strikeTimer <= 0) {
                s.strikeTimer = 0.14;
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
                    x1: strikeX, y1: strikeY - 320,
                    x2: strikeX, y2: strikeY,
                    color: '#6c5ce7', life: 0.18, maxLife: 0.18
                });
                doShake(3, 0.1);
                spawnBurst(strikeX, strikeY, '#a29bfe', 8, 100, 4, 0.3);

                for (const e of enemies) {
                    if (e.dead) continue;
                    if (Math.hypot(e.x - strikeX, e.y - strikeY) < 55) {
                        hitEnemy(e, s.damage * 0.45, '#a29bfe');
                        e.stunTimer = Math.max(e.stunTimer, s.stun || 0.4);
                    }
                }
            }

            if (s.duration <= 0) spells.splice(i, 1);

        // ── 20. Classic Expanding Radial Area Spells ──
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

        // ── 21. Hydro Geyser Pressure Eruption ──
        } else if (s.kind === 'hydro_geyser') {
            s.duration -= dt;
            const progress = 1 - (s.duration / s.maxDuration);
            s.radius = s.maxRadius * Math.sin(progress * Math.PI);

            for (const e of enemies) {
                if (e.dead || s.hit.has(e.id)) continue;
                if (dist(s, e) < s.radius + e.radius) {
                    applySpellHit(s, e);
                    s.hit.add(e.id);
                }
            }

            if (Math.random() < 0.6) {
                const a = rng(0, Math.PI * 2);
                spawnParticle(s.x, s.y, Math.cos(a) * rng(40, 160), Math.sin(a) * rng(40, 160), '#74b9ff', 0.35, rng(2, 5));
            }

            if (s.duration <= 0) spells.splice(i, 1);
        }
    }
}

// ─── Spell Explosion Physics (Shrapnel, Clusters, AOE) ───────
function explodeSpell(s) {
    spawnBurst(s.x, s.y, s.color, 14, 130, s.radius * 0.7, 0.45);
    spawnBurst(s.x, s.y, s.glow, 8, 90, s.radius * 0.5, 0.3);
    doShake(3.5, 0.14);

    // Rock Shrapnel Shatter for Earth spells
    if (s.shatter) {
        const shardCount = s.shatterCount || 4;
        for (let k = 0; k < shardCount; k++) {
            const a = rng(0, Math.PI * 2);
            spells.push({
                kind: 'projectile',
                x: s.x, y: s.y,
                angle: a,
                speed: rng(260, 420),
                damage: Math.max(10, Math.round(s.damage * 0.35)),
                radius: 6,
                hitRadius: 18,
                visual: 'stone_shard',
                color: s.color || '#b7791f',
                glow: s.glow || '#d69e2e',
                pierce: false,
                stun: 0.6,
                knockback: 120,
                life: 0.45,
                hit: new Set(),
                trail: [],
                animTime: 0,
                bounces: 0,
            });
        }
        spawnBurst(s.x, s.y, s.color || '#b7791f', 12, 110, 4, 0.35, 'square');
        doShake(3.5, 0.12);
    }

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
        const shove = s.knockback * 0.045;
        wallSlide(e, e.x + Math.cos(a) * shove, e.y + Math.sin(a) * shove, e.radius);
    }
    if (s.burn) e.burnTimer = Math.max(e.burnTimer, 3.5);
    if (s.slow > 0) { e.slowTimer = Math.max(e.slowTimer, 2.5); e.slowFactor = s.slow; }
    if (s.stun > 0) e.stunTimer = Math.max(e.stunTimer, s.stun);
}

// ─── Custom Canvas 2D Drawing per Spell Output ───────────────
function drawSpells() {
    for (const s of spells) {
        // ── 1. Projectiles, Helix & Shards ──
        if (s.kind === 'projectile' || s.kind === 'helix' || s.kind === 'homing_shard' || s.kind === 'cyclone') {
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

            // Cyclone visual
            if (s.kind === 'cyclone') {
                ctx.rotate((s.animTime || 0) * 12);
                ctx.strokeStyle = '#74b9ff';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, 0, Math.PI * 1.3);
                ctx.stroke();

                ctx.strokeStyle = '#e056fd';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * 0.65, Math.PI * 0.7, Math.PI * 1.9);
                ctx.stroke();

            // Magma ball / Dripper
            } else if (s.visual === 'magma_dripper') {
                ctx.fillStyle = '#ff793f';
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 1.35, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d63031';
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 1.05, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#532f1d';
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.arc(0, 0, s.radius * 0.65, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Water Jets
            } else if (s.visual === 'aqua_jets') {
                ctx.rotate(s.angle);
                ctx.fillStyle = '#00a8ff';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, s.radius, Math.PI * 0.5, Math.PI * 1.5);
                ctx.lineTo(s.radius * 1.8, 0);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Foam highlight
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(s.radius * 0.4, 0, s.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();

            // Stone Lance
            } else if (s.visual === 'stone_lance') {
                ctx.rotate(s.angle);
                ctx.fillStyle = '#b7791f';
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(s.radius * 2.2, 0);
                ctx.lineTo(-s.radius * 1.2, -s.radius * 0.85);
                ctx.lineTo(-s.radius * 0.7, 0);
                ctx.lineTo(-s.radius * 1.2, s.radius * 0.85);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                // Granite highlight
                ctx.fillStyle = '#d69e2e';
                ctx.beginPath();
                ctx.moveTo(s.radius * 1.8, 0);
                ctx.lineTo(-s.radius * 0.5, -s.radius * 0.4);
                ctx.lineTo(-s.radius * 0.5, s.radius * 0.4);
                ctx.closePath();
                ctx.fill();

            // Ricochet Spark
            } else if (s.visual === 'ricochet_spark') {
                ctx.rotate((s.animTime || 0) * 16);
                ctx.fillStyle = '#a29bfe';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                const pts = 5;
                for (let k = 0; k < pts * 2; k++) {
                    const a = (k / (pts * 2)) * Math.PI * 2;
                    const rad = (k % 2 === 0) ? s.radius * 1.4 : s.radius * 0.5;
                    if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            // Rolling Boulder & Molten Juggernaut
            } else if (s.visual === 'rolling_boulder' || s.visual === 'molten_juggernaut') {
                ctx.rotate((s.animTime || 0) * 10);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 3;
                ctx.beginPath();
                const pts = 7;
                for (let k = 0; k < pts; k++) {
                    const a = (k / pts) * Math.PI * 2;
                    const rad = s.radius * (0.82 + 0.22 * ((k % 2 === 0) ? 1 : -0.6));
                    if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                }
                ctx.closePath();
                ctx.fill(); ctx.stroke();

                if (s.visual === 'molten_juggernaut') {
                    ctx.fillStyle = '#ff793f';
                    ctx.beginPath();
                    ctx.arc(0, 0, s.radius * 0.45, 0, Math.PI * 2);
                    ctx.fill();
                }

            // Electric Tether Water Dart
            } else if (s.visual === 'electric_tether') {
                ctx.rotate(s.angle);
                ctx.fillStyle = '#00d2d3';
                ctx.strokeStyle = '#a29bfe';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(s.radius * 2, 0);
                ctx.lineTo(-s.radius, -s.radius * 0.6);
                ctx.lineTo(-s.radius, s.radius * 0.6);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            // Plasma Shotgun Needle
            } else if (s.isPlasmaNeedle) {
                ctx.rotate(s.angle);
                ctx.fillStyle = '#ff3838';
                ctx.strokeStyle = '#e056fd';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(s.radius * 2.2, 0);
                ctx.lineTo(-s.radius, -s.radius * 0.4);
                ctx.lineTo(-s.radius, s.radius * 0.4);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            // Homing Storm Shard
            } else if (s.kind === 'homing_shard') {
                ctx.rotate(s.angle);
                ctx.fillStyle = s.color;
                ctx.strokeStyle = '#a29bfe';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(s.radius * 1.6, 0);
                ctx.lineTo(-s.radius, -s.radius * 0.6);
                ctx.lineTo(-s.radius * 0.4, 0);
                ctx.lineTo(-s.radius, s.radius * 0.6);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            // Stone Shard
            } else if (s.visual === 'stone_shard') {
                ctx.rotate((s.animTime || 0) * 16);
                ctx.fillStyle = s.color || '#b7791f';
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(s.radius * 1.2, 0);
                ctx.lineTo(-s.radius * 0.7, -s.radius * 0.9);
                ctx.lineTo(-s.radius * 0.5, s.radius * 0.9);
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            // Fireball & General Orbs
            } else {
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
            ctx.strokeStyle = s.glow;
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(s.startX, s.startY);
            ctx.lineTo(s.endX, s.endY);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(s.startX, s.startY);
            ctx.lineTo(s.endX, s.endY);
            ctx.stroke();
            ctx.restore();

        // ── 4. Sky Meteor Reticle & Shadow ──
        } else if (s.kind === 'sky_meteor') {
            ctx.save();
            ctx.strokeStyle = '#ff3838';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.arc(s.targetX, s.targetY, s.aoe * (1 - s.progress * 0.4), 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            const meteorX = s.targetX + 160 * (1 - s.progress);
            const meteorY = s.targetY - 380 * (1 - s.progress);
            ctx.fillStyle = '#ff793f';
            ctx.beginPath();
            ctx.arc(meteorX, meteorY, 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        // ── 5. Volcanic Fissure ──
        } else if (s.kind === 'volcanic_fissure') {
            ctx.save();
            ctx.fillStyle = '#c0392b';
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.aoe * s.progress, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

        // ── 6. Solar Supernova ──
        } else if (s.kind === 'solar_supernova') {
            ctx.save();
            const alpha = Math.min(1, s.duration / s.maxDuration * 1.5);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(254, 211, 48, 0.4)';
            ctx.strokeStyle = '#fa8231';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        // ── 7. Fire Tornado ──
        } else if (s.kind === 'fire_tornado') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate((s.animTime || 0) * 9);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 4;
            for (let k = 1; k <= 3; k++) {
                ctx.beginPath();
                ctx.arc(0, 0, s.radius * (k / 3), 0, Math.PI * 1.4);
                ctx.stroke();
            }
            ctx.restore();

        // ── 8. Storm Rain Cloud ──
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

        // ── 9. Fissure Ground Crack ──
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

        // ── 10. Golem Rocket Fist ──
        } else if (s.kind === 'rocket_fist') {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);
            ctx.fillStyle = '#576574';
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(-s.radius * 0.8, -s.radius * 0.8, s.radius * 1.6, s.radius * 1.6, 8);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#222f3e';
            for (let k = -2; k <= 2; k += 1.3) {
                ctx.beginPath();
                ctx.arc(s.radius * 0.8, k * 7, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

        // ── 11. Orbiting Shield Orbs ──
        } else if (s.kind === 'orbiting_shield') {
            ctx.save();
            ctx.fillStyle = s.color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

        // ── 12. Electric Pylon Totem ──
        } else if (s.kind === 'electric_pylon') {
            ctx.save();
            ctx.fillStyle = '#2c3e50';
            ctx.strokeStyle = '#a29bfe';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - s.radius * 1.6);
            ctx.lineTo(s.x + s.radius, s.y + s.radius);
            ctx.lineTo(s.x - s.radius, s.y + s.radius);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            ctx.strokeStyle = '#a29bfe';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.pulseRadius * (1 - s.pulseTimer / 0.7), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

        // ── 13. Area Shockwave Rings & Sonic Shockwave ──
        } else if (s.kind === 'area' || s.kind === 'sonic_shockwave') {
            const progress = s.duration / s.maxDuration;
            ctx.save();
            ctx.globalAlpha = Math.min(1, progress * 1.3);
            ctx.strokeStyle = s.glow || s.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

        // ── 14. Hydro Geyser Eruption ──
        } else if (s.kind === 'hydro_geyser') {
            ctx.save();
            ctx.globalAlpha = Math.min(1, (s.duration / s.maxDuration) * 1.5);
            ctx.strokeStyle = '#00a8ff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(116, 185, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 0.75, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}
