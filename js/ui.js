// ============================================================
//  PASSURA: Elemental Arena — js/ui.js
//  Heads-Up Display (HUD), Minimap Radar, Boss Bars & Overlays
// ============================================================

function drawHUD() {
    ctx.save();

    // ── 0. Vampire Survivors Top-Screen XP Bar ──
    const topXpPct = clamp((player.xp || 0) / (player.nextXp || 20), 0, 1);
    ctx.fillStyle = 'rgba(20, 24, 34, 0.9)';
    ctx.fillRect(0, 0, BASE_W, 7);

    // Green emerald progress fill
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(0, 0, BASE_W * topXpPct, 6);

    // Golden glint highlight at front of progress bar
    if (topXpPct > 0 && topXpPct < 1) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(BASE_W * topXpPct - 2, 0, 2, 6);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 6, BASE_W, 1);

    // ── 1. Top-Left: Avatar Portrait & HP / Mana / XP Bars ──
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

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(manaX, manaY, manaW, manaH, 7);
    ctx.stroke();

    // XP Mini-Bar under Mana
    const xpX = manaX, xpY = manaY + manaH + 5, xpW = 125, xpH = 8;
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.roundRect(xpX, xpY, xpW, xpH, 4);
    ctx.fill();

    const xpPct = clamp((player.xp || 0) / (player.nextXp || 20), 0, 1);
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.roundRect(xpX, xpY, xpW * xpPct, xpH, 4);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(xpX, xpY, xpW, xpH, 4);
    ctx.stroke();

    // Circular Avatar Frame with Red Hooded Mage inside
    ctx.fillStyle = '#1c1f26';
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.stroke();

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

    // Golden Level Badge at Avatar Bottom
    const badgeW = 44, badgeH = 15;
    const badgeX = avatarX - badgeW / 2;
    const badgeY = avatarY + avatarR - 5;

    ctx.fillStyle = '#f1c40f';
    ctx.strokeStyle = '#181b22';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#181b22';
    ctx.font = '900 9.5px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`LV. ${player.level || 1}`, avatarX, badgeY + 11);

    // ── Boss Health Bar (Centered at Top) ──
    const activeBoss = enemies.find(e => !e.dead && e.isBoss);
    if (activeBoss) {
        const barW = 400;
        const barH = 14;
        const barX = (BASE_W - barW) / 2;
        const barY = 22;

        // Container frame
        ctx.fillStyle = 'rgba(14, 18, 25, 0.94)';
        ctx.strokeStyle = activeBoss.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(barX - 16, barY - 14, barW + 32, 40, 8);
        ctx.fill(); ctx.stroke();

        // Boss Title
        ctx.font = '900 12px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        const titleText = `👑 ${activeBoss.name.toUpperCase()}  —  ${activeBoss.title || 'BOSS'}`;
        ctx.fillText(titleText, BASE_W / 2, barY - 2);

        // HP Background
        ctx.fillStyle = '#1c202a';
        ctx.beginPath();
        ctx.roundRect(barX, barY + 3, barW, barH, 7);
        ctx.fill();

        // HP Fill
        const hpPct = clamp(activeBoss.hp / activeBoss.maxHp, 0, 1);
        ctx.fillStyle = activeBoss.color;
        ctx.beginPath();
        ctx.roundRect(barX, barY + 3, barW * hpPct, barH, 7);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(barX, barY + 3, barW, barH, 7);
        ctx.stroke();

        // HP Text
        ctx.font = '800 10px "Segoe UI", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2.5;
        const hpStr = `${Math.ceil(activeBoss.hp)} / ${activeBoss.maxHp} HP`;
        ctx.strokeText(hpStr, BASE_W / 2, barY + 14);
        ctx.fillText(hpStr, BASE_W / 2, barY + 14);

        if (activeBoss.hp < activeBoss.maxHp * 0.35) {
            ctx.fillStyle = '#ff3838';
            ctx.font = '900 11px "Segoe UI", sans-serif';
            ctx.fillText('🔥 ENRAGED!', barX + barW + 48, barY + 10);
        }
    }

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
        const dotR = e.isBoss ? 5.5 : e.type === 'golem' ? 3.5 : 2.5;
        const dotColor = e.isBoss ? '#f1c40f' : e.type === 'wraith' ? '#a29bfe' : e.type === 'golem' ? '#ffa502' : '#ff4757';

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(ex, ey, dotR, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw Elemental Scrolls on Minimap (Pulsing Diamond)
    if (typeof scrolls !== 'undefined') {
        for (const s of scrolls) {
            const sx = mmX + (s.x / WORLD_W) * mmW;
            const sy = mmY + (s.y / WORLD_H) * mmH;
            const pulse = 3.5 + Math.sin(Date.now() * 0.01) * 1.5;

            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(sx, sy, pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    // Draw XP Gems on Minimap (Tiny soft green dots)
    if (typeof xpGems !== 'undefined') {
        ctx.fillStyle = '#2ecc71';
        for (const g of xpGems) {
            const gx = mmX + (g.x / WORLD_W) * mmW;
            const gy = mmY + (g.y / WORLD_H) * mmH;
            ctx.fillRect(gx - 1, gy - 1, 2, 2);
        }
    }

    // Draw Player on Minimap
    const px = mmX + (player.x / WORLD_W) * mmW;
    const py = mmY + (player.y / WORLD_H) * mmH;

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();

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

    // ── Wave, Kills, and Remaining Enemy Counters ──
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

    // ── Off-screen Enemy Pointers ──
    for (const e of enemies) {
        if (e.dead) continue;
        const isOffScreen = e.x < camera.x || e.x > camera.x + BASE_W || e.y < camera.y || e.y > camera.y + BASE_H;
        if (!isOffScreen) continue;

        const screenCenterX = BASE_W / 2;
        const screenCenterY = BASE_H / 2;
        const dx = e.x - (camera.x + screenCenterX);
        const dy = e.y - (camera.y + screenCenterY);
        const ang = Math.atan2(dy, dx);

        const pad = 24;
        const halfW = (BASE_W / 2) - pad;
        const halfH = (BASE_H / 2) - pad;
        const rayScale = Math.min(
            Math.abs(halfW / Math.cos(ang)),
            Math.abs(halfH / Math.sin(ang))
        );

        const arrowX = screenCenterX + Math.cos(ang) * rayScale;
        const arrowY = screenCenterY + Math.sin(ang) * rayScale;

        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(ang);
        ctx.fillStyle = e.isBoss ? '#f1c40f' : '#ff4757';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
    }

    // ── Off-screen Scroll Pointers ──
    if (typeof scrolls !== 'undefined') {
        for (const s of scrolls) {
            const isOffScreen = s.x < camera.x || s.x > camera.x + BASE_W || s.y < camera.y || s.y > camera.y + BASE_H;
            if (!isOffScreen) continue;

            const screenCenterX = BASE_W / 2;
            const screenCenterY = BASE_H / 2;
            const dx = s.x - (camera.x + screenCenterX);
            const dy = s.y - (camera.y + screenCenterY);
            const ang = Math.atan2(dy, dx);

            const pad = 34;
            const halfW = (BASE_W / 2) - pad;
            const halfH = (BASE_H / 2) - pad;
            const rayScale = Math.min(
                Math.abs(halfW / Math.cos(ang)),
                Math.abs(halfH / Math.sin(ang))
            );

            const arrowX = screenCenterX + Math.cos(ang) * rayScale;
            const arrowY = screenCenterY + Math.sin(ang) * rayScale;

            ctx.save();
            ctx.translate(arrowX, arrowY);
            ctx.rotate(ang);
            ctx.fillStyle = s.color;
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-7, -8);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-7, 8);
            ctx.closePath();
            ctx.fill(); ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.font = '900 10.5px "Segoe UI", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 3;
            const label = `📜 GULUNGAN ${s.name.toUpperCase()}`;
            ctx.strokeText(label, arrowX, arrowY + 16);
            ctx.fillText(label, arrowX, arrowY + 16);
            ctx.restore();
        }
    }

    // ── 3. Bottom-Center: Hotbar (Keys 1-4) & Spell Queue ──
    const btnSize = 48, btnGap = 8;
    const totalEl = 4;
    const totalQueueSlots = 3;

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

    // ── Element Slots [1], [2], [3], [4] with ENABLE / DISABLE State ──
    const elementKeys = ['1', '2', '3', '4'];
    for (let i = 0; i < 4; i++) {
        const k = elementKeys[i];
        const el = ELEMENTS[k];
        const bx = startBarX + i * (btnSize + btnGap);
        const by = barY;
        const unlocked = isElementUnlocked(k);

        if (unlocked) {
            // ── ENABLED STATE ──
            ctx.fillStyle = el.color + '22';
            ctx.strokeStyle = el.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(bx, by, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();

            // Unlock Flash pulse glow
            if (elementUnlockFlash[k] > 0) {
                const flashAlpha = clamp(elementUnlockFlash[k] / 2.5, 0, 1);
                ctx.save();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3.5;
                ctx.globalAlpha = flashAlpha;
                ctx.strokeRect(bx - 2, by - 2, btnSize + 4, btnSize + 4);
                ctx.restore();
            }

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
        } else {
            // ── DISABLED / LOCKED STATE ──
            ctx.fillStyle = 'rgba(18, 20, 28, 0.88)';
            ctx.strokeStyle = '#323b49';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.roundRect(bx, by, btnSize, btnSize, 8);
            ctx.fill(); ctx.stroke();

            // Faded icon
            drawElementIcon(bx + btnSize / 2, by + btnSize / 2 - 2, 12, el, 0.16, '#485460');

            // Padlock Graphic in Center
            const lockCX = bx + btnSize / 2;
            const lockCY = by + btnSize / 2 + 1;

            // Padlock Shackle
            ctx.strokeStyle = '#a4b0be';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(lockCX, lockCY - 4, 6, Math.PI, 0);
            ctx.stroke();

            // Padlock Body
            ctx.fillStyle = '#718093';
            ctx.strokeStyle = '#181b22';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.roundRect(lockCX - 7.5, lockCY - 4, 15, 13, 3);
            ctx.fill(); ctx.stroke();

            // Keyhole
            ctx.fillStyle = '#181b22';
            ctx.beginPath();
            ctx.arc(lockCX, lockCY + 1.5, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Key Tab Pill on top: dimmed [k]
            ctx.fillStyle = '#14171f';
            ctx.strokeStyle = '#2b3340';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(bx + btnSize / 2 - 11, by - 16, 22, 16, 4);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#57606f';
            ctx.font = '800 11px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(el.key, bx + btnSize / 2, by - 4);

            // Unlock Wave Reminder Badge under slot
            const reqWave = k === '2' ? 5 : k === '3' ? 10 : 15;
            ctx.fillStyle = '#e74c3c';
            ctx.font = '900 8.5px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`W-${reqWave}`, bx + btnSize / 2, by + btnSize + 12);
        }
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

            ctx.fillStyle = '#ffffff';
            ctx.font = '900 18px "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(el.key, qx + btnSize / 2, qy + btnSize / 2 + 6);
        } else {
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
    ctx.fillText('WASD: Gerak  |  1-4: Racik Elemen  |  Klik Kiri: Tembak  |  Klik Kanan: Area  |  Backspace: Hapus', BASE_W / 2, BASE_H - 10);

    // ── Screen Banners ──

    // 1. Boss Alert Banner
    if (wave.bossAlertTimer > 0) {
        ctx.fillStyle = 'rgba(18, 12, 16, 0.94)';
        ctx.strokeStyle = '#ff4757';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 200, 75, 400, 44, 10);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ff4757';
        ctx.font = '900 16px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`⚠️ PERINGATAN: BOSS MUNCUL! (WAVE ${wave.number}) ⚠️`, BASE_W / 2, 95);
        ctx.font = '700 11.5px "Segoe UI", sans-serif';
        ctx.fillStyle = '#f1c40f';
        ctx.fillText('Kalahkan Boss untuk Mendapatkan Gulungan Elemen!', BASE_W / 2, 111);
    }

    // 2. Element Unlock Celebration Banner
    if (activeUnlockBanner && activeUnlockBanner.timer > 0) {
        const b = activeUnlockBanner;
        ctx.fillStyle = 'rgba(16, 22, 32, 0.96)';
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 210, 75, 420, 50, 10);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = b.color;
        ctx.font = '900 17px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`✨ ELEMEN [${b.name.toUpperCase()}] TERBUKA! ✨`, BASE_W / 2, 97);
        ctx.font = '800 12px "Segoe UI", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Tekan tombol [${b.key}] untuk meracik mantra baru!`, BASE_W / 2, 116);
    }

    // 3. Waiting for Scroll Collection Banner
    if (wave.waitingForScroll) {
        const pulse = Math.sin(Date.now() * 0.008) * 4;
        ctx.fillStyle = 'rgba(18, 22, 30, 0.94)';
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(BASE_W / 2 - 190, 80 + pulse, 380, 40, 8);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f1c40f';
        ctx.font = '900 14px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📜 Ambil Gulungan Elemen untuk Melanjutkan!', BASE_W / 2, 105 + pulse);
    }

    // 4. Between Waves Banner
    if (!wave.active && wave.betweenWaveTimer > 0 && !wave.waitingForScroll) {
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
    ctx.fillText('PASSURA', BASE_W / 2, BASE_H / 2 - 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Segoe UI", sans-serif';
    ctx.fillText('ELEMENTAL ARENA', BASE_W / 2, BASE_H / 2 - 55);

    ctx.fillStyle = '#a4b0be';
    ctx.font = '600 14px "Segoe UI", sans-serif';
    ctx.fillText('WASD: Gerak   |   1-4: Pilih Elemen   |   Klik Kiri: Tembak   |   Klik Kanan: Area', BASE_W / 2, BASE_H / 2 - 5);
    ctx.fillText('Gabungkan 1, 2, hingga 3 elemen untuk menciptakan 34 mantra mematikan!', BASE_W / 2, BASE_H / 2 + 20);

    // Progressive Unlock Note
    ctx.fillStyle = '#f1c40f';
    ctx.font = '800 13px "Segoe UI", sans-serif';
    ctx.fillText('⭐ Kalahkan Boss di Wave 5, 10, 15 untuk Unlock Elemen Air, Tanah, dan Petir! ⭐', BASE_W / 2, BASE_H / 2 + 50);

    ctx.fillStyle = '#2ed573';
    ctx.font = '900 20px "Segoe UI", sans-serif';
    ctx.fillText('Tekan SPACE untuk Mulai Petualangan', BASE_W / 2, BASE_H / 2 + 95);
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

// ─── 3-Card Roguelike Upgrade Screen ─────────────────────────
function drawUpgradeScreen() {
    ctx.save();

    // 1. Dark Vignette Backdrop
    ctx.fillStyle = 'rgba(8, 12, 20, 0.86)';
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    // 2. Level Up Header Banner
    const headW = 340, headH = 46;
    const headX = (BASE_W - headW) / 2;
    const headY = 24;

    ctx.fillStyle = 'rgba(20, 26, 38, 0.95)';
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(headX, headY, headW, headH, 10);
    ctx.fill(); ctx.stroke();

    ctx.font = '900 20px "Segoe UI", sans-serif';
    ctx.fillStyle = '#f1c40f';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ LEVEL UP! [LV. ${player.level}] ✨`, BASE_W / 2, headY + 28);

    // Subtitle instruction
    ctx.font = '700 12px "Segoe UI", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Klik kartu pilihanmu untuk meningkatkan kemampuan', BASE_W / 2, headY + 62);

    if (pendingLevelUps > 1) {
        ctx.fillStyle = '#2ed573';
        ctx.font = '800 11.5px "Segoe UI", sans-serif';
        ctx.fillText(`(+${pendingLevelUps} Pilihan Level Up Tersisa)`, BASE_W / 2, headY + 78);
    }

    // 3. Draw The 3 Upgrade Cards
    const cardW = 220;
    const cardH = 320;
    const cardGap = 26;
    const totalW = 3 * cardW + 2 * cardGap;
    const startX = (BASE_W - totalW) / 2;
    const baseY = 110;

    for (let i = 0; i < currentUpgradeCards.length; i++) {
        const c = currentUpgradeCards[i];
        const cardX = startX + i * (cardW + cardGap);
        const isHovered = (hoveredUpgradeCard === i);
        const drawY = isHovered ? baseY - 8 : baseY;

        ctx.save();

        // Drop shadow under card
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(cardX, drawY + 8, cardW, cardH, 14);
        ctx.fill();
        ctx.restore();

        // Rare Pulsing Glow Aura
        if (c.isRare) {
            const pulse = 0.28 + 0.16 * Math.sin(Date.now() * 0.008);
            ctx.fillStyle = '#f1c40f';
            ctx.globalAlpha = pulse;
            ctx.beginPath();
            ctx.roundRect(cardX - 6, drawY - 6, cardW + 12, cardH + 12, 18);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // Card Body Background
        ctx.fillStyle = 'rgba(18, 24, 36, 0.96)';
        ctx.strokeStyle = isHovered ? '#ffffff' : (c.isRare ? '#f1c40f' : c.color);
        ctx.lineWidth = isHovered ? 3.5 : 2.5;
        ctx.beginPath();
        ctx.roundRect(cardX, drawY, cardW, cardH, 14);
        ctx.fill(); ctx.stroke();

        // Category / Rarity Pill at top
        const pillW = c.isRare ? 120 : 90;
        const pillH = 20;
        const pillX = cardX + (cardW - pillW) / 2;
        const pillY = drawY + 12;

        ctx.fillStyle = c.isRare ? '#f1c40f' : c.color + '26';
        ctx.strokeStyle = c.isRare ? '#f39c12' : c.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fill(); ctx.stroke();

        ctx.font = '900 10px "Segoe UI", sans-serif';
        ctx.fillStyle = c.isRare ? '#181b22' : c.color;
        ctx.textAlign = 'center';
        ctx.fillText(c.isRare ? '⭐ LANGKA (RARE) ⭐' : `[ ${c.category} ]`, cardX + cardW / 2, pillY + 14);

        // Current level counter at top-right
        const curLvl = player.upgradeLevels?.[c.id] || 0;
        ctx.font = '800 10px "Segoe UI", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';
        ctx.fillText(`LV. ${curLvl + 1}`, cardX + cardW - 14, drawY + 26);

        // Vector Icon Illustration
        drawUpgradeCardIcon(cardX + cardW / 2, drawY + 76, c.id, c.color, c.isRare);

        // Title
        ctx.font = '900 16px "Segoe UI", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(c.name, cardX + cardW / 2, drawY + 134);

        // Subtitle
        ctx.font = '800 11px "Segoe UI", sans-serif';
        ctx.fillStyle = c.color;
        ctx.fillText(c.sub, cardX + cardW / 2, drawY + 152);

        // Divider line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX + 20, drawY + 164);
        ctx.lineTo(cardX + cardW - 20, drawY + 164);
        ctx.stroke();

        // Multi-line Description
        ctx.font = '600 11.5px "Segoe UI", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        wrapText(ctx, c.desc, cardX + cardW / 2, drawY + 182, cardW - 32, 16);

        // Stat Change Preview Box
        const statBoxY = drawY + 224;
        ctx.fillStyle = 'rgba(10, 14, 22, 0.75)';
        ctx.strokeStyle = c.color + '44';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX + 14, statBoxY, cardW - 28, 28, 6);
        ctx.fill(); ctx.stroke();

        ctx.font = '800 11px "Segoe UI", sans-serif';
        ctx.fillStyle = c.isRare ? '#f1c40f' : '#2ed573';
        ctx.textAlign = 'center';
        ctx.fillText(c.statPreview(), cardX + cardW / 2, statBoxY + 18);

        // Action Button at Bottom
        const btnY = drawY + 264;
        const btnW = cardW - 28;
        const btnH = 38;
        const btnX = cardX + 14;

        ctx.fillStyle = isHovered ? c.color : 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 8);
        ctx.fill(); ctx.stroke();

        ctx.font = '900 12px "Segoe UI", sans-serif';
        ctx.fillStyle = isHovered ? '#181b22' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(isHovered ? '✓ KLIK UNTUK MEMILIH' : 'KLIK UNTUK MEMILIH', cardX + cardW / 2, btnY + 24);

        ctx.restore();
    }

    ctx.restore();
}

// ─── Custom Vector Icon Renderer for Cards ───────────────────
function drawUpgradeCardIcon(cx, cy, type, color, isRare) {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.fillStyle = color + '22';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.strokeStyle = '#181b22';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'strength') {
        // Crossed swords
        ctx.save();
        for (let angle of [-Math.PI / 4, Math.PI / 4]) {
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = '#f1f2f6';
            ctx.strokeStyle = '#2f3542';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(0, -22);
            ctx.lineTo(4, -14);
            ctx.lineTo(3, 8);
            ctx.lineTo(-3, 8);
            ctx.lineTo(-4, -14);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.roundRect(-9, 8, 18, 4, 1.5);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#795548';
            ctx.beginPath();
            ctx.fillRect(-2, 12, 4, 8);
            ctx.strokeRect(-2, 12, 4, 8);

            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(0, 21, 2.5, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();
        }
        ctx.fillStyle = '#ff4757';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'speed') {
        // Winged boot & swift wind streaks
        ctx.save();
        ctx.strokeStyle = '#7bed9f';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(-18, -10); ctx.lineTo(-4, -10);
        ctx.moveTo(-22, 0);   ctx.lineTo(-2, 0);
        ctx.moveTo(-16, 10);  ctx.lineTo(-6, 10);
        ctx.stroke();

        ctx.fillStyle = '#2ed573';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-4, -12);
        ctx.lineTo(4, -12);
        ctx.lineTo(5, 5);
        ctx.lineTo(16, 8);
        ctx.lineTo(16, 14);
        ctx.lineTo(-4, 14);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.lineTo(-14, -16);
        ctx.lineTo(-6, -8);
        ctx.lineTo(-12, -4);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
    } else if (type === 'hp') {
        // Red heart with white cross
        ctx.save();
        ctx.fillStyle = '#ff4757';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2.2;

        ctx.beginPath();
        ctx.moveTo(0, 16);
        ctx.bezierCurveTo(-18, 5, -20, -14, -7, -15);
        ctx.bezierCurveTo(-1, -15, 0, -8, 0, -8);
        ctx.bezierCurveTo(0, -8, 1, -15, 7, -15);
        ctx.bezierCurveTo(20, -14, 18, 5, 0, 16);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-2.5, -4, 5, 12);
        ctx.fillRect(-6, -0.5, 12, 5);
        ctx.restore();
    } else if (type === 'mana') {
        // Arcane Mana Potion Flask
        ctx.save();
        ctx.fillStyle = '#0984e3';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 2.2;

        ctx.beginPath();
        ctx.arc(0, 5, 15, Math.PI * 0.25, Math.PI * 0.75, true);
        ctx.lineTo(4, -8);
        ctx.lineTo(-4, -8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#74b9ff';
        ctx.beginPath();
        ctx.arc(0, 7, 10, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.roundRect(-5, -13, 10, 5, 2);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-4, 3, 2, 0, Math.PI * 2);
        ctx.arc(4, 8, 1.8, 0, Math.PI * 2);
        ctx.arc(-2, 10, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else if (type === 'magnet') {
        // Golden / Two-tone Horseshoe Magnet
        ctx.save();
        ctx.lineWidth = 7;
        ctx.lineCap = 'butt';

        ctx.strokeStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, 0, 14, Math.PI * 0.75, Math.PI * 1.5);
        ctx.stroke();

        ctx.strokeStyle = '#0984e3';
        ctx.beginPath();
        ctx.arc(0, 0, 14, Math.PI * 1.5, Math.PI * 2.25);
        ctx.stroke();

        ctx.fillStyle = '#dfe6e9';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(-16, 7, 6, 7, 1.5);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.roundRect(10, 7, 6, 7, 1.5);
        ctx.fill(); ctx.stroke();

        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 11, 7, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();

        // Attracted XP gem
        ctx.fillStyle = '#2ecc71';
        ctx.strokeStyle = '#181b22';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.lineTo(4, 9);
        ctx.lineTo(0, 14);
        ctx.lineTo(-4, 9);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
    }

    ctx.restore();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, curY);
            line = words[n] + ' ';
            curY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, curY);
}
