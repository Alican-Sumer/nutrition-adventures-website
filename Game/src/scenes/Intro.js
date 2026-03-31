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
        this.ensureDustTexture();

        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#102919');

        const uiRoot = this.add.container(0, 0);

        const background = this.add.image(width / 2, height / 2, 'demo-map-bg');
        background.setDisplaySize(width, height);
        background.setAlpha(0.2);

        const backgroundShade = this.add.rectangle(width / 2, height / 2, width, height, 0x08120c, 0.52);
        const dustParticles = this.add.particles(0, 0, 'dust-particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 10000,
            speedX: { min: -6, max: 6 },
            speedY: { min: -14, max: -4 },
            scale: { start: 0.16, end: 0.04 },
            alpha: { start: 0.12, end: 0 },
            tint: [0xf0d060, 0xf5ecd2],
            quantity: 1,
            frequency: 700,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, width, height)
            },
            blendMode: Phaser.BlendModes.ADD
        });

        const panelWidth = 820;
        const panelHeight = 860;
        const panelX = width / 2;
        const panelY = height / 2;

        const panelShadow = this.add.graphics();
        panelShadow.fillStyle(0x05070a, 0.44);
        panelShadow.fillRoundedRect(
            panelX - panelWidth / 2 + 12,
            panelY - panelHeight / 2 + 14,
            panelWidth,
            panelHeight,
            18
        );

        const panelBackdrop = this.add.graphics();
        panelBackdrop.fillStyle(0x020406, 0.22);
        panelBackdrop.fillRoundedRect(
            panelX - panelWidth / 2 - 18,
            panelY - panelHeight / 2 - 18,
            panelWidth + 36,
            panelHeight + 36,
            26
        );

        const panelGlow = this.add.graphics();
        panelGlow.lineStyle(18, 0xf0d060, 0.08);
        panelGlow.strokeRoundedRect(
            panelX - panelWidth / 2 - 6,
            panelY - panelHeight / 2 - 6,
            panelWidth + 12,
            panelHeight + 12,
            24
        );

        const panelFrame = this.add.graphics();
        panelFrame.fillStyle(0xc8a84b, 0.96);
        panelFrame.fillRoundedRect(
            panelX - panelWidth / 2,
            panelY - panelHeight / 2,
            panelWidth,
            panelHeight,
            18
        );
        panelFrame.lineStyle(5, 0x7a5a1a, 1);
        panelFrame.strokeRoundedRect(
            panelX - panelWidth / 2,
            panelY - panelHeight / 2,
            panelWidth,
            panelHeight,
            18
        );

        const panelInner = this.add.graphics();
        panelInner.fillStyle(0x09111f, 0.86);
        panelInner.fillRoundedRect(
            panelX - (panelWidth - 28) / 2,
            panelY - (panelHeight - 28) / 2,
            panelWidth - 28,
            panelHeight - 28,
            14
        );
        panelInner.lineStyle(3, 0xc8a84b, 0.9);
        panelInner.strokeRoundedRect(
            panelX - (panelWidth - 28) / 2,
            panelY - (panelHeight - 28) / 2,
            panelWidth - 28,
            panelHeight - 28,
            14
        );

        const panelInnerShadow = this.add.graphics();
        panelInnerShadow.lineStyle(18, 0x000000, 0.12);
        panelInnerShadow.strokeRoundedRect(
            panelX - (panelWidth - 44) / 2,
            panelY - (panelHeight - 44) / 2,
            panelWidth - 44,
            panelHeight - 44,
            12
        );

        const title = this.add.text(panelX, 156, 'Nutrition Adventures', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '38px',
            color: '#f0d060',
            align: 'center'
        }).setOrigin(0.5).setShadow(0, 0, '#f0d060', 10, true, true).setStroke('#7a4f00', 3);

        const subtitle = this.add.text(panelX, 214, 'The Dining Hall Quest', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '18px',
            color: '#f0d060',
            letterSpacing: 1
        }).setOrigin(0.5).setShadow(0, 0, '#f0d060', 5, true, true);

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
            'Clark E  Oval S'
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

        const missionHeader = this.add.text(panelX, 294, 'Your Mission', sectionHeaderStyle).setOrigin(0.5);
        const missionBody = this.add.text(panelX, 336, missionText, bodyStyle).setOrigin(0.5, 0);

        const controlsHeader = this.add.text(panelX, 512, 'Controls', sectionHeaderStyle).setOrigin(0.5);
        const controlsBody = this.add.text(panelX, 554, controlsText, bodyStyle).setOrigin(0.5, 0);

        const progressHeader = this.add.text(panelX, 676, 'Progress', sectionHeaderStyle).setOrigin(0.5);
        const progressBody = this.add.text(panelX, 718, progressText, bodyStyle).setOrigin(0.5, 0);

        const button = this.add.container(panelX, 790);
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
            dustParticles,
            panelBackdrop,
            panelGlow,
            panelShadow,
            panelFrame,
            panelInner,
            panelInnerShadow,
            title,
            subtitle,
            missionHeader,
            missionBody,
            controlsHeader,
            controlsBody,
            progressHeader,
            progressBody,
            button
        ]);

        const hitArea = this.add.zone(panelX, 790, buttonWidth, buttonHeight).setOrigin(0.5).setInteractive({ useHandCursor: true });
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

        this.tweens.add({
            targets: [
                panelBackdrop,
                panelGlow,
                panelShadow,
                panelFrame,
                panelInner,
                panelInnerShadow,
                title,
                subtitle,
                missionHeader,
                missionBody,
                controlsHeader,
                controlsBody,
                progressHeader,
                progressBody,
                button
            ],
            y: '+=4',
            duration: 2400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
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

    ensureDustTexture() {
        if (this.textures.exists('dust-particle')) {
            return;
        }

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('dust-particle', 16, 16);
        graphics.destroy();
    }

    playUiHoverSound() {
        this.events.emit('ui:hover');
    }

    playUiClickSound() {
        this.events.emit('ui:click');
    }

}
