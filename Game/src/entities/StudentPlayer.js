export class StudentPlayer extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, unityID) {
        super(scene, x, y, 'player-down', 0);

        this.unityID = unityID;
        this.progress = 0;
        this.completedScenarios = new Set();
        this.currentDirection = 'down';

        scene.add.existing(this);
        this.setScale(1.15);
        this.setOrigin(0.5, 0.85);
    }

    completeScenario(scenarioId) {
        if (this.completedScenarios.has(scenarioId)) {
            return false;
        }

        this.completedScenarios.add(scenarioId);
        this.progress += 1;
        return true;
    }

    setMovementDirection(direction, moving) {
        if (!direction) {
            return;
        }

        if (this.currentDirection !== direction) {
            this.currentDirection = direction;
        }

        const animKey = `player-${this.currentDirection}-anim`;
        if (moving) {
            this.anims.play(animKey, true);
            return;
        }

        this.anims.stop();
        this.setTexture(`player-${this.currentDirection}`, 0);
    }
}
