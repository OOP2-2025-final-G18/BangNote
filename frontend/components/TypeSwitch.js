// ./components/TypeSwitch.js
export class TypeSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._mode = "MEMO"; 
  }
  // 外部からモードを切り替えるためのメソッド
  setMode(mode) {
    if (this._mode === mode) return;
    this._mode = mode;
    this.render();

    // 他のコンポーネント（NoteListなど）へ通知するカスタムイベント 
    this.dispatchEvent(new CustomEvent("mode-change", {
      detail: { mode: this._mode },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/TypeSwitch.css">
      <div class="switch-container">
        <div 
          class="mode-btn ${this._mode === 'MEMO' ? 'active' : 'inactive'}" 
          onclick="this.getRootNode().host.setMode('MEMO')"
        >
          MEMO
        </div>
        <div 
          class="mode-btn ${this._mode === 'TODO' ? 'active' : 'inactive'}" 
          onclick="this.getRootNode().host.setMode('TODO')"
        >
          TODO
        </div>
      </div>
    `;
  }
}

customElements.define("type-switch", TypeSwitch);