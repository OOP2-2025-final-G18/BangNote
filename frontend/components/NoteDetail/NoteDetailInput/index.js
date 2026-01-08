import { effect } from "https://cdn.jsdelivr.net/npm/nanostores@0.10.3/+esm";
import { $mode } from "../stores/mode.js";
import { $noteDetail } from "../stores/noteDetail.js";

export class NoteDetail extends HTMLElement {
  mode;
  textarea;
  todoArea;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();

    // ===== 追加：ストア変更を監視して再描画 =====
    effect(() => {
      const note = $noteDetail.get();
      if (!note) return;

      if ($mode.get() === "MEMO" && this.textarea) {
        if (this.textarea.value !== note.content) {
          this.textarea.value = note.content ?? "";
        }
      }
    });
  }

  render() {
    const mode = $mode.get();
    const note = $noteDetail.get();

    this.shadowRoot.innerHTML = `
      <style>
        textarea {
          width: 100%;
          height: 100%;
          border: none;
          resize: none;
          padding: 20px;
          font-size: 1.2rem;
          box-sizing: border-box;
          outline: none;
        }
        .todo-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
      </style>

      ${
        mode === "MEMO"
          ? `
          <textarea placeholder="メモを入力...">
            ${note?.content ?? ""}
          </textarea>
        `
          : `
          <div class="todo-area"></div>
        `
      }
    `;

    this.textarea = this.shadowRoot.querySelector("textarea");
    this.todoArea = this.shadowRoot.querySelector(".todo-area");

    if (mode === "TODO" && Array.isArray(note?.content)) {
      note.content.forEach((todo) => {
        this.addTodoRow(todo.text, todo.done);
      });
    }
  }

  setupEvents() {
    // ===== 追加：MEMO入力をストアへ反映 =====
    this.textarea?.addEventListener("input", () => {
      const current = $noteDetail.get();
      if (!current || current.type !== "MEMO") return;

      $noteDetail.set({
        ...current,
        content: this.textarea.value,
      });
    });
  }

  addTodoRow(text = "", done = false) {
    const row = document.createElement("div");
    row.className = "todo-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;

    const input = document.createElement("input");
    input.type = "text";
    input.value = text;

    row.appendChild(checkbox);
    row.appendChild(input);
    this.todoArea.appendChild(row);

    // ===== 追加：TODO変更をストアに同期 =====
    checkbox.addEventListener("change", () => this.syncTodoToStore());
    input.addEventListener("input", () => this.syncTodoToStore());

    // 既存：Enterで次のTODO追加
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.addTodoRow();
      }
    });
  }

  // ===== 追加：TODO全体をストアへ反映 =====
  syncTodoToStore() {
    const rows = [...this.todoArea.querySelectorAll(".todo-row")];
    const todos = rows.map((row) => ({
      text: row.querySelector("input[type=text]").value,
      done: row.querySelector("input[type=checkbox]").checked,
    }));

    const current = $noteDetail.get();
    if (!current || current.type !== "TODO") return;

    $noteDetail.set({
      ...current,
      content: todos,
    });
  }
}

customElements.define("note-detail", NoteDetail);
