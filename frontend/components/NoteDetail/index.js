import "./NoteDetailInput/index.js";
import "./NoteDetailOption/index.js";

export class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/style.css">
      <note-detail-input></note-detail-input>
      <note-detail-option></note-detail-option>
    `;
  }
}

customElements.define("note-detail", NoteDetail);
