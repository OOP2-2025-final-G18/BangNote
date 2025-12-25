import "./NoteItem.js";

export class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteList.css">
      <div class="grid">
        <note-item></note-item>
        <note-item></note-item>
        <note-item></note-item>
        <note-item></note-item>
        <note-item></note-item>
        <note-item></note-item>
      </div>
    `;
  }
}

customElements.define("note-list", NoteList);
