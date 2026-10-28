// ============================================================
//  PASSURA: Elemental Arena — js/ui.js
//  Heads-Up Display (HUD), Minimap Radar & State Overlays
// ============================================================

function drawHUD() {
    ctx.save();

    // ── 1. Top-Left: Avatar Portrait & HP / Mana Bars ──
    const avatarX = 40, avatarY = 40, avatarR = 24;

    // HP Capsule Bar
    const hpX = avatarX + avatarR + 10, hpY = avatarY - avatarR + 4, hpW = 160, hpH = 18;
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW, hpH, 9);
    ctx.fill();

    const hpPct = clamp(player.hp / player.maxHp, 0, 1);
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW * hpPct, hpH, 9);
    ctx.fill();

    // White outline for HP
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(hpX, hpY, hpW, hpH, 9);
    ctx.stroke();

    // Mana Capsule Bar
    const manaX = hpX, manaY = hpY + hpH + 6, manaW = 145, manaH = 14;
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW, manaH, 7);
    ctx.fill();

    const manaPct = clamp(player.mana / player.maxMana, 0, 1);
    ctx.fillStyle = '#0984e3';
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW * manaPct, manaH, 7);
    ctx.fill();

    // White outline for Mana
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW, manaH, 7);
    ctx.stroke();

    // Circular Avatar Frame with Red Hooded Mage inside
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Mini Avatar inside
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR - 3, 0, Math.PI * 2);
    ctx.clip();
    // Hood body
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY + 2, 16, 0, Math.PI * 2);
    ctx.fill();
    // Dark face opening
    ctx.fillStyle = '#181b22';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY + 2, 9, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(avatarX - 3, avatarY + 1, 2, 0, Math.PI * 2);
    ctx.arc(avatarX + 3, avatarY + 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();


    // ── 2. Top-Right: Minimap & Tactical Radar ──
    const mmW = 148, mmH = 106;
    const mmX = BASE_W - mmW - 20;
    const mmY = 16;

    // Minimap Background Panel
    ctx.save();
    ctx.fillStyle = 'rgba(16, 20, 28, 0.92)';
    ctx.strokeStyle = '#3e495c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(mmX, mmY, mmW, mmH, 8);
    ctx.fill(); ctx.stroke();

    // Clip to minimap interior
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(mmX + 1, mmY + 1, mmW - 2, mmH - 2, 7);
    ctx.clip();

    // Draw cached dungeon wall map
    if (miniMapCanvas) {
        ctx.drawImage(miniMapCanvas, mmX, mmY, mmW, mmH);
    }

    // Draw Camera Viewport Box on Minimap
    const camVX = mmX + (camera.x / WORLD_W) * mmW;
    const camVY = mmY + (camera.y / WORLD_H) * mmH;
    const camVW = (BASE_W / WORLD_W) * mmW;
    const camVH = (BASE_H / WORLD_H) * mmH;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(camVX, camVY, camVW, camVH);

    // Draw Enemies on Minimap
    for (const e of enemies) {
        if (e.dead) continue;
        const ex = mmX + (e.x / WORLD_W) * mmW;
        const ey = mmY + (e.y / WORLD_H) * mmH;
        const dotR = e.type === 'golem' ? 3.5 : 2.5;
        const dotColor = e.type === 'wraith' ? '#a29bfe' : e.type === 'golem' ? '#ffa502' : '#ff4757';
        
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Player on Minimap
    const px = mmX + (player.x / WORLD_W) * mmW;
    const py = mmY + (player.y / WORLD_H) * mmH;
    
    // Player pulsing dot
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Player heading line on minimap
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + Math.cos(player.angle) * 6, py + Math.sin(player.angle) * 6);
    ctx.stroke();

    ctx.restore(); // end clip

    // Radar title
    ctx.fillStyle = '#8395a7';
    ctx.font = '800 9px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('RADAR', mmX + 6, mmY + 12);
    ctx.restore();

    // ── Wave, Kills, and Remaining Enemy Counters (Left of Minimap) ──
    const textRightX = mmX - 16;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`WAVE ${String(wave.number).padStart(2, '0')}`, textRightX, 38);

    ctx.font = '800 14px "Segoe UI", sans-serif';
    ctx.fillStyle = '#c8d6e5';
    ctx.fillText(`KILLS: ${wave.kills}`, textRightX, 58);

    const aliveCount = enemies.filter(e => !e.dead).length;
    ctx.fillStyle = aliveCount > 0 ? '#ff6b6b' : '#1dd1a1';
    ctx.font = '800 13px "Segoe UI", sans-serif';
    ctx.fillText(`MUSUH: ${aliveCount}`, textRightX, 78);

    // ── Off-screen Enemy Pointers (Radar Edge Arrows) ──
    for (const e of enemies) {
        if (e.dead) continue;
        const isOffScreen = e.x < camera.x || e.x > camera.x + BASE_W || e.y < camera.y || e.y > camera.y + BASE_H;
        if (!isOffScreen) continue;

        // Calculate vector from camera center to enemy
        const screenCenterX = BASE_W / 2;
        const screenCenterY = BASE_H / 2;
        const dx = e.x - (camera.x + screenCenterX);
        const dy = e.y - (camera.y + screenCenterY);
        const ang = Math.atan2(dy, dx);

        // Intersect ray with screen edge margins
        const pad = 24;
        const halfW = (BASE_W / 2) - pad;
        const halfH = (BASE_H / 2) - pad;
        const rayScale = Math.min(
            Math.abs(halfW / Math.cos(ang)),
            Math.abs(halfH / Math.sin(ang))
        );

        const arrowX = screenCenterX + Math.cos(ang) * rayScale;
        const arrowY = screenCenterY + Math.sin(ang) * rayScale;

        // Draw clean chevron arrow pointing to offscreen enemy
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(ang);
        ctx.fillStyle = '#ff4757';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
    }


    // ── 3. Bottom-Center: Hotbar (Keys 1-4) & Spell Queue ──
    const btnSize = 48, btnGap = 8;
    const totalEl = 4;
    const totalQueueSlots = 5;

    const elBarW = totalEl * (btnSize + btnGap) - btnGap;
    const qBarW = totalQueueSlots * (btnSize + btnGap) - btnGap;
    const barTotalW = elBarW + 20 + qBarW;

    const startBarX = (BASE_W - barTotalW) / 2;
    const barY = BASE_H - btnSize - 32;

    // Background Container for Elements & Queue
    ctx.fillStyle = 'rgba(24, 27, 36, 0.9)';
    ctx.strokeStyle = '#383e4d';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(startBarX - 12, barY - 10, elBarW + 24, btnSize + 20, 12);
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(startBarX + elBarW + 14, barY - 10, qBarW + 24, btnSize + 20, 12);
    ctx.fill(); ctx.stroke();

    // ── Element Slots [1], [2], [3], [4] ──
    const elementKeys = ['1', '2', '3', '4'];
    for (let i = 0; i < 4; i++) {
        const k = elementKeys[i];
        const el = ELEMENTS[k];
        const bx = startBarX + i * (btnSize + btnGap);
        const by = barY;

        // Button body
        ctx.fillStyle = el.color + '22';
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(bx, by, btnSize, btnSize, 8);
        ctx.fill(); ctx.stroke();

        // Icon inside button
        drawElementIcon(bx + btnSize / 2, by + btnSize / 2, 13, el);

        // Key Tab Pill on top: [1], [2], [3], [4]
        ctx.fillStyle = '#1c202a';
        ctx.strokeStyle = '#4f596b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx + btnSize / 2 - 11, by - 16, 22, 16, 4);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 11px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.key, bx + btnSize / 2, by - 4);
    }

    // ── Queue Slots (Shows current crafted elements) ──
    const queueStartX = startBarX + elBarW + 26;
    for (let i = 0; i < totalQueueSlots; i++) {
        const qx = queueStartX + i * (btnSize + btnGap);
        const qy = barY;
        const queuedKey = player.queue[i];

        if (queuedKey) {
            const el = ELEMENTS[queuedKey];
            ctx.fillStyle = el.color + '33';
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(qx, qy, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();

            // Element Key Label inside Queue Box
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 18px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(el.key, qx + btnSize / 2, qy + btnSize / 2 + 6);
        } else {
            // Empty slot
            ctx.fillStyle = 'rgba(16, 18, 25, 0.7)';
            ctx.strokeStyle = '#2d3340';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(qx, qy, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();
        }
    }

    // ── Active Spell Preview Tooltip ──
    const spell = getSpell(player.queue);
    if (spell) {
        ctx.fillStyle = 'rgba(20, 23, 31, 0.95)';
        ctx.strokeStyle = '#ff793f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 180, barY - 44, 360, 26, 6);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f1c40f';
        ctx.font = '800 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ${spell.name}  —  ${spell.desc}`, BASE_W / 2, barY - 27);
    }

    // ── Controls Hint Text (Bottom-most) ──
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '700 11px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WASD: Gerak  |  1-4: Racik Elemen  |  Klik Kiri: Tembak  |  Klik Kanan: Area/Bertahan  |  Backspace: Hapus', BASE_W / 2, BASE_H - 10);

    // ── Between Waves Banner ──
    if (!wave.active && wave.betweenWaveTimer > 0) {
        ctx.fillStyle = 'rgba(18, 20, 28, 0.85)';
        ctx.strokeStyle = '#2ed573';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 160, 80, 320, 38, 8);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#2ed573';
        ctx.font = '900 15px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Wave ${wave.number + 1} dimulai dalam ${Math.ceil(wave.betweenWaveTimer)}s...`, BASE_W / 2, 104);
    }

    ctx.restore();
}

// ─── Screen Overlays (Start, Dead, Pause) ─────────────────────
function drawStartScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.9)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ff4757';
    ctx.font = '900 52px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PASSURA', BASE_W / 2, BASE_H / 2 - 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Segoe UI", sans-serif';
    ctx.fillText('ELEMENTAL ARENA', BASE_W / 2, BASE_H / 2 - 45);

    ctx.fillStyle = '#a4b0be';
    ctx.font = '600 14px "Segoe UI", sans-serif';
    ctx.fillText('WASD: Gerak   |   1 2 3 4: Pilih Elemen   |   Klik Kiri: Tembak   |   Klik Kanan: Area', BASE_W / 2, BASE_H / 2 + 10);
    ctx.fillText('Gabungkan 1, 2, hingga 3 elemen untuk menciptakan puluhan mantra mematikan!', BASE_W / 2, BASE_H / 2 + 35);

    ctx.fillStyle = '#2ed573';
    ctx.font = '900 20px "Segoe UI", sans-serif';
    ctx.fillText('Tekan SPACE untuk Mulai Petualangan', BASE_W / 2, BASE_H / 2 + 85);
}

function drawDeadScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.88)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ff4757';
    ctx.font = '900 56px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GUGUR', BASE_W / 2, BASE_H / 2 - 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px "Segoe UI", sans-serif';
    ctx.fillText(`Mencapai Wave ${wave.number}  •  Kills: ${wave.kills}`, BASE_W / 2, BASE_H / 2 + 15);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '800 18px "Segoe UI", sans-serif';
    ctx.fillText('Tekan SPACE untuk Bermain Lagi', BASE_W / 2, BASE_H / 2 + 60);
}

function drawPauseScreen() {
    ctx.fillStyle = 'rgba(10, 12, 16, 0.75)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', BASE_W / 2, BASE_H / 2 - 10);

    ctx.font = '600 16px "Segoe UI", sans-serif';
    ctx.fillStyle = '#a4b0be';
    ctx.fillText('Tekan ESC untuk Melanjutkan', BASE_W / 2, BASE_H / 2 + 28);
}

// ─── Game State & Reset ──────────────────────────────────────
