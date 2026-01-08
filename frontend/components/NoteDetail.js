import { $mode } from "../stores/mode.js";

export class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();

    this.textarea = this.shadowRoot.querySelector("textarea");
    this.todoArea = this.shadowRoot.querySelector(".todo-area");

    $mode.subscribe(() => {
      this.updateView();
    });

    // MEMO入力監視（コマンド用）
    this.textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.detectCommandFromMemo();
      }
    });

    document.addEventListener("color-change", (e) => {
      this.changeColor(e.detail.color);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail.css">

      <textarea placeholder="メモを入力..."></textarea>

      <div class="todo-area hidden"></div>
    `;
  }

  updateView() {
    if ($mode.get() === "TODO") {
      this.textarea.classList.add("hidden");
      this.todoArea.classList.remove("hidden");

      if (this.todoArea.children.length === 0) {
        this.addTodoRow();
      }
    } else {
      this.textarea.classList.remove("hidden");
      this.todoArea.classList.add("hidden");
    }
  }

  detectCommandFromMemo() {
    const lines = this.textarea.value.split("\n");
    const lastLine = lines[lines.length - 1];

    if (lastLine === "!TODO") {
      lines.pop();
      this.textarea.value = lines.join("\n");
      $mode.set("TODO");
      this.updateView();
    }
  }

  addTodoRow() {
    const row = document.createElement("div");
    row.className = "todo-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "TODOを入力";

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.addTodoRow();
      }
      if (input.value === "!MEMO") {
        this.todoArea.innerHTML = "";
        $mode.set("MEMO");
        this.updateView();
      }
    });

    row.appendChild(checkbox);
    row.appendChild(input);
    this.todoArea.appendChild(row);

    input.focus();
  }

  setupEvents() {
    /*ここから*/
    const textarea = this.shadowRoot.querySelector("textarea");

    // 入力検知 → AppFooterへ通知
    textarea.addEventListener("input", () => {
      const hasText = textarea.value.trim().length > 0;

      this.dispatchEvent(
        new CustomEvent("note-input", {
          detail: { hasText },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  changeColor(color) {
    const target = $mode.get() === "TODO" ? this.todoArea : this.textarea;

    target.classList.remove("white", "red", "blue", "green");
    target.classList.add(color);
  }
}

customElements.define("note-detail", NoteDetail);
