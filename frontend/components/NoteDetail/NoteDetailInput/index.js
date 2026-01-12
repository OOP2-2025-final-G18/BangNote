import { $mode } from "../../../stores/mode.js";
import { effect } from "https://esm.run/nanostores";
import { $noteDetail } from "../../../stores/note.js";

export class NoteDetailInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.textarea = this.shadowRoot.querySelector("textarea");
    this.todoArea = this.shadowRoot.querySelector(".todo-area");

    // MEMO/TODO切替の監視
    $mode.subscribe(() => {
      this.render();
      this.textarea = this.shadowRoot.querySelector("textarea");
      this.todoArea = this.shadowRoot.querySelector(".todo-area");
      this.updateView();
      this.setupEvents();
    });

    // MEMOのコマンド監視
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.textarea) {
        this.detectCommandFromMemo();
      }
    });

    // 色変更イベント
    document.addEventListener("color-change", (e) => {
      this.changeColor(e.detail.color);
    });

    // $noteDetail 変更監視（TODOレンダリング）
    effect(() => {
      const note = $noteDetail.get();
      if ($mode.get() === "TODO" && note?.content) {
        this.todoArea.innerHTML = "";
        note.content.forEach((t) => this.addTodoRow(t.text, t.done));
      }
    });
  }

  render() {
    const mode = $mode.get();
    const note = $noteDetail.get();

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/NoteDetailInput/style.css">
      <div class="content" data-note-type="${mode}">
        <textarea placeholder="メモを入力...">${
          mode === "MEMO" ? note?.content ?? "" : ""
        }</textarea>
        <div class="todo-area ${mode === "TODO" ? "" : "hidden"}"></div>
      </div>
    `;

    this.textarea = this.shadowRoot.querySelector("textarea");
    this.todoArea = this.shadowRoot.querySelector(".todo-area");

    this.updateView();
    this.setupEvents();
  }

  setupEvents() {
    if (!this.textarea) return;
    this.textarea.addEventListener("input", () => {
      const current = $noteDetail.get();
      $noteDetail.set({ ...current, content: this.textarea.value });
    });
  }

  updateView() {
    if ($mode.get() === "TODO") {
      this.textarea?.classList.add("hidden");
      this.todoArea.classList.remove("hidden");
      if (this.todoArea.children.length === 0) this.addTodoRow();
    } else {
      this.textarea?.classList.remove("hidden");
      this.todoArea.classList.add("hidden");
    }
  }

  detectCommandFromMemo() {
    if (!this.textarea) return;
    const lines = this.textarea.value.split("\n");
    const lastLine = lines[lines.length - 1];

    if (lastLine === "!TODO") {
      lines.pop();
      this.textarea.value = lines.join("\n");
      $mode.set("TODO");
      this.updateView();
    }
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
    input.placeholder = "TODOを入力";

    const updateStore = () => {
      const todos = [...this.todoArea.querySelectorAll(".todo-row")].map(
        (r) => ({
          text: r.querySelector("input[type=text]").value,
          done: r.querySelector("input[type=checkbox]").checked,
        })
      );
      $noteDetail.set({ ...$noteDetail.get(), content: todos });
    };

    checkbox.addEventListener("change", updateStore);
    input.addEventListener("input", updateStore);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.addTodoRow();
      }

      //空の状態でBackspace/Deleteを押したら削除
      if ((e.key === "Backspace" || e.key === "Delete") && input.value === "") {
        e.preventDefault();

        // 最後の1つは残す
        if (this.todoArea.children.length > 1) {
          const prevRow = row.previousElementSibling;
          row.remove();

          // 前の行にフォーカス移動
          if (prevRow) {
            const prevInput = prevRow.querySelector("input[type=text]");
            prevInput?.focus();
            prevInput?.setSelectionRange(
              prevInput.value.length,
              prevInput.value.length
            );
          }

          updateStore();
        }
      }

      if (input.value === "!MEMO") {
        $mode.set("MEMO");
        this.updateView();
      }
    });

    row.appendChild(checkbox);
    row.appendChild(input);
    this.todoArea.appendChild(row);
    input.focus();

    updateStore();
  }

  changeColor(color) {
    const target = $mode.get() === "TODO" ? this.todoArea : this.textarea;
    if (!target) return;
    target.classList.remove("white", "red", "blue", "green");
    target.classList.add(color);
  }
}

customElements.define("note-detail-input", NoteDetailInput);
