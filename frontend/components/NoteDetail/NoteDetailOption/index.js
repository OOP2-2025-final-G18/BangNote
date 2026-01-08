export class NoteDetailOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/NoteDetailOption/style.css">
      <div class="action-btn"></div>
      <div class="add-btn">+</div>
    `;
  }
}

customElements.define("note-detail-option", NoteDetailOption);
