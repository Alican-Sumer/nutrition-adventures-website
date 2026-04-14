export class Intro extends Phaser.Scene {

    constructor() {
        super('Intro');
    }

    preload() {
        this.load.image('intro-map-bg', 'assets/maps/edited_final_game_map.png');
        this.ensureTwineFont();
    }

    create() {
        this.buildIntroWhenReady();
    }

    async buildIntroWhenReady() {
        await this.waitForTwineFont();

        if (!this.scene.isActive()) {
            return;
        }

        this.tweens.killAll();
        this.children.removeAll();
        this.ensureDustTexture();

        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#102919');

        const uiRoot = this.add.container(0, 0);

        const background = this.add.image(width / 2, height / 2, 'intro-map-bg');
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
        const panelY = height / 2 - 20;

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

        // Static subtle glow border
        const panelGlow = this.add.graphics();
        panelGlow.lineStyle(18, 0xf0d060, 0.06);
        panelGlow.strokeRoundedRect(
            panelX - panelWidth / 2 - 6,
            panelY - panelHeight / 2 - 6,
            panelWidth + 12,
            panelHeight + 12,
            24
        );

        // Animated orbiting shine glow
        this.ensureGlowTexture();
        const glowSprite = this.add.image(0, 0, 'glow-orb')
            .setBlendMode(Phaser.BlendModes.ADD)
            .setScale(2.5)
            .setAlpha(0.35);

        const halfW = panelWidth / 2 + 10;
        const halfH = panelHeight / 2 + 10;
        const perimeter = 2 * (panelWidth + panelHeight) + 40 * 2;
        const orbitProgress = { t: 0 };

        const getPointOnRect = (t) => {
            const p = ((t % 1) + 1) % 1;
            const d = p * perimeter;
            const top = panelWidth + 20;
            const right = top + panelHeight + 20;
            const bottom = right + panelWidth + 20;
            if (d < top) {
                return { x: panelX - halfW + d, y: panelY - halfH };
            } else if (d < right) {
                return { x: panelX + halfW, y: panelY - halfH + (d - top) };
            } else if (d < bottom) {
                return { x: panelX + halfW - (d - right), y: panelY + halfH };
            } else {
                return { x: panelX - halfW, y: panelY + halfH - (d - bottom) };
            }
        };

        this.tweens.add({
            targets: orbitProgress,
            t: 1,
            duration: 4000,
            repeat: -1,
            ease: 'Linear',
            onUpdate: () => {
                const pt = getPointOnRect(orbitProgress.t);
                glowSprite.setPosition(pt.x, pt.y);
            }
        });

        // Secondary dimmer trailing orb
        const glowSprite2 = this.add.image(0, 0, 'glow-orb')
            .setBlendMode(Phaser.BlendModes.ADD)
            .setScale(1.8)
            .setAlpha(0.18);
        const orbitProgress2 = { t: 0.5 };
        this.tweens.add({
            targets: orbitProgress2,
            t: 1.5,
            duration: 4000,
            repeat: -1,
            ease: 'Linear',
            onUpdate: () => {
                const pt = getPointOnRect(orbitProgress2.t);
                glowSprite2.setPosition(pt.x, pt.y);
            }
        });

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

        const panelTop = panelY - panelHeight / 2;

        const title = this.add.text(panelX, panelTop + 60, 'Nutrition Adventures', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '38px',
            color: '#f0d060',
            align: 'center'
        }).setOrigin(0.5).setShadow(0, 0, '#f0d060', 10, true, true).setStroke('#7a4f00', 3);

        const subtitle = this.add.text(panelX, panelTop + 110, 'The Dining Hall Quest', {
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
            wordWrap: { width: panelWidth * 0.76 }
        };

        const highlightStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#f0d060',
            lineSpacing: 14,
            align: 'center',
            wordWrap: { width: panelWidth * 0.76 }
        };

        const missionHeader = this.add.text(panelX, panelTop + 170, 'Your Mission', sectionHeaderStyle).setOrigin(0.5);

        const missionLine1 = this.add.text(panelX, panelTop + 210, 'Visit each dining hall.', bodyStyle).setOrigin(0.5);
        const missionLine2 = this.add.text(panelX, panelTop + 250, 'Step to the door.', bodyStyle).setOrigin(0.5);
        const missionLine3 = this.add.text(panelX, panelTop + 290, 'Uncover each nutrition tale.', bodyStyle).setOrigin(0.5);

        const controlsHeader = this.add.text(panelX, panelTop + 345, 'Controls', sectionHeaderStyle).setOrigin(0.5);

        // Build visual keyboard layouts
        const keySize = 36;
        const keyGap = 4;
        const controlsContainer = this.add.container(panelX, panelTop + 415);

        const makeKey = (x, y, label) => {
            const bg = this.add.rectangle(x, y, keySize, keySize, 0x2a2a2a, 1)
                .setStrokeStyle(2, 0xc8a84b, 1);
            const txt = this.add.text(x, y, label, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: label.length > 1 ? '9px' : '14px',
                color: '#f0d060'
            }).setOrigin(0.5);
            return [bg, txt];
        };

        // WASD layout (centered at -120, 0)
        const wasdX = -120;
        const wasdChildren = [
            ...makeKey(wasdX, -(keySize + keyGap) / 2, 'W'),                           // W top center
            ...makeKey(wasdX - (keySize + keyGap), (keySize + keyGap) / 2, 'A'),        // A bottom left
            ...makeKey(wasdX, (keySize + keyGap) / 2, 'S'),                              // S bottom center
            ...makeKey(wasdX + (keySize + keyGap), (keySize + keyGap) / 2, 'D'),         // D bottom right
        ];

        // "or" text
        const orText = this.add.text(0, 0, 'or', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#e8e8d0'
        }).setOrigin(0.5);

        // Arrow keys layout (centered at +120, 0)
        const arrowX = 120;
        const arrowChildren = [
            ...makeKey(arrowX, -(keySize + keyGap) / 2, '\u25B2'),                       // Up triangle
            ...makeKey(arrowX - (keySize + keyGap), (keySize + keyGap) / 2, '\u25C0'),    // Left triangle
            ...makeKey(arrowX, (keySize + keyGap) / 2, '\u25BC'),                          // Down triangle
            ...makeKey(arrowX + (keySize + keyGap), (keySize + keyGap) / 2, '\u25B6'),     // Right triangle
        ];

        controlsContainer.add([...wasdChildren, orText, ...arrowChildren]);

        // Other controls
        const otherControlsY = panelTop + 500;
        const doorLabel = this.add.text(panelX, otherControlsY, 'Doorways', highlightStyle).setOrigin(0.5);
        const doorDesc = this.add.text(panelX, otherControlsY + 28, 'Enter scenario', bodyStyle).setOrigin(0.5);
        const escLabel = this.add.text(panelX, otherControlsY + 68, 'Esc', highlightStyle).setOrigin(0.5);
        const escDesc = this.add.text(panelX, otherControlsY + 96, 'Close overlay', bodyStyle).setOrigin(0.5);

        const progressHeader = this.add.text(panelX, panelTop + 640, 'Progress', sectionHeaderStyle).setOrigin(0.5);
        const progressLine1 = this.add.text(panelX, panelTop + 680, '+15 progress per hall', bodyStyle).setOrigin(0.5);
        const progressLine2 = this.add.text(panelX, panelTop + 715, '7 halls to master', highlightStyle).setOrigin(0.5);

        const button = this.add.container(panelX, panelTop + 790);
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
            glowSprite,
            glowSprite2,
            panelShadow,
            panelFrame,
            panelInner,
            panelInnerShadow,
            title,
            subtitle,
            missionHeader,
            missionLine1,
            missionLine2,
            missionLine3,

            controlsHeader,
            controlsContainer,
            doorLabel,
            doorDesc,
            escLabel,
            escDesc,
            progressHeader,
            progressLine1,
            progressLine2,
            button
        ]);

        const hitArea = this.add.zone(panelX, panelTop + 790, buttonWidth, buttonHeight).setOrigin(0.5).setInteractive({ useHandCursor: true });
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
                missionLine1,
                missionLine2,
                missionLine3,
    
                controlsHeader,
                controlsContainer,
                doorLabel,
                doorDesc,
                escLabel,
                escDesc,
                progressHeader,
                progressLine1,
                progressLine2,
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
                new Promise((resolve) => window.setTimeout(resolve, 4000))
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

    ensureGlowTexture() {
        if (this.textures.exists('glow-orb')) {
            return;
        }
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(240, 208, 96, 1)');
        gradient.addColorStop(0.3, 'rgba(240, 208, 96, 0.6)');
        gradient.addColorStop(0.6, 'rgba(240, 208, 96, 0.15)');
        gradient.addColorStop(1, 'rgba(240, 208, 96, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        this.textures.addCanvas('glow-orb', canvas);
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
