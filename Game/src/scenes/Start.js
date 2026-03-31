import { StudentPlayer } from '../entities/StudentPlayer.js';
import { TwineOverlay } from '../systems/TwineOverlay.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('demo-map-bg', 'assets/maps/NCSU_map_forDEMO_V2.png');
        this.load.tilemapTiledJSON('map', 'assets/maps/demoMap_V3_3_08_26_json.json');
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
            throw new Error('Image layer "background" was not found in demoMap_V3_3_08_26_json.json.');
        }

        const bgX = 0;
        const bgY = 0;
        this.add.image(bgX, bgY, 'demo-map-bg').setOrigin(0, 0);

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
        this.twineOverlay = new TwineOverlay();
        this.collisionZones = this.createRectanglesFromObjectLayer(map, 'collisions');
        this.triggerZones = this.createTriggerZonesFromObjectLayer(map, 'triggers');
        this.triggerToScenario = {
            clark_door_trigger: 'scenario1',
            fountain_door_trigger: 'scenario2',
            case_door_trigger: 'scenario3',
            talley_door_trigger: 'scenario4'
        };
        this.activeTriggerScenario = null;

        this.scenarios = {
            scenario1: {
                title: 'Scenario 1',
                htmlPath: './src/Scenarios_new/Scenario1/Scenario1.html',
                completionPassages: ['Key Takeaways']
            },
            scenario2: {
                title: 'Scenario 2',
                htmlPath: './src/Scenarios_new/Scenario2/Scenario2.html',
                completionPassages: ['Exit Screen']
            },
            scenario3: {
                title: 'Scenario 3',
                htmlPath: './src/Scenarios_new/Scenario3/Scenario3.html',
                completionPassages: ['Meal Summary']
            },
            scenario4: {
                title: 'Scenario 4',
                htmlPath: './src/Scenarios_new/Scenario4/Scenario4.html',
                completionPassages: ['Exit Screen']
            }
        };

        this.createPlayerAnimations();
        this.player.setMovementDirection('down', false);

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
    }

    update(_time, delta) {
        const dt = delta / 1000;
        const inputX = (this.moveKeys.D.isDown ? 1 : 0) - (this.moveKeys.A.isDown ? 1 : 0);
        const inputY = (this.moveKeys.S.isDown ? 1 : 0) - (this.moveKeys.W.isDown ? 1 : 0);

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
            }
        });
    }

    createRectanglesFromObjectLayer(map, layerName) {
        const objectLayer = map.getObjectLayer(layerName);
        if (!objectLayer || !objectLayer.objects) {
            return [];
        }

        return objectLayer.objects
            .filter((obj) => typeof obj.x === 'number' && typeof obj.y === 'number')
            .map((obj) => new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width || 0, obj.height || 0));
    }

    createTriggerZonesFromObjectLayer(map, layerName) {
        const objectLayer = map.getObjectLayer(layerName);
        if (!objectLayer || !objectLayer.objects) {
            return [];
        }

        return objectLayer.objects
            .filter((obj) => typeof obj.x === 'number' && typeof obj.y === 'number' && (obj.width || 0) > 0 && (obj.height || 0) > 0)
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
