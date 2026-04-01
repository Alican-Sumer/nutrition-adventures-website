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
        this.cameras.main.setBackgroundColor('#0a1a12');

        const uiRoot = this.add.container(0, 0);

        const background = this.add.image(width / 2, height / 2, 'demo-map-bg');
        background.setDisplaySize(width, height);
        background.setAlpha(0.15);

        const backgroundShade = this.add.rectangle(width / 2, height / 2, width, height, 0x0a1a12, 0.6);

        const dustParticles = this.add.particles(0, 0, 'dust-particle', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            lifespan: 12000,
            speedX: { min: -4, max: 4 },
            speedY: { min: -10, max: -3 },
            scale: { start: 0.12, end: 0.02 },
            alpha: { start: 0.1, end: 0 },
            tint: [0x4ade80, 0x86efac],
            quantity: 1,
            frequency: 800,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, width, height)
            },
            blendMode: Phaser.BlendModes.ADD
        });

        const cx = width / 2;
        const panelW = Math.min(700, width - 60);
        const panelH = Math.min(780, height - 40);
        const panelX = cx - panelW / 2;
        const panelY = (height - panelH) / 2;

        // Main panel
        const panel = this.add.graphics();
        panel.fillStyle(0x0f2318, 0.92);
        panel.fillRoundedRect(panelX, panelY, panelW, panelH, 16);
        panel.lineStyle(2, 0x4ade80, 0.6);
        panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 16);

        // Accent line at top of panel
        const accentLine = this.add.graphics();
        accentLine.fillStyle(0x4ade80, 0.8);
        accentLine.fillRoundedRect(panelX + 20, panelY + 1, panelW - 40, 3, 2);

        // Title
        const title = this.add.text(cx, panelY + 60, 'Nutrition Adventures', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '32px',
            color: '#4ade80',
            align: 'center'
        }).setOrigin(0.5);

        const subtitle = this.add.text(cx, panelY + 110, 'The Dining Hall Quest', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#86efac',
            letterSpacing: 2
        }).setOrigin(0.5);

        // Divider
        const divider1 = this.add.graphics();
        divider1.fillStyle(0x4ade80, 0.25);
        divider1.fillRect(panelX + 40, panelY + 145, panelW - 80, 1);

        // Section style helpers
        const headerStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            color: '#4ade80',
            align: 'center'
        };

        const bodyStyle = {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '11px',
            color: '#d1d5db',
            lineSpacing: 16,
            align: 'center',
            wordWrap: { width: panelW - 100 }
        };

        // Mission section
        let yPos = panelY + 175;
        this.add.text(cx, yPos, 'YOUR MISSION', headerStyle).setOrigin(0.5);

        yPos += 40;
        const missionLines = [
            'Explore the NC State campus',
            'Visit each dining hall',
            'Complete nutrition scenarios',
            'to become a Nutrition Master!'
        ].join('\n');
        this.add.text(cx, yPos, missionLines, bodyStyle).setOrigin(0.5, 0);

        // Divider
        yPos += 110;
        const divider2 = this.add.graphics();
        divider2.fillStyle(0x4ade80, 0.25);
        divider2.fillRect(panelX + 40, yPos, panelW - 80, 1);

        // Dining Halls section
        yPos += 25;
        this.add.text(cx, yPos, 'DINING HALLS', headerStyle).setOrigin(0.5);

        yPos += 35;
        const halls = [
            ['Clark', 'E', 'Fountain', 'SW'],
            ['Case', 'NE', 'Talley', 'W'],
            ['Atrium', 'NW', 'Oval', 'S']
        ];

        for (const row of halls) {
            const rowText = `${row[0]}  ${row[1]}     ${row[2]}  ${row[3]}`;
            this.add.text(cx, yPos, rowText, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                color: '#9ca3af',
                align: 'center'
            }).setOrigin(0.5);
            yPos += 28;
        }

        // Divider
        yPos += 5;
        const divider3 = this.add.graphics();
        divider3.fillStyle(0x4ade80, 0.25);
        divider3.fillRect(panelX + 40, yPos, panelW - 80, 1);

        // Controls section
        yPos += 25;
        this.add.text(cx, yPos, 'CONTROLS', headerStyle).setOrigin(0.5);

        yPos += 35;
        const controlPairs = [
            ['W A S D', 'Move around'],
            ['Doorways', 'Start scenario'],
            ['ESC', 'Close overlay']
        ];

        for (const [key, desc] of controlPairs) {
            const keyText = this.add.text(cx - 20, yPos, key, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                color: '#4ade80'
            }).setOrigin(1, 0.5);

            this.add.text(cx + 20, yPos, desc, {
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '10px',
                color: '#9ca3af'
            }).setOrigin(0, 0.5);

            yPos += 28;
        }

        // Start button
        const btnY = panelY + panelH - 80;
        const btnW = 280;
        const btnH = 54;

        const button = this.add.container(cx, btnY);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x4ade80, 1);
        btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 10);

        const btnLabel = this.add.text(0, 0, 'START ADVENTURE', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px',
            color: '#0a1a12'
        }).setOrigin(0.5);

        button.add([btnBg, btnLabel]);

        uiRoot.add([
            background, backgroundShade, dustParticles,
            panel, accentLine,
            title, subtitle, divider1, divider2, divider3,
            button
        ]);

        // Button interaction
        const hitArea = this.add.zone(cx, btnY, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
        let isStarting = false;

        hitArea.on('pointerover', () => {
            if (isStarting) return;
            button.setScale(1.05);
            this.playUiHoverSound();
        });

        hitArea.on('pointerout', () => {
            if (isStarting) return;
            button.setScale(1);
        });

        const startGame = () => {
            if (isStarting) return;
            isStarting = true;
            this.playUiClickSound();

            this.tweens.add({
                targets: button,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 80,
                yoyo: true,
                onComplete: () => this.scene.start('Start')
            });
        };

        hitArea.on('pointerdown', startGame);
        this.input.keyboard.once('keydown-ENTER', startGame);

        // Subtle pulse on button
        this.tweens.add({
            targets: button,
            scaleX: { from: 1, to: 1.02 },
            scaleY: { from: 1, to: 1.02 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Fade in
        uiRoot.setAlpha(0);
        this.tweens.add({
            targets: uiRoot,
            alpha: 1,
            duration: 500,
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
