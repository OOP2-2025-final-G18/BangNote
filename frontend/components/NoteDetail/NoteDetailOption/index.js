import { $noteDetail, $notes } from "../../../stores/note.js";
import { $mode } from "../../../stores/mode.js";

const icon = {
  plane:
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z"/></svg>',
  add: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>',
};

export class NoteDetailOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();

    // 1. ノートのデータ監視（背景色・アイコン・日付同期）
    this.unsubscribeNote = $noteDetail.subscribe((note) => {
      this.syncUI(note);
      this.controlExternalInput(note);
    });

    // 2. モード監視（ラベルの切り替え）
    this.unsubscribeMode = $mode.subscribe((mode) => {
      this.updateLabel(mode);
    });

    // 3. ショートカットキーの登録
    this.handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        this.shadowRoot.querySelector(".add-btn").click();
      }
    };
    window.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    this.unsubscribeNote?.();
    this.unsubscribeMode?.();
    window.removeEventListener("keydown", this.handleKeydown);
  }

  // --- 外部の NoteDetailInput を直接操作する ---
  controlExternalInput(note) {
    // 親要素(NoteDetail)経由で隣の note-detail-input を取得
    const parent = this.getRootNode().host;
    if (!parent) return;
    const inputEl = parent.shadowRoot.querySelector("note-detail-input");
    if (!inputEl || !inputEl.shadowRoot) return;

    const textarea = inputEl.shadowRoot.querySelector("textarea");
    if (!textarea) return;

    // A. 背景色の連動
    // A. 背景色の連動（カラーコードで対応）
    textarea.style.backgroundColor = note.option?.color;

    // B. 入力監視のセットアップ (初回のみ)
    if (!textarea.dataset.watched) {
      textarea.dataset.watched = "true";
      textarea.addEventListener("input", (e) => {
        // 入力がある時だけ飛行機にするために再描画をキック
        this.syncUI($noteDetail.get(), e.target.value);
      });
    }
  }

  updateLabel(mode) {
    const label = this.shadowRoot.querySelector(".notify label");
    if (label) label.textContent = mode === "TODO" ? "締切日" : "通知日";
  }

  /**
   * 飛行機マークを表示させるかどうか
   * @param {Note} note
   * @returns {boolean}
   */
  #hasContent(note) {
    if (note.type === "MEMO") {
      return note.content.trim().length > 0;
    }
    if (note.type === "TODO") {
      return note.content.length > 0;
    }

    throw new Error("不明なタイプです");
  }

  syncUI(note, liveText = null) {
    if (!note || !note.option) return;

    // パレット枠線
    this.shadowRoot.querySelectorAll(".color").forEach((el) => {
      el.classList.toggle("selected", el.dataset.color === note.option.color);
    });

    // アイコン判定 (リアルタイム入力 liveText または ストアの内容をチェック)
    const btn = this.shadowRoot.querySelector(".add-btn");
    if (btn) {
      btn.innerHTML = this.#hasContent(note) ? icon.plane : icon.add;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/NoteDetail/NoteDetailOption/style.css">
      <div class="control-area">
        <div class="colors">
          <div class="color white" data-color="white"></div>
          <div class="color red" data-color="red"></div>
          <div class="color blue" data-color="blue"></div>
          <div class="color green" data-color="green"></div>
        </div>
        <div class="notify">
          <input type="checkbox" id="notify-check">
          <label for="notify-check">通知日</label>
          <input type="date" class="date-input">
        </div>
      </div>
      <div class="add-btn"></div>
    `;
  }

  setupEvents() {
    // カラーパレット
    const colorMap = {
      white: "#FFFFFF",
      red: "#f2c6c6",
      blue: "#d6e2f5",
      green: "#dbead4",
    };
    this.shadowRoot.querySelectorAll(".color").forEach((el) => {
      el.addEventListener("click", () => {
        const selected = el.dataset.color; // 例: "red"
        const hexColor = colorMap[selected]; // 例: "#f2c6c6"

        if (!hexColor) return;

        $noteDetail.set({
          ...$noteDetail.get(),
          option: {
            ...$noteDetail.get().option,
            // 色に対応したからコードを `color` プロパティーに代入する
            color: hexColor,
          },
        });
      });
    });

    // 保存ボタン
    this.shadowRoot.querySelector(".add-btn").addEventListener("click", () => {
      const current = $noteDetail.get();
      const newNote = {
        ...current,
        meta: { id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      };
      $notes.set([...$notes.get(), newNote]);
    });
  }
}

customElements.define("note-detail-option", NoteDetailOption);
