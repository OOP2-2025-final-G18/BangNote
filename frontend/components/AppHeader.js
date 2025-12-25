export class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/AppHeader.css">
      <div class="tabs" role="tablist">
        <div>MEMO</div>
        <div data-active>TODO</div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
