import { $notes } from "../../stores/note.js";

export class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * `data-note-id` 属性からノートのIDを取得
   * `<note-item data-note-id="xxxxxxxx">` のように指定されていることを想定
   *
   * @returns {string}
   */
  #getAttrNoteId() {
    const noteId = this.getAttribute("data-note-id");

    if (noteId == null) {
      throw new Error("[NoteItem] `data-note-id` 属性が指定されていません");
    }

    return noteId;
  }

  connectedCallback() {
    const noteId = this.#getAttrNoteId();

    /**
     * ノート一覧の変更時の描画の更新
     */
    $notes.subscribe((notes) => {
      const note = notes.find((n) => n.meta.id === noteId);

      console.log(`  -> [NoteItem] ノート一覧の変更検知: ${noteId}`);

      if (note == null) {
        throw new Error(`指定されたIDのノートが見つかりません: ${noteId}`);
      }

      this.render(note);
    });
  }

  /**
   * メモノートのときの描画
   *
   * @param {NoteWith<"MEMO">} note
   */
  #renderMemoNote(note) {
    return `<div>${note.content}</div>`;
  }

  /**
   * TODOノートのときの描画
   *
   * @param {NoteWith<"TODO">} note
   */
  #renderTodoNote(note) {
    return `<div>${note.content.map((item) => item.text).join(", ")}</div>`;
  }

  /**
   * ノートの描画関数を取得
   *
   * @param {Mode} mode
   * @returns {(note: Note) => string}
   */
  #getNoteRenderer(mode) {
    return { MEMO: this.#renderMemoNote, TODO: this.#renderTodoNote }[mode];
  }

  /**
   * ノートの描画
   *
   * @param {Note} note 単一のノート (メモまたはTODO)
   */
  render(note) {
    const render = this.#getNoteRenderer(note.type);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteItem/style.css">
      <div class="delete-btn">🗑️</div>
      <div class="content" data-note-type="${note.type}">
        ${render(note)}
      </div>
    `;
  }
}

customElements.define("note-item", NoteItem);
