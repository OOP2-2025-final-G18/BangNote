export class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
 
  connectedCallback() {
    this.render();
 
    document.addEventListener("color-change", (e) => {
      this.changeColor(e.detail.color);
    });
  }
 
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail.css">
      <textarea placeholder="メモを入力..."></textarea>
    `;
  }
 
  changeColor(color) {
    const textarea = this.shadowRoot.querySelector("textarea");
 
    textarea.classList.remove("white", "red", "blue", "green");
    textarea.classList.add(color);
  }
}
 
customElements.define("note-detail", NoteDetail);