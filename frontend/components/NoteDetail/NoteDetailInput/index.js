import { $mode } from "../../../stores/mode.js";
import { effect } from "https://esm.run/nanostores";
import { $noteDetail } from "../../../stores/note.js";

export class NoteDetailInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isUpdatingFromStore = false;
    this.updateStoreTimeoutId = null;
    this.handleKeydown = null;
    this.handleColorChange = null;
    this.unsubscribeMode = null;
    this.unsubscribeEffect = null;
    this.handleInput = null;
  }

  connectedCallback() {
    this.render();
    this.textarea = this.shadowRoot.querySelector("textarea");
    this.todoArea = this.shadowRoot.querySelector(".todo-area");

    // イベント委譲でtextareaのinputイベントを監視
    this.handleInput = (e) => {
      if (e.target.tagName === "TEXTAREA") {
        const current = $noteDetail.get();
        $noteDetail.set({ ...current, content: e.target.value });
      }
    };
    this.shadowRoot.addEventListener("input", this.handleInput);

    // MEMO/TODO切替の監視（購読解除関数を保存）
    this.unsubscribeMode = $mode.subscribe(() => {
      this.render();
      this.textarea = this.shadowRoot.querySelector("textarea");
      this.todoArea = this.shadowRoot.querySelector(".todo-area");
      this.updateView();
    });

    // MEMOのコマンド監視（ハンドラーを保存）
    this.handleKeydown = (e) => {
      if (
        e.key === "Enter" &&
        this.textarea &&
        this.shadowRoot.activeElement === this.textarea
      ) {
        this.detectCommandFromMemo();
      }
    };
    document.addEventListener("keydown", this.handleKeydown);

    // 色変更イベント（ハンドラーを保存）
    this.handleColorChange = (e) => {
      this.changeColor(e.detail.color);
    };
    document.addEventListener("color-change", this.handleColorChange);

    // $noteDetail 変更監視（購読解除関数を保存）
    this.unsubscribeEffect = $noteDetail.subscribe((note) => {
      if (this.isUpdatingFromStore) return;

      // ★ MEMOモード時の初期値読み込み対応
      if ($mode.get() === "MEMO" && typeof note?.content === "string") {
        this.isUpdatingFromStore = true;
        if (this.textarea) {
          this.textarea.value = note.content;
        }
        this.isUpdatingFromStore = false;
      }

      // TODOモード時は再レンダリングしない（自分自身の更新なので）
      // 初期ロード時のみ処理する
    });

    this.updateView();
  }

  disconnectedCallback() {
    // イベントリスナーの削除
    if (this.handleKeydown) {
      document.removeEventListener("keydown", this.handleKeydown);
    }
    if (this.handleColorChange) {
      document.removeEventListener("color-change", this.handleColorChange);
    }
    if (this.handleInput) {
      this.shadowRoot.removeEventListener("input", this.handleInput);
    }

    // ストア購読の解除
    if (this.unsubscribeMode) {
      this.unsubscribeMode();
    }
    if (this.unsubscribeEffect) {
      this.unsubscribeEffect();
    }

    // デバウンスタイマーのクリア
    if (this.updateStoreTimeoutId) {
      clearTimeout(this.updateStoreTimeoutId);
    }
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

    if (mode === "MEMO") {
      // ★ 必ず文字列を代入（null/undefined防止）
      this.textarea.value = note?.content ?? "";
      // ★ 明示的にフォーカス
      setTimeout(() => {
        this.textarea?.focus();
      }, 0);
    }
  }

  updateView() {
    const note = $noteDetail.get();

    if ($mode.get() === "TODO") {
      this.textarea?.classList.add("hidden");
      this.todoArea.classList.remove("hidden");

      // ★ 初期値がある場合は読み込む
      if (this.todoArea.children.length === 0) {
        if (Array.isArray(note?.content) && note.content.length > 0) {
          note.content.forEach((t, index) => {
            // ★ 最後の行だけフォーカスする
            const isLast = index === note.content.length - 1;
            this.addTodoRow(t.text, t.completed, isLast);
          });
        } else {
          this.addTodoRow("", false, true);
        }
      }
    } else {
      this.textarea?.classList.remove("hidden");
      this.todoArea.classList.add("hidden");

      // ★ MEMO初期値の読み込み
      if (this.textarea && typeof note?.content === "string") {
        this.textarea.value = note.content;
      }
    }
  }

  detectCommandFromMemo() {
    if (!this.textarea) return;
    const lines = this.textarea.value.split("\n");
    const firstLine = lines[0];

    if (firstLine === "!TODO") {
      lines.pop();
      this.textarea.value = lines.join("\n");
      $mode.set("TODO");
      this.updateView();
    }
    if (firstLine === "!MEMO") {
      lines.pop();
      // ストアも更新
      const current = $noteDetail.get();
      $noteDetail.set({ ...current, content: "" });

      setTimeout(() => {
        this.textarea.value = "";
        this.textarea.focus();
        this.textarea.setSelectionRange(0, 0);
      }, 0);
    }
  }

  addTodoRow(text = "", done = false, shouldFocus = true) {
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
      if (this.isUpdatingFromStore) {
        return;
      }

      const todos = [...this.todoArea.querySelectorAll(".todo-row")].map(
        (r) => ({
          text: r.querySelector("input[type=text]").value,
          completed: r.querySelector("input[type=checkbox]").checked,
        })
      );
      // ★ 空のテキストも保存する（フィルタリングしない）

      $noteDetail.set({ ...$noteDetail.get(), content: todos });
    };

    const updateStoreDebounced = () => {
      if (this.updateStoreTimeoutId) {
        clearTimeout(this.updateStoreTimeoutId);
      }
      this.updateStoreTimeoutId = setTimeout(updateStore, 200);
    };

    checkbox.addEventListener("change", updateStore);

    input.addEventListener("input", () => {
      updateStoreDebounced();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        // ★ !MEMOコマンドの検知（Enterキー押下時）
        if (input.value === "!MEMO") {
          input.value = "";
          if (this.updateStoreTimeoutId) {
            clearTimeout(this.updateStoreTimeoutId);
          }
          updateStore();
          $mode.set("MEMO");
          this.updateView();

          // ★ MEMOモードに切り替わった後、textareaにフォーカス
          setTimeout(() => {
            if (this.textarea) {
              this.textarea.focus();
              // カーソルを末尾に移動
              this.textarea.setSelectionRange(
                this.textarea.value.length,
                this.textarea.value.length
              );
            }
          }, 0);

          return;
        }

        if (this.updateStoreTimeoutId) {
          clearTimeout(this.updateStoreTimeoutId);
          updateStore();
        }
        this.addTodoRow("", false, true); // ★ Enterで追加する時はフォーカスする
      }

      if (e.key === "Backspace" && input.value === "") {
        e.preventDefault();

        // ★ 最後の1行は削除しない（常に1行は残す）
        if (this.todoArea.children.length > 1) {
          const prevRow = row.previousElementSibling;

          if (this.updateStoreTimeoutId) {
            clearTimeout(this.updateStoreTimeoutId);
          }

          row.remove();

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
    });

    row.appendChild(checkbox);
    row.appendChild(input);
    this.todoArea.appendChild(row);

    // ★ shouldFocusがtrueの時だけフォーカスする
    if (shouldFocus) {
      input.focus();
    }
  }

  changeColor(color) {
    const target = $mode.get() === "TODO" ? this.todoArea : this.textarea;
    if (!target) return;
    target.classList.remove("white", "red", "blue", "green");
    target.classList.add(color);
  }
}

customElements.define("note-detail-input", NoteDetailInput);
