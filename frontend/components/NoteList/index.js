import { $notes } from "../../stores/note.js";
import { $mode } from "../../stores/mode.js";
import { effect } from "https://esm.run/nanostores";

import "../NoteItem/index.js";

export class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    /**
     * ノート一覧またはモードの変更時の描画の更新
     */
    effect([$notes, $mode], (notes, mode) => {
      console.log("  -> [NoteList] ノート一覧の変更検知:", notes);
      console.log("  -> [NoteList] モード変更の検知:", mode);

      this.render(notes.filter((note) => note.type === mode));
    });
  }

  /**
   * ノート一覧の描画
   *
   * @param {ReadonlyArray<Note>} notes
   */
  render(notes) {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteList/style.css">
      <div class="grid">
        ${notes
          .map(
            ({ meta: { id } }) =>
              `<note-item data-note-id="${id}"></note-item>`,
          )
          .join("\n")}
      </div>
    `;
  }
}

customElements.define("note-list", NoteList);
