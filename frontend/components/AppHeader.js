// components/AppHeader.js
export class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // 初期状態を管理（MEMOがデフォルト）
    this._currentMode = "MEMO";
  }

  connectedCallback() {
    this.render();
  }

  // ボタンがクリックされた時に呼ばれる関数
  switchMode(newMode) {
    if (this._currentMode === newMode) return;
    
    this._currentMode = newMode;
    this.render(); // 状態が変わったので再描画

    // 親要素（BangNoteApp）にモードが変わったことを通知する
    this.dispatchEvent(new CustomEvent("mode-change", {
      detail: { mode: this._currentMode },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/AppHeader.css">
      <div class="tabs" role="tablist">
        <div 
          class="tab-item ${this._currentMode === 'MEMO' ? 'active' : 'inactive'}" 
          onclick="this.getRootNode().host.switchMode('MEMO')"
        >
          MEMO
        </div>
        <div 
          class="tab-item ${this._currentMode === 'TODO' ? 'active' : 'inactive'}" 
          onclick="this.getRootNode().host.switchMode('TODO')"
        >
          TODO
        </div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);