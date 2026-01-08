export class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteItem/style.css">
      <div class="delete-btn">🗑️</div>
      <div class="content">
        <!-- コンテンツのプレビューなど -->
      </div>
    `;
  }
}

customElements.define("note-item", NoteItem);
