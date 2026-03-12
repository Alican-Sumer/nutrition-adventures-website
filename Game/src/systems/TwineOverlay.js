export class TwineOverlay {
    constructor() {
        this.container = null;
        this.titleEl = null;
        this.iframeEl = null;
        this.completeCallback = null;
        this.currentScenarioId = null;
        this.handleEsc = this.handleEsc.bind(this);
    }

    show({ scenarioId, title, htmlPath, onComplete }) {
        this.ensureElements();
        this.currentScenarioId = scenarioId;
        this.completeCallback = onComplete;
        this.titleEl.textContent = title;
        this.iframeEl.src = htmlPath;
        this.container.style.display = 'flex';
        document.addEventListener('keydown', this.handleEsc);
    }

    close() {
        if (!this.container) {
            return;
        }
        this.container.style.display = 'none';
        this.iframeEl.src = 'about:blank';
        this.currentScenarioId = null;
        this.completeCallback = null;
        document.removeEventListener('keydown', this.handleEsc);
    }

    isOpen() {
        return Boolean(this.container) && this.container.style.display !== 'none';
    }

    complete() {
        if (this.completeCallback && this.currentScenarioId) {
            this.completeCallback(this.currentScenarioId);
        }
        this.close();
    }

    handleEsc(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    ensureElements() {
        if (this.container) {
            return;
        }

        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.inset = '0';
        this.container.style.background = 'radial-gradient(circle at top, rgba(53, 28, 10, 0.55), rgba(0, 0, 0, 0.82))';
        this.container.style.backdropFilter = 'blur(2px)';
        this.container.style.zIndex = '9999';
        this.container.style.display = 'none';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        const panel = document.createElement('div');
        panel.style.width = '90vw';
        panel.style.height = '90vh';
        panel.style.background = 'linear-gradient(180deg, #2b1b10 0%, #1f140d 100%)';
        panel.style.border = '3px solid #b38a4a';
        panel.style.borderRadius = '12px';
        panel.style.overflow = 'hidden';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.boxShadow = '0 0 0 3px rgba(57, 37, 18, 0.9), 0 22px 45px rgba(0, 0, 0, 0.55)';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '10px 14px';
        header.style.background = 'linear-gradient(180deg, #493015 0%, #362311 100%)';
        header.style.color = '#f6deb0';
        header.style.fontFamily = 'Cinzel, Georgia, serif';
        header.style.letterSpacing = '0.04em';
        header.style.borderBottom = '1px solid #c79f60';

        this.titleEl = document.createElement('div');
        this.titleEl.textContent = 'Scenario';
        this.titleEl.style.fontWeight = '700';
        this.titleEl.style.fontSize = '18px';

        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '8px';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete Quest';
        this.applyButtonTheme(completeBtn);
        completeBtn.onclick = () => this.complete();

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        this.applyButtonTheme(closeBtn);
        closeBtn.onclick = () => this.close();

        buttons.appendChild(completeBtn);
        buttons.appendChild(closeBtn);
        header.appendChild(this.titleEl);
        header.appendChild(buttons);

        this.iframeEl = document.createElement('iframe');
        this.iframeEl.style.border = '0';
        this.iframeEl.style.width = '100%';
        this.iframeEl.style.height = '100%';
        this.iframeEl.style.background = '#f3ead8';
        this.iframeEl.setAttribute('title', 'Twine Scenario');

        panel.appendChild(header);
        panel.appendChild(this.iframeEl);
        this.container.appendChild(panel);
        document.body.appendChild(this.container);
    }

    applyButtonTheme(button) {
        button.style.cursor = 'pointer';
        button.style.background = 'linear-gradient(180deg, #e3c285 0%, #bf8a48 100%)';
        button.style.border = '1px solid #6d4a21';
        button.style.color = '#2d1807';
        button.style.fontFamily = 'Cinzel, Georgia, serif';
        button.style.fontWeight = '700';
        button.style.padding = '7px 12px';
        button.style.borderRadius = '6px';
    }
}
