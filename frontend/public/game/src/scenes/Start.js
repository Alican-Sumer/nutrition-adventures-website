import { StudentPlayer } from '../entities/StudentPlayer.js';
import { TwineOverlay } from '../systems/TwineOverlay.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('game-map-bg', 'assets/maps/edited_final_game_map.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/finishedGameMapEditedFixedCollisions.json');
        this.load.spritesheet('player-up', 'assets/sprite/idle_up.png', { frameWidth: 96, frameHeight: 80 });
        this.load.spritesheet('player-down', 'assets/sprite/idle_down.png', { frameWidth: 96, frameHeight: 80 });
        this.load.spritesheet('player-left', 'assets/sprite/idle_left.png', { frameWidth: 96, frameHeight: 80 });
        this.load.spritesheet('player-right', 'assets/sprite/idle_right.png', { frameWidth: 96, frameHeight: 80 });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const rawMapData = this.cache.tilemap.get('map').data;
        const imageLayer = rawMapData.layers.find((layer) => layer.name === 'background' && layer.type === 'imagelayer');

        if (!imageLayer) {
            throw new Error('Image layer "background" was not found in finishedGameMapEditedFixedCollisions.json.');
        }

        const bgX = 0;
        const bgY = 0;
        this.add.image(bgX, bgY, 'game-map-bg').setOrigin(0, 0);

        const mapWidth = imageLayer.imagewidth || map.widthInPixels;
        const mapHeight = imageLayer.imageheight || map.heightInPixels;
        this.mapRect = new Phaser.Geom.Rectangle(bgX, bgY, mapWidth, mapHeight);

        const startX = bgX + mapWidth / 2;
        const startY = bgY + mapHeight / 2;

        this.player = new StudentPlayer(this, startX, startY, 'jtquresh');
        this.playerRadius = 6;
        this.triggerActivationRadius = 16;
        this.triggerActivationHorizontalPadding = 10;
        this.triggerActivationForwardPadding = 24;
        this.playerSpeed = 220;
        this.lastDirection = 'down';
        this.moveKeys = this.input.keyboard.addKeys('W,A,S,D');
        this.arrowKeys = this.input.keyboard.createCursorKeys();
        this.twineOverlay = new TwineOverlay();
        this.collisionZones = this.createCollisionZonesFromObjectLayer(map, 'collisions');
        this.triggerZones = this.createAllTriggerZones(map);
        this.triggerToScenario = {
            clark_trigger: 'scenario1',
            fountain_trigger: 'scenario2',
            case_trigger: 'scenario3',
            talley_trigger: 'scenario4',
            atrium_trigger: 'scenario6',
            oval_trigger: 'scenario5',
            gym_trigger: 'scenario7'
        };
        this.activeTriggerScenario = null;

        this.scenarios = {
            scenario1: {
                title: 'Scenario 1',
                htmlPath: 'Scenarios/Scenario1/Scenario1.html',
                completionPassages: ['Key Takeaways']
            },
            scenario2: {
                title: 'Scenario 2',
                htmlPath: 'Scenarios/Scenario2/Scenario2.html',
                completionPassages: ['Exit Screen']
            },
            scenario3: {
                title: 'Scenario 3',
                htmlPath: 'Scenarios/Scenario3/Scenario3.html',
                completionPassages: ['Meal Summary']
            },
            scenario4: {
                title: 'Scenario 4',
                htmlPath: 'Scenarios/Scenario4/Scenario4.html',
                completionPassages: ['Exit Screen']
            },
            scenario5: {
                title: 'Scenario 5',
                htmlPath: 'Scenarios/Scenario5/Scenario5.html',
                completionPassages: ['Finish']
            },
            scenario6: {
                title: 'Scenario 6',
                htmlPath: 'Scenarios/Scenario6/Scenario6.html',
                completionPassages: ['ScenarioEnd']
            },
            scenario7: {
                title: 'Scenario 7',
                htmlPath: 'Scenarios/Scenario7/Scenario7.html',
                completionPassages: ['Results']
            }
        };

        this.scenarioIcons = {};
        this.createScenarioIcons();

        this.createPlayerAnimations();
        this.player.setMovementDirection('down', false);

        window.addEventListener('message', (event) => {
            if (event.data?.type === 'LOAD_PROGRESS') {
                for (const scenarioId of event.data.completedScenarios) {
                    this.player.completeScenario(scenarioId);
                }
                this.updateProgressBar();
                this.updateScenarioIcons();
            }
        });

        // Tell the parent we're ready to receive progress
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'GAME_READY' }, '*');
        }

        const fitZoomX = this.scale.width / mapWidth;
        const fitZoomY = this.scale.height / mapHeight;
        const fitZoom = Math.min(fitZoomX, fitZoomY);
        this.cameras.main.setZoom(fitZoom);

        const viewportWorldWidth = this.scale.width / fitZoom;
        const viewportWorldHeight = this.scale.height / fitZoom;
        const marginX = Math.max(0, (viewportWorldWidth - mapWidth) / 2);
        const marginY = Math.max(0, (viewportWorldHeight - mapHeight) / 2);
        this.cameras.main.setBounds(
            bgX - marginX,
            bgY - marginY,
            mapWidth + marginX * 2,
            mapHeight + marginY * 2
        );

        this.cameras.main.centerOn(bgX + mapWidth / 2, bgY + mapHeight / 2);
        this.cameras.main.setBackgroundColor('#0f2a18');

        this.createProgressBar();

        this.mobileInput = { up: false, down: false, left: false, right: false };
        const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
        if (isMobile) {
            this.createMobileDPad();
        }
    }

    createProgressBar() {
        const { width, height } = this.scale;
        const barWidth = 260;
        const barHeight = 20;
        const barX = width - barWidth - 16;
        const barY = height - barHeight - 12;
        const cornerRadius = 6;

        // Container for all progress bar elements (fixed to screen)
        this.progressBg = this.add.graphics();
        this.progressBg.fillStyle(0x020406, 0.7);
        this.progressBg.fillRoundedRect(barX - 8, barY - 24, barWidth + 16, barHeight + 32, 8);
        this.progressBg.lineStyle(2, 0xc8a84b, 0.8);
        this.progressBg.strokeRoundedRect(barX - 8, barY - 24, barWidth + 16, barHeight + 32, 8);

        this.progressLabel = this.add.text(barX, barY - 18, 'Progress: 0%', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '10px',
            color: '#f0d060'
        }).setOrigin(0, 0);

        // Bar track
        this.progressTrack = this.add.graphics();
        this.progressTrack.fillStyle(0x1a1a2e, 1);
        this.progressTrack.fillRoundedRect(barX, barY, barWidth, barHeight, cornerRadius);
        this.progressTrack.lineStyle(2, 0x7a5a1a, 1);
        this.progressTrack.strokeRoundedRect(barX, barY, barWidth, barHeight, cornerRadius);

        // Bar fill
        this.progressFill = this.add.graphics();
        this.progressBarX = barX;
        this.progressBarY = barY;
        this.progressBarWidth = barWidth;
        this.progressBarHeight = barHeight;
        this.progressBarRadius = cornerRadius;

        // UI camera only sees UI elements; main camera ignores them
        this.uiElements = [this.progressBg, this.progressLabel, this.progressTrack, this.progressFill];
        this.uiCam = this.cameras.add(0, 0, width, height);
        this.uiCam.setScroll(0, 0);
        this.uiCam.ignore(this.children.list.filter(
            child => !this.uiElements.includes(child)
        ));

        this.cameras.main.ignore(this.uiElements);

        this.updateProgressBar();
    }

    createMobileDPad() {
        const { width, height } = this.scale;
        const btnSize = 40;
        const gap = 4;
        // Position D-pad above the progress bar, right-aligned
        const centerX = width - 100;
        const centerY = height - 340;

        this.dpadElements = [];

        const directions = [
            { key: 'up', dx: 0, dy: -(btnSize + gap) },
            { key: 'down', dx: 0, dy: (btnSize + gap) },
            { key: 'left', dx: -(btnSize + gap), dy: 0 },
            { key: 'right', dx: (btnSize + gap), dy: 0 }
        ];

        for (const dir of directions) {
            const bx = centerX + dir.dx;
            const by = centerY + dir.dy;

            // Button background (interactive zone)
            const zone = this.add.zone(bx, by, btnSize, btnSize).setInteractive();
            zone.setOrigin(0.5, 0.5);

            // Button visual
            const btn = this.add.graphics();
            btn.fillStyle(0x1a1a2e, 0.9);
            btn.fillRoundedRect(bx - btnSize / 2, by - btnSize / 2, btnSize, btnSize, 6);
            btn.lineStyle(1.5, 0xc8a84b, 1);
            btn.strokeRoundedRect(bx - btnSize / 2, by - btnSize / 2, btnSize, btnSize, 6);

            // Arrow symbol
            btn.fillStyle(0xf0d060, 1);
            btn.beginPath();
            const s = 8; // arrow half-size
            if (dir.key === 'up') {
                btn.moveTo(bx, by - s);
                btn.lineTo(bx + s, by + s);
                btn.lineTo(bx - s, by + s);
            } else if (dir.key === 'down') {
                btn.moveTo(bx, by + s);
                btn.lineTo(bx + s, by - s);
                btn.lineTo(bx - s, by - s);
            } else if (dir.key === 'left') {
                btn.moveTo(bx - s, by);
                btn.lineTo(bx + s, by - s);
                btn.lineTo(bx + s, by + s);
            } else if (dir.key === 'right') {
                btn.moveTo(bx + s, by);
                btn.lineTo(bx - s, by - s);
                btn.lineTo(bx - s, by + s);
            }
            btn.closePath();
            btn.fillPath();

            zone.on('pointerdown', () => { this.mobileInput[dir.key] = true; });
            zone.on('pointerup', () => { this.mobileInput[dir.key] = false; });
            zone.on('pointerout', () => { this.mobileInput[dir.key] = false; });

            this.dpadElements.push(zone, btn);
        }

        // Add D-pad to UI camera, hide from main camera
        for (const el of this.dpadElements) {
            this.cameras.main.ignore(el);
            this.uiCam.ignore([]); // ensure uiCam sees these new elements
        }
        // Update uiCam to only see UI elements
        this.uiElements.push(...this.dpadElements);
        this.uiCam.ignore(this.children.list.filter(
            child => !this.uiElements.includes(child)
        ));
    }

    updateProgressBar() {
        const progress = Math.min(this.player.progress, 100);
        console.log('[ProgressBar] Updating to:', progress, '% | Completed:', [...this.player.completedScenarios]);
        this.progressLabel.setText(`Progress: ${progress}%`);

        this.progressFill.clear();
        if (progress > 0) {
            const fillWidth = (progress / 100) * this.progressBarWidth;
            this.progressFill.fillStyle(0xc8a84b, 1);
            this.progressFill.fillRoundedRect(
                this.progressBarX, this.progressBarY,
                Math.max(fillWidth, this.progressBarRadius * 2), this.progressBarHeight,
                this.progressBarRadius
            );
            // Gold shine gradient overlay
            this.progressFill.fillStyle(0xf0d060, 0.3);
            this.progressFill.fillRect(
                this.progressBarX + 2, this.progressBarY + 2,
                Math.max(fillWidth - 4, 0), this.progressBarHeight / 2 - 2
            );
        }
    }

    update(_time, delta) {
        const dt = delta / 1000;
        const mi = this.mobileInput;
        const inputX = (this.moveKeys.D.isDown || this.arrowKeys.right.isDown || mi.right ? 1 : 0) - (this.moveKeys.A.isDown || this.arrowKeys.left.isDown || mi.left ? 1 : 0);
        const inputY = (this.moveKeys.S.isDown || this.arrowKeys.down.isDown || mi.down ? 1 : 0) - (this.moveKeys.W.isDown || this.arrowKeys.up.isDown || mi.up ? 1 : 0);

        if (inputX === 0 && inputY === 0) {
            this.player.setMovementDirection(this.lastDirection, false);
            this.checkTriggerScenarioActivation();
            return;
        }

        let direction = this.lastDirection;
        if (Math.abs(inputX) > Math.abs(inputY)) {
            direction = inputX > 0 ? 'right' : 'left';
        } else {
            direction = inputY > 0 ? 'down' : 'up';
        }
        this.lastDirection = direction;
        this.player.setMovementDirection(direction, true);

        const vec = new Phaser.Math.Vector2(inputX, inputY).normalize().scale(this.playerSpeed * dt);
        this.tryMovePlayer(vec.x, 0);
        this.tryMovePlayer(0, vec.y);
        this.checkTriggerScenarioActivation();
    }

    openScenario(scenarioId) {
        const config = this.scenarios[scenarioId];
        if (!config) {
            return;
        }

        this.twineOverlay.show({
            scenarioId,
            title: config.title,
            htmlPath: config.htmlPath,
            completionPassages: config.completionPassages || [],
            onComplete: (completedScenarioId) => {
                this.player.completeScenario(completedScenarioId);
                this.updateProgressBar();
                this.updateScenarioIcons();
                // Notify parent (GamePage) to persist progress to backend
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'SCENARIO_COMPLETE', scenarioId: completedScenarioId }, '*');
                }
            }
        });
    }

    createCollisionZonesFromObjectLayer(map, layerName) {
        const objectLayer = map.getObjectLayer(layerName);
        if (!objectLayer || !objectLayer.objects) {
            return [];
        }

        return objectLayer.objects
            .filter((obj) =>
                typeof obj.x === 'number' &&
                typeof obj.y === 'number' &&
                !this.isTriggerObject(obj)
            )
            .map((obj) => new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width || 0, obj.height || 0));
    }

    createTriggerZonesFromObjectLayer(map, layerName) {
        const objectLayer = map.getObjectLayer(layerName);
        if (!objectLayer || !objectLayer.objects) {
            return [];
        }

        return objectLayer.objects
            .filter((obj) =>
                typeof obj.x === 'number' &&
                typeof obj.y === 'number' &&
                (obj.width || 0) > 0 &&
                (obj.height || 0) > 0 &&
                this.isTriggerObject(obj)
            )
            .map((obj) => ({
                name: (obj.name || '').trim().toLowerCase(),
                type: (obj.type || '').trim().toLowerCase(),
                rect: new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width || 0, obj.height || 0),
                activationRect: new Phaser.Geom.Rectangle(
                    obj.x - this.triggerActivationHorizontalPadding,
                    obj.y,
                    (obj.width || 0) + this.triggerActivationHorizontalPadding * 2,
                    (obj.height || 0) + this.triggerActivationForwardPadding
                )
            }));
    }

    createAllTriggerZones(map) {
        return [
            ...this.createTriggerZonesFromObjectLayer(map, 'triggers'),
            ...this.createTriggerZonesFromObjectLayer(map, 'collisions')
        ];
    }

    isTriggerObject(obj) {
        const name = (obj.name || '').trim().toLowerCase();
        const type = (obj.type || '').trim().toLowerCase();
        return name.includes('trigger') || type.includes('trigger');
    }

    tryMovePlayer(dx, dy) {
        const nextX = this.player.x + dx;
        const nextY = this.player.y + dy;
        const playerCircle = new Phaser.Geom.Circle(nextX, nextY, this.playerRadius);

        if (!Phaser.Geom.Rectangle.Contains(this.mapRect, nextX, nextY)) {
            return;
        }

        const hitsCollision = this.collisionZones.some((zone) => Phaser.Geom.Intersects.CircleToRectangle(playerCircle, zone));
        if (hitsCollision) {
            return;
        }

        this.player.setPosition(nextX, nextY);
    }

    checkTriggerScenarioActivation() {
        const triggerCircle = new Phaser.Geom.Circle(this.player.x, this.player.y, this.triggerActivationRadius);
        const hitZone = this.triggerZones.find((zone) => Phaser.Geom.Intersects.CircleToRectangle(triggerCircle, zone.activationRect));
        if (!hitZone) {
            this.activeTriggerScenario = null;
            return;
        }

        const triggerKey = hitZone.name || hitZone.type;
        const scenarioId = this.triggerToScenario[triggerKey];
        if (!scenarioId) {
            return;
        }

        if (this.activeTriggerScenario === scenarioId || this.twineOverlay.isOpen()) {
            return;
        }

        this.activeTriggerScenario = scenarioId;
        this.openScenario(scenarioId);
    }

    createScenarioIcons() {
        // Place a floating icon above each trigger zone
        for (const zone of this.triggerZones) {
            const triggerKey = zone.name || zone.type;
            const scenarioId = this.triggerToScenario[triggerKey];
            if (!scenarioId) continue;

            const iconOffsets = { talley_trigger: { dx: 30, dy: 0 } };
            const offset = iconOffsets[triggerKey] || { dx: 0, dy: 0 };
            const centerX = zone.rect.x + zone.rect.width / 2 + 40 + offset.dx;
            const aboveY = zone.rect.y - 50 + offset.dy;

            // Create a container for the icon
            const container = this.add.container(centerX, aboveY);

            // Exclamation mark (yellow, for incomplete)
            const exclamation = this.createExclamationIcon();
            container.add(exclamation);

            // Checkmark (green, for complete)
            const checkmark = this.createCheckmarkIcon();
            checkmark.setVisible(false);
            container.add(checkmark);

            // Bouncing tween for the container
            this.tweens.add({
                targets: container,
                y: aboveY - 6,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            this.scenarioIcons[scenarioId] = { container, exclamation, checkmark };
        }
    }

    createExclamationIcon() {
        const g = this.add.graphics();
        // Black shadow/border (1.5x size, widened bar)
        g.lineStyle(18, 0x000000, 0.8);
        g.beginPath();
        g.moveTo(0, -27);
        g.lineTo(0, 9);
        g.strokePath();
        g.fillStyle(0x000000, 0.8);
        g.fillCircle(0, 21, 9);
        // Gold exclamation bar
        g.lineStyle(13.5, 0xf0d060, 1);
        g.beginPath();
        g.moveTo(0, -27);
        g.lineTo(0, 9);
        g.strokePath();
        // Gold exclamation dot
        g.fillStyle(0xf0d060, 1);
        g.fillCircle(0, 21, 6.75);
        return g;
    }

    createCheckmarkIcon() {
        const g = this.add.graphics();
        // Black shadow/border (1.5x size)
        g.lineStyle(10.5, 0x000000, 0.8);
        g.beginPath();
        g.moveTo(-12, 3);
        g.lineTo(-3, 15);
        g.lineTo(15, -12);
        g.strokePath();
        // Green checkmark
        g.lineStyle(7.5, 0x30d050, 1);
        g.beginPath();
        g.moveTo(-12, 3);
        g.lineTo(-3, 15);
        g.lineTo(15, -12);
        g.strokePath();
        return g;
    }

    updateScenarioIcons() {
        for (const [scenarioId, icon] of Object.entries(this.scenarioIcons)) {
            const completed = this.player.completedScenarios.has(scenarioId);
            icon.exclamation.setVisible(!completed);
            icon.checkmark.setVisible(completed);
        }
    }

    createPlayerAnimations() {
        const directions = ['up', 'down', 'left', 'right'];
        for (const dir of directions) {
            const key = `player-${dir}-anim`;
            if (this.anims.exists(key)) {
                continue;
            }
            const frameTotal = this.textures.get(`player-${dir}`).frameTotal;
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(`player-${dir}`, { start: 0, end: Math.max(0, frameTotal - 2) }),
                frameRate: 8,
                repeat: -1
            });
        }
    }

}
