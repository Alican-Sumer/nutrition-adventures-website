export class TwineOverlay {
    constructor() {
        this.container = null;
        this.titleEl = null;
        this.iframeEl = null;
        this.completeCallback = null;
        this.currentScenarioId = null;
        this.completionPassages = [];
        this.twineloadHandlerAttached = false;
        this.messageHandlerBound = this.handleMessage.bind(this);
        this.handleEsc = this.handleEsc.bind(this);
        this.handleIframeLoad = this.handleIframeLoad.bind(this);
    }

    show({ scenarioId, title, htmlPath, completionPassages = [], onComplete }) {
        this.ensureElements();
        this.currentScenarioId = scenarioId;
        this.completeCallback = onComplete;
        this.completionPassages = completionPassages;
        this.titleEl.textContent = title;
        this.iframeEl.src = htmlPath;
        this.container.style.display = 'flex';
        document.addEventListener('keydown', this.handleEsc);
        window.addEventListener('message', this.messageHandlerBound);
    }

    close() {
        if (!this.container) {
            return;
        }
        this.container.style.display = 'none';
        this.iframeEl.src = 'about:blank';
        this.currentScenarioId = null;
        this.completeCallback = null;
        this.completionPassages = [];
        document.removeEventListener('keydown', this.handleEsc);
        window.removeEventListener('message', this.messageHandlerBound);
    }

    isOpen() {
        return Boolean(this.container) && this.container.style.display !== 'none';
    }

    complete() {
        if (this.completeCallback && this.currentScenarioId) {
            this.completeCallback(this.currentScenarioId);
            window.parent.postMessage(
                { type: 'SCENARIO_COMPLETE', scenarioId: this.currentScenarioId }, '*'
            );
        }
        this.close();
    }

    handleEsc(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    handleMessage(event) {
        if (event.source !== this.iframeEl?.contentWindow) {
            return;
        }

        const data = event.data;
        if (!data || typeof data !== 'object') {
            return;
        }

        if (data.type === 'twine:complete') {
            this.complete();
        }
    }

    handleIframeLoad() {
        this.installTwineCompletionBridge();
    }

    installTwineCompletionBridge() {
        const frameWindow = this.iframeEl?.contentWindow;
        const frameDocument = frameWindow?.document;
        const completionPassages = new Set(this.completionPassages || []);

        if (!frameWindow || !frameDocument || completionPassages.size === 0) {
            return;
        }

        const win = frameWindow;
        const doc = frameDocument;
        const attachBridge = () => {
            if (win.__scenarioCompletionBridgeAttached) {
                return;
            }

            const jq = win.jQuery;
            const state = win.SugarCube?.State;
            if (!jq || !state) {
                window.setTimeout(attachBridge, 150);
                return;
            }

            win.__scenarioCompletionBridgeAttached = true;
            jq(doc).on(':passageend.scenario-complete', () => {
                const currentPassage = win.SugarCube?.State?.passage;
                if (!currentPassage || !completionPassages.has(currentPassage)) {
                    return;
                }

                win.parent.postMessage({
                    type: 'twine:complete',
                    scenarioId: this.currentScenarioId,
                    passage: currentPassage
                }, '*');
            });
        };

        delete win.__scenarioCompletionBridgeAttached;
        attachBridge();
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
        panel.style.width = '100vw';
        panel.style.height = '100vh';
        panel.style.background = 'linear-gradient(180deg, #2b1b10 0%, #1f140d 100%)';
        panel.style.border = 'none';
        panel.style.borderRadius = '0';
        panel.style.overflow = 'hidden';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';

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

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        this.applyButtonTheme(closeBtn);
        closeBtn.onclick = () => this.close();

        buttons.appendChild(closeBtn);
        header.appendChild(this.titleEl);
        header.appendChild(buttons);

        this.iframeEl = document.createElement('iframe');
        this.iframeEl.style.border = '0';
        this.iframeEl.style.width = '100%';
        this.iframeEl.style.flex = '1';
        this.iframeEl.style.minHeight = '0';
        this.iframeEl.style.background = '#f3ead8';
        this.iframeEl.setAttribute('title', 'Twine Scenario');
        this.iframeEl.addEventListener('load', this.handleIframeLoad);

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
