export class Intro extends Phaser.Scene {

    constructor() {
        super('Intro');
    }

    preload() {
        this.load.image('demo-map-bg', 'assets/maps/NCSU_map_forDEMO_V2.png');
    }

    create() {
        this.ensureTwineFont();
        this.buildIntroWhenReady();
    }

    async buildIntroWhenReady() {
        await this.waitForTwineFont();

        if (!this.scene.isActive()) {
            return;
        }

        this.children.removeAll();

        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#102919');

        const uiRoot = this.add.container(0, 0);

        const background = this.add.image(width / 2, height / 2, 'demo-map-bg');
        background.setDisplaySize(width, height);
        background.setAlpha(0.2);

        const backgroundShade = this.add.rectangle(width / 2, height / 2, width, height, 0x08120c, 0.52);

        const panelWidth = 820;
        const panelHeight = 820;
        const panelX = width / 2;
        const panelY = height / 2;

        const panelShadow = this.add.rectangle(panelX + 12, panelY + 14, panelWidth, panelHeight, 0x05070a, 0.5);
        const panelFrame = this.add.rectangle(panelX, panelY, panelWidth, panelHeight, 0xc8a84b, 1).setStrokeStyle(5, 0x7a5a1a, 1);
        const panelInner = this.add.rectangle(panelX, panelY, panelWidth - 28, panelHeight - 28, 0x09111f, 0.95).setStrokeStyle(3, 0xc8a84b, 1);

        const title = this.add.text(panelX, 138, 'Nutrition Adventures', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '38px',
            color: '#f0d060',
            align: 'center'
        }).setOrigin(0.5).setShadow(2, 2, '#7a4f00', 0, false, true);

        const subtitle = this.add.text(panelX, 188, 'The Dining Hall Quest', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '18px',
            color: '#f0d060',
            letterSpacing: 1
        }).setOrigin(0.5);

        const sectionHeaderStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '20px',
            color: '#f0d060',
            align: 'center'
        };

        const bodyStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#e8e8d0',
            lineSpacing: 14,
            align: 'center',
            wordWrap: { width: 620 }
        };

        const missionText = [
            'Visit each dining hall.',
            'Step to the door.',
            'Uncover each nutrition tale.',
            'Atrium NW  Talley W',
            'Fountain SW  Case NE',
            'Clark E  Oval South'
        ].join('\n');

        const controlsText = [
            'W A S D  Move',
            'Doorways  Enter scenario',
            'Esc  Close overlay'
        ].join('\n');

        const progressText = [
            '+15 progress per hall',
            '7 halls to master',
            'Complete scenarios to advance'
        ].join('\n');

        const missionHeader = this.add.text(panelX, 268, 'Your Mission', sectionHeaderStyle).setOrigin(0.5);
        const missionBody = this.add.text(panelX, 308, missionText, bodyStyle).setOrigin(0.5, 0);

        const controlsHeader = this.add.text(panelX, 468, 'Controls', sectionHeaderStyle).setOrigin(0.5);
        const controlsBody = this.add.text(panelX, 508, controlsText, bodyStyle).setOrigin(0.5, 0);

        const progressHeader = this.add.text(panelX, 622, 'Progress', sectionHeaderStyle).setOrigin(0.5);
        const progressBody = this.add.text(panelX, 662, progressText, bodyStyle).setOrigin(0.5, 0);

        const promptText = this.add.text(panelX, 758, 'Press ENTER or click Start Adventure', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#f0d060',
            align: 'center'
        }).setOrigin(0.5);

        const button = this.add.container(panelX, 712);
        const buttonWidth = 300;
        const buttonHeight = 66;
        const buttonShadow = this.add.rectangle(4, 5, buttonWidth, buttonHeight, 0x000000, 0.5).setOrigin(0.5);
        const buttonGlow = this.add.rectangle(0, 0, buttonWidth + 28, buttonHeight + 24, 0xf0d060, 0.12).setOrigin(0.5);
        const buttonBody = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0xc8a84b, 1).setOrigin(0.5).setStrokeStyle(4, 0x7a5a1a, 1);
        const buttonInner = this.add.rectangle(0, 0, buttonWidth - 16, buttonHeight - 16, 0x09111f, 1).setOrigin(0.5).setStrokeStyle(2, 0xc8a84b, 1);
        const buttonLabel = this.add.text(0, 0, 'Start Adventure', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '18px',
            color: '#f0d060'
        }).setOrigin(0.5).setShadow(2, 2, '#7a4f00', 0, false, true);

        button.add([buttonGlow, buttonShadow, buttonBody, buttonInner, buttonLabel]);

        uiRoot.add([
            background,
            backgroundShade,
            panelShadow,
            panelFrame,
            panelInner,
            title,
            subtitle,
            missionHeader,
            missionBody,
            controlsHeader,
            controlsBody,
            progressHeader,
            progressBody,
            promptText,
            button
        ]);

        const hitArea = this.add.zone(panelX, 712, buttonWidth, buttonHeight).setOrigin(0.5).setInteractive({ useHandCursor: true });
        let isHovered = false;
        let isStarting = false;
        let pulseTween = null;
        let glowTween = null;

        const setButtonVisualState = () => {
            if (isStarting) {
                return;
            }

            button.setScale(isHovered ? 1.05 : 1);
            buttonBody.setFillStyle(isHovered ? 0xe0bf63 : 0xc8a84b, 1);
            buttonGlow.setAlpha(isHovered ? 0.24 : 0.12);
        };

        const startPulse = () => {
            pulseTween = this.tweens.add({
                targets: button,
                scaleX: { from: 1, to: 1.025 },
                scaleY: { from: 1, to: 1.025 },
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            glowTween = this.tweens.add({
                targets: buttonGlow,
                alpha: { from: 0.12, to: 0.2 },
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        };

        const stopPulse = () => {
            if (pulseTween) {
                pulseTween.stop();
                pulseTween = null;
            }
            if (glowTween) {
                glowTween.stop();
                glowTween = null;
            }
            button.setScale(1);
            buttonGlow.setScale(1);
            buttonGlow.setAlpha(isHovered ? 0.24 : 0.12);
        };

        const startGame = () => {
            if (isStarting) {
                return;
            }

            isStarting = true;
            stopPulse();
            this.playUiClickSound();

            this.tweens.add({
                targets: button,
                scaleX: 0.96,
                scaleY: 0.94,
                y: button.y + 4,
                duration: 80,
                ease: 'Quad.easeOut',
                yoyo: true,
                onComplete: () => {
                    this.scene.start('Start');
                }
            });
        };

        startPulse();

        hitArea.on('pointerover', () => {
            if (isStarting) {
                return;
            }

            isHovered = true;
            this.playUiHoverSound();
            setButtonVisualState();
        });
        hitArea.on('pointerout', () => {
            if (isStarting) {
                return;
            }

            isHovered = false;
            setButtonVisualState();
        });
        hitArea.on('pointerdown', () => {
            startGame();
        });

        this.input.keyboard.once('keydown-ENTER', startGame);

        uiRoot.setAlpha(0);
        uiRoot.setScale(0.985);
        this.tweens.add({
            targets: uiRoot,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 420,
            ease: 'Quad.easeOut'
        });
    }

    async waitForTwineFont() {
        if (!document.fonts || !document.fonts.load) {
            await new Promise((resolve) => window.setTimeout(resolve, 250));
            return;
        }

        try {
            await Promise.race([
                document.fonts.load('16px "Press Start 2P"'),
                new Promise((resolve) => window.setTimeout(resolve, 1500))
            ]);
        } catch (_error) {
            await new Promise((resolve) => window.setTimeout(resolve, 250));
        }
    }

    ensureTwineFont() {
        if (document.getElementById('press-start-2p-font')) {
            return;
        }

        const link = document.createElement('link');
        link.id = 'press-start-2p-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        document.head.appendChild(link);
    }

    playUiHoverSound() {
        this.events.emit('ui:hover');
    }

    playUiClickSound() {
        this.events.emit('ui:click');
    }

}
