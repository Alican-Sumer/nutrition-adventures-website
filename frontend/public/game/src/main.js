import { Intro } from './scenes/Intro.js';
import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Nutrition Adventures',
    description: '',
    parent: 'game-container',
    width: 1024,
    height: 1024,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        Intro,
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            
