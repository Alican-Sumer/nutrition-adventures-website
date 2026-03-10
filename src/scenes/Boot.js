export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('tiles', 'assets/tiles/Cliff.png');
        this.load.tilemapTiledJSON('campus-map', 'assets/maps/campus.json');
    }

    create() {
        this.scene.start('Game');
    }
}
