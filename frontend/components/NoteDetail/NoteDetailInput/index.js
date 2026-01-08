import { $mode } from "../../../stores/mode.js";

export class NoteDetailInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    $mode.subscribe(() => {
      this.updatePlaceholder();
    });
  }

  updatePlaceholder() {
    const textarea = this.shadowRoot.querySelector("textarea");
    const mode = $mode.get();

    if (mode === "MEMO") {
      textarea.placeholder = "メモを入力...";
    } else if (mode === "TODO") {
      textarea.placeholder = "やることを入力...";
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/NoteDetailInput/style.css">
      <textarea placeholder="メモを入力..."></textarea>
    `;
  }
}

customElements.define("note-detail-input", NoteDetailInput);
