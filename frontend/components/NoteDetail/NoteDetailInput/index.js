import { $mode } from "../../../stores/mode.js";
import { effect } from "https://esm.run/nanostores";
import { $noteDetail } from "../../../stores/note.js";

export class NoteDetailInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    /**
     * モードまたはノート詳細の変更時の描画の更新
     */
    effect([$mode, $noteDetail], (mode, noteDetail) => {
      console.log("  -> [NoteDetailInput] モード変更検知:", mode);
      console.log("  -> [NoteDetailInput] ノート詳細変更検知:", noteDetail);
      this.render(mode, noteDetail);
    });
  }

  /**
   * メモノートのときの描画
   *
   * @param {NoteDetailWith<"MEMO">} note
   */
  #renderMemoNote(note) {
    return `<textarea placeholder="メモを入力...">${note.content}</textarea>`;
  }

  /**
   * TODOノートのときの描画
   *
   * @param {NoteDetailWith<"TODO">} note
   */
  #renderTodoNote(note) {
    return `<div>
      <ul>
        ${note.content.map((t) => `<li>${t.text}</li>`).join("")}
      </ul>
    </div>`;
  }

  /**
   * ノートの描画関数を取得
   *
   * @param {Mode} mode
   * @returns {(note: NoteDetail) => string}
   */
  #getNoteRenderer(mode) {
    return { MEMO: this.#renderMemoNote, TODO: this.#renderTodoNote }[mode];
  }

  /**
   * ノート詳細の入力欄の描画
   *
   * @param {Mode} mode
   * @param {NoteDetail} noteDetail
   */
  render(mode, noteDetail) {
    const renderer = this.#getNoteRenderer(mode);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/NoteDetailInput/style.css">
      <div class="content" data-note-type="${mode}">
        ${renderer(noteDetail)}
      </div>
    `;
  }
}

customElements.define("note-detail-input", NoteDetailInput);
