// ============================================================
//  PASSURA: Elemental Arena — js/map.js
//  Dungeon Grid Generation, Collision Handling, Camera & Minimap
// ============================================================

// ─── Camera System ───────────────────────────────────────────
const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    update(dt) {
        if (typeof player !== 'undefined') {
            this.targetX = player.x - BASE_W / 2;
            this.targetY = player.y - BASE_H / 2;
        }
        this.targetX = clamp(this.targetX, 0, WORLD_W - BASE_W);
        this.targetY = clamp(this.targetY, 0, WORLD_H - BASE_H);

        // Smooth lerp
        const lerpFactor = Math.min(1, dt * 9);
        this.x += (this.targetX - this.x) * lerpFactor;
        this.y += (this.targetY - this.y) * lerpFactor;

        // Sync world mouse position
        mouse.x = mouse.screenX + this.x;
        mouse.y = mouse.screenY + this.y;
    }
};

// ─── Large Dungeon Map Generation ────────────────────────────
// 0 = Floor, 1 = Solid Stone Wall
const MAP = [];
let miniMapCanvas = null;

function updateMiniMapCache() {
    miniMapCanvas = document.createElement('canvas');
    miniMapCanvas.width = 148;
    miniMapCanvas.height = 106;
    const mctx = miniMapCanvas.getContext('2d');

    // Background of minimap
    mctx.fillStyle = '#141822';
    mctx.fillRect(0, 0, 148, 106);

    const tw = 148 / MAP_COLS;
    const th = 106 / MAP_ROWS;

    // Draw stone walls in sleek slate color
    mctx.fillStyle = '#424c5e';
    for (let r = 0; r < MAP_ROWS; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
            if (MAP[r][c] === 1) {
                mctx.fillRect(c * tw, r * th, Math.ceil(tw), Math.ceil(th));
            }
        }
    }
}

function generateMap() {
    MAP.length = 0;
    for (let r = 0; r < MAP_ROWS; r++) {
        MAP[r] = [];
        for (let c = 0; c < MAP_COLS; c++) {
            // Perimeter border walls
            if (r === 0 || r === MAP_ROWS - 1 || c === 0 || c === MAP_COLS - 1) {
                MAP[r][c] = 1;
            } else {
                MAP[r][c] = 0;
            }
        }
    }

    // Add perimeter alcoves and entrances (matching cartoon dungeon reference)
    for (let c = 12; c < MAP_COLS - 12; c += 14) {
        MAP[1][c] = 1;
        MAP[MAP_ROWS - 2][c] = 1;
    }
    for (let r = 8; r < MAP_ROWS - 8; r += 10) {
        MAP[r][1] = 1;
        MAP[r][MAP_COLS - 2] = 1;
    }

    // Add architectural stone pillars across the large dungeon
    const spacingX = 8, spacingY = 7;
    for (let r = 4; r < MAP_ROWS - 4; r += spacingY) {
        for (let c = 5; c < MAP_COLS - 5; c += spacingX) {
            // Keep central arena open
            const distFromCenter = Math.hypot(c - MAP_COLS / 2, r - MAP_ROWS / 2);
            if (distFromCenter > 4) {
                MAP[r][c] = 1;
                // Some pillars 2-tiles wide or tall
                if ((r + c) % 3 === 0) MAP[r][c + 1] = 1;
                else if ((r + c) % 5 === 0) MAP[r + 1][c] = 1;
            }
        }
    }

    // Update the cached minimap graphic
    updateMiniMapCache();
}

function isWall(x, y) {
    const c = Math.floor(x / TILE);
    const r = Math.floor(y / TILE);
    if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true;
    return MAP[r] && MAP[r][c] === 1;
}

function isWallBox(x, y, radius = 14) {
    const m = radius;
    return isWall(x - m, y - m) || isWall(x + m, y - m) ||
           isWall(x - m, y + m) || isWall(x + m, y + m) ||
           isWall(x, y - m) || isWall(x, y + m) ||
           isWall(x - m, y) || isWall(x + m, y);
}

function wallSlide(obj, nx, ny, radius = 14) {
    const m = radius;
    // 1. Direct move
    if (!isWallBox(nx, ny, m)) {
        obj.x = nx; obj.y = ny; return true;
    }
    // 2. Slide X only
    if (!isWallBox(nx, obj.y, m)) {
        obj.x = nx; return true;
    }
    // 3. Slide Y only
    if (!isWallBox(obj.x, ny, m)) {
        obj.y = ny; return true;
    }
    // 4. Corner nudges: if caught on a convex corner, nudge along open tangent
    const step = 4;
    if (!isWallBox(obj.x + step, obj.y, m)) { obj.x += step; return true; }
    if (!isWallBox(obj.x - step, obj.y, m)) { obj.x -= step; return true; }
    if (!isWallBox(obj.x, obj.y + step, m)) { obj.y += step; return true; }
    if (!isWallBox(obj.x, obj.y - step, m)) { obj.y -= step; return true; }
    return false;
}

function drawMap() {
    // Frustum Culling based on camera
    const startCol = Math.max(0, Math.floor(camera.x / TILE) - 1);
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((camera.x + BASE_W) / TILE) + 1);
    const startRow = Math.max(0, Math.floor(camera.y / TILE) - 1);
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((camera.y + BASE_H) / TILE) + 1);

    for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
            const x = c * TILE;
            const y = r * TILE;

            if (MAP[r][c] === 1) {
                // Slate Stone Wall (Clean 2.5D Cartoon Style)
                ctx.fillStyle = '#39414e';
                ctx.fillRect(x, y, TILE, TILE);

                // Top block highlight (bevel)
                ctx.fillStyle = '#4f596b';
                ctx.fillRect(x + 2, y + 2, TILE - 4, 8);

                // Wall inner shadow bottom & right
                ctx.fillStyle = '#262c36';
                ctx.fillRect(x + 2, y + TILE - 5, TILE - 4, 3);
                ctx.fillRect(x + TILE - 5, y + 2, 3, TILE - 4);

                // Outer crisp black cartoon border
                ctx.strokeStyle = '#181b22';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);

            } else {
                // Dark Grid Floor Tiles
                ctx.fillStyle = '#181b22';
                ctx.fillRect(x, y, TILE, TILE);

                // Tile grid border
                ctx.strokeStyle = '#252934';
                ctx.lineWidth = 1.2;
                ctx.strokeRect(x, y, TILE, TILE);

                // Floor grain detail
                if ((r * 7 + c * 13) % 19 === 0) {
                    ctx.fillStyle = '#212530';
                    ctx.fillRect(x + 8, y + 8, 4, 4);
                }
            }
        }
    }
}

