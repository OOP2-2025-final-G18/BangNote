import { $notes, $noteDetail, $selectedNoteId } from "../../stores/note.js";
import { $mode } from "../../stores/mode.js";

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
     * ホバー時に詳細を更新
     */
    this.addEventListener("mouseenter", () => {
      const notes = $notes.get();
      const note = notes.find((n) => n.meta.id === noteId);
      if (note) {
        $noteDetail.set(note);
        $mode.set(note.type);
      }
    });

    /**
     * ホバー解除時に詳細を選択中のノートに戻す
     */
    this.addEventListener("mouseleave", () => {
      const selectedId = $selectedNoteId.get();
      if (selectedId) {
        const notes = $notes.get();
        const selectedNote = notes.find((n) => n.meta.id === selectedId);
        if (selectedNote) {
          $noteDetail.set(selectedNote);
          $mode.set(selectedNote.type);
        }
      }
    });

    /**
     * クリック時に選択状態を更新し、モードも切り替える
     */
    this.addEventListener("click", () => {
      const notes = $notes.get();
      const note = notes.find((n) => n.meta.id === noteId);
      if (note) {
        $selectedNoteId.set(noteId);
        $noteDetail.set(note);
        $mode.set(note.type);
      }
    });

    /**
     * 選択状態の変更時のスタイルの更新
     */
    $selectedNoteId.subscribe((selectedId) => {
      if (selectedId === noteId) {
        this.setAttribute("selected", "");
      } else {
        this.removeAttribute("selected");
      }
    });

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
    // TODO (@rio49k): メモノートの内容表示を改善する.
    // 必要に応じて, `style.css` も調整する (`.content` には `data-note-type="MEMO"` が付与済み).
    //
    // - メモが長いときやフォントサイズなどの調整をする
    return `<div>${note.content}</div>`;
  }

  /**
   * TODOノートのときの描画
   *
   * @param {NoteWith<"TODO">} note
   */
  #renderTodoNote(note) {
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 16.2l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"/></svg>`;
    const uncheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5z"/></svg>`;

    return `
      <ul class="todo-list">
        ${note.content
          .map(
            (t) => `
            <li class="todo-item">
              ${t.completed ? checkIcon : uncheckIcon}
              <span>${t.text}</span>
            </li>
          `,
          )
          .join("")}
      </ul>
    `;
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
