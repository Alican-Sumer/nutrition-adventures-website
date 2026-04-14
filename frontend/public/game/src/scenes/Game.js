export class Game extends Phaser.Scene {

    constructor() {
        super('Game');
    }

    preload() {}

    create() {
        const map = this.make.tilemap({ key: 'campus-map' });
        const tileset = map.addTilesetImage('tile-set', 'tiles');
        const groundLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);

        if (!groundLayer) {
            throw new Error('Tile layer "Tile Layer 1" was not found in campus.json.');
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
    }
}
