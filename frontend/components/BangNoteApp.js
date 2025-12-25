export class BangNoteApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/BangNoteApp.css">
      <app-header></app-header>
      <note-list></note-list>
      <note-detail></note-detail>
      <app-footer></app-footer>
    `;
  }
}

customElements.define("bang-note-app", BangNoteApp);
