const arena = document.getElementById('arena');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const heartsEl = document.getElementById('hearts');
const tipEl = document.getElementById('tip');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const foodTemplate = document.getElementById('food-template');

const foods = [
    { name: 'Blueberries', emoji: '🫐', kind: 'good', points: 12, tip: 'Antioxidant boost for long quests.' },
    { name: 'Spinach', emoji: '🥬', kind: 'good', points: 10, tip: 'Leafy greens support stamina.' },
    { name: 'Salmon', emoji: '🐟', kind: 'good', points: 14, tip: 'Protein keeps your party strong.' },
    { name: 'Brown Rice', emoji: '🍚', kind: 'good', points: 11, tip: 'Steady fuel beats quick sugar spikes.' },
    { name: 'Beans', emoji: '🫘', kind: 'good', points: 13, tip: 'Fiber plus protein makes a strong combo.' },
    { name: 'Broccoli', emoji: '🥦', kind: 'good', points: 9, tip: 'Micronutrients are hidden power-ups.' },
    { name: 'Water', emoji: '💧', kind: 'good', points: 8, tip: 'Hydration keeps focus high.' },
    { name: 'Sugary Soda', emoji: '🥤', kind: 'bad', points: -16, tip: 'Sugary traps cause energy crashes.' },
    { name: 'Fried Basket', emoji: '🍟', kind: 'bad', points: -14, tip: 'Heavy fried foods slow the hero down.' },
    { name: 'Candy Swarm', emoji: '🍬', kind: 'bad', points: -15, tip: 'Treats are occasional loot, not main fuel.' },
    { name: 'Mega Donut', emoji: '🍩', kind: 'bad', points: -18, tip: 'Dessert bosses punish careless slicing.' }
];

const state = {
    active: false,
    score: 0,
    combo: 0,
    hearts: 3,
    items: [],
    spawnTimer: 0,
    lastTime: 0,
    bannerTimeout: null,
    pointerDown: false,
    lastPoint: null
};

startButton.addEventListener('click', () => startGame());
restartButton.addEventListener('click', () => startGame());

arena.addEventListener('pointerdown', (event) => {
    state.pointerDown = true;
    state.lastPoint = pointInArena(event);
});

arena.addEventListener('pointermove', (event) => {
    if (!state.active || !state.pointerDown) {
        return;
    }

    const nextPoint = pointInArena(event);
    if (!state.lastPoint) {
        state.lastPoint = nextPoint;
        return;
    }

    drawSlash(state.lastPoint, nextPoint);
    sliceBetween(state.lastPoint, nextPoint);
    state.lastPoint = nextPoint;
});

window.addEventListener('pointerup', () => {
    state.pointerDown = false;
    state.lastPoint = null;
});

showBanner('Press Start Quest to begin your training.');
updateHud();

function startGame() {
    clearArena();
    state.active = true;
    state.score = 0;
    state.combo = 0;
    state.hearts = 3;
    state.items = [];
    state.spawnTimer = 0;
    state.lastTime = performance.now();
    updateHud();
    showBanner('Quest started. Slice power foods and avoid boss snacks.');
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!state.active) {
        return;
    }

    const dt = Math.min(0.032, (timestamp - state.lastTime) / 1000 || 0);
    state.lastTime = timestamp;
    state.spawnTimer -= dt;

    if (state.spawnTimer <= 0) {
        spawnFood();
        state.spawnTimer = PhaserLikeRandom(0.45, 0.88);
    }

    for (const item of [...state.items]) {
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.vy += 520 * dt;
        item.rotation += item.spin * dt;
        syncItem(item);

        if (item.y > arena.clientHeight + 80) {
            missItem(item);
        }
    }

    requestAnimationFrame(gameLoop);
}

function spawnFood() {
    const food = foods[Math.floor(Math.random() * foods.length)];
    const node = foodTemplate.content.firstElementChild.cloneNode(true);
    node.classList.add(food.kind);
    node.querySelector('.food-emoji').textContent = food.emoji;
    node.querySelector('.food-name').textContent = food.name;
    arena.appendChild(node);

    const item = {
        ...food,
        node,
        x: PhaserLikeRandom(120, Math.max(140, arena.clientWidth - 120)),
        y: arena.clientHeight + 40,
        vx: PhaserLikeRandom(-120, 120),
        vy: PhaserLikeRandom(-780, -620),
        spin: PhaserLikeRandom(-2.4, 2.4),
        radius: 46
    };

    node.addEventListener('pointerdown', (event) => {
        event.preventDefault();
    });

    state.items.push(item);
    syncItem(item);
}

function syncItem(item) {
    item.node.style.left = `${item.x}px`;
    item.node.style.top = `${item.y}px`;
    item.node.style.transform = `translate(-50%, -50%) rotate(${item.rotation || 0}rad)`;
}

function sliceBetween(from, to) {
    for (const item of [...state.items]) {
        if (distanceToSegment(item.x, item.y, from.x, from.y, to.x, to.y) <= item.radius) {
            handleSlice(item);
        }
    }
}

function handleSlice(item) {
    if (!state.items.includes(item)) {
        return;
    }

    removeItem(item);
    item.node.classList.add('sliced');
    window.setTimeout(() => item.node.remove(), 180);

    if (item.kind === 'good') {
        state.combo += 1;
        state.score += item.points + Math.max(0, state.combo - 1) * 2;
        tipEl.textContent = item.tip;
        if (state.combo > 0 && state.combo % 5 === 0) {
            state.hearts = Math.min(5, state.hearts + 1);
            showBanner(`Balanced combo ${state.combo}x. Bonus heart earned.`);
        }
    } else {
        state.combo = 0;
        state.hearts -= 1;
        state.score = Math.max(0, state.score + item.points);
        tipEl.textContent = item.tip;
        showBanner(`${item.name} was a trap. Hearts down.`);
    }

    updateHud();
    if (state.hearts <= 0) {
        endGame('Quest failed. Restart and build a better plate.');
    }
}

function missItem(item) {
    removeItem(item);
    item.node.remove();

    if (item.kind === 'good') {
        state.combo = 0;
        tipEl.textContent = 'Missed a power food. Keep your eyes on the arena.';
        updateHud();
    }
}

function removeItem(item) {
    state.items = state.items.filter((candidate) => candidate !== item);
}

function endGame(message) {
    state.active = false;
    showBanner(`${message} Final score: ${state.score}.`);
}

function updateHud() {
    scoreEl.textContent = String(state.score);
    comboEl.textContent = `${state.combo}x`;
    heartsEl.textContent = '♥'.repeat(Math.max(0, state.hearts)) || '0';
}

function showBanner(message) {
    let banner = arena.querySelector('.message-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.className = 'message-banner';
        arena.appendChild(banner);
    }

    banner.textContent = message;
    if (state.bannerTimeout) {
        window.clearTimeout(state.bannerTimeout);
    }

    state.bannerTimeout = window.setTimeout(() => {
        if (banner.textContent === message && state.active) {
            banner.textContent = 'Build balanced meal combos for higher scores.';
        }
    }, 1800);
}

function clearArena() {
    for (const item of state.items) {
        item.node.remove();
    }
    state.items = [];
    const banner = arena.querySelector('.message-banner');
    if (banner) {
        banner.remove();
    }
}

function drawSlash(from, to) {
    const slash = document.createElement('div');
    slash.className = 'slash';
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);

    slash.style.left = `${from.x}px`;
    slash.style.top = `${from.y}px`;
    slash.style.width = `${length}px`;
    slash.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
    arena.appendChild(slash);
    window.setTimeout(() => slash.remove(), 220);
}

function pointInArena(event) {
    const rect = arena.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function distanceToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    if (dx === 0 && dy === 0) {
        return Math.hypot(px - ax, py - ay);
    }

    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
    const sx = ax + t * dx;
    const sy = ay + t * dy;
    return Math.hypot(px - sx, py - sy);
}

function PhaserLikeRandom(min, max) {
    return min + Math.random() * (max - min);
}
