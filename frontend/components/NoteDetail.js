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
      <link rel="stylesheet" href="./components/NoteDetail.css">
      <textarea placeholder="メモを入力..."></textarea>
    `;
  }
}

customElements.define("note-detail", NoteDetail);
