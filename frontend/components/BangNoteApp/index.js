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
      <link rel="stylesheet" href="./components/BangNoteApp/style.css">
      <type-switch></type-switch>
      <note-list></note-list>
      <note-detail></note-detail>
    `;
  }
}

customElements.define("bang-note-app", BangNoteApp);
