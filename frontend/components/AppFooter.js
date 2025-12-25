export class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/AppFooter.css">
      <div class="action-btn">色/締切</div>
      <div class="add-btn">+</div>
    `;
  }
}

customElements.define("app-footer", AppFooter);
