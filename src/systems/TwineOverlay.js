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
        this.container.style.background = 'rgba(0, 0, 0, 0.72)';
        this.container.style.zIndex = '9999';
        this.container.style.display = 'none';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        const panel = document.createElement('div');
        panel.style.width = '90vw';
        panel.style.height = '90vh';
        panel.style.background = '#0f172a';
        panel.style.border = '2px solid #9ca3af';
        panel.style.borderRadius = '12px';
        panel.style.overflow = 'hidden';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '10px 14px';
        header.style.background = '#111827';
        header.style.color = '#f9fafb';
        header.style.fontFamily = 'Arial, sans-serif';

        this.titleEl = document.createElement('div');
        this.titleEl.textContent = 'Scenario';
        this.titleEl.style.fontWeight = '700';

        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.gap = '8px';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete Scenario';
        completeBtn.style.cursor = 'pointer';
        completeBtn.onclick = () => this.complete();

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => this.close();

        buttons.appendChild(completeBtn);
        buttons.appendChild(closeBtn);
        header.appendChild(this.titleEl);
        header.appendChild(buttons);

        this.iframeEl = document.createElement('iframe');
        this.iframeEl.style.border = '0';
        this.iframeEl.style.width = '100%';
        this.iframeEl.style.height = '100%';
        this.iframeEl.setAttribute('title', 'Twine Scenario');

        panel.appendChild(header);
        panel.appendChild(this.iframeEl);
        this.container.appendChild(panel);
        document.body.appendChild(this.container);
    }
}
