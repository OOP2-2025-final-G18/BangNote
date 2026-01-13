import { $mode } from "../../stores/mode.js";

export class TypeSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    /**
     * モード変更時のタブの更新
     */
    $mode.subscribe((mode) => {
      console.log("  -> [TypeSwitch] モード変更検知:", mode);

      // 全てのタブを取得
      const tabs = this.shadowRoot.querySelectorAll(".tabs > div");
      
      tabs.forEach((tab) => {
        // タブのテキストと現在のモードが一致するか確認
        if (tab.textContent.trim() === mode) {
          // 選択されているモードに対応するタブに `data-active` 属性を付与
          tab.setAttribute("data-active", "");
        } else {
          // それ以外のタブからは `data-active` 属性を削除
          tab.removeAttribute("data-active");
        }
      });
    });

    /**
     * タブのクリック時の設定
     */
    this.shadowRoot.querySelectorAll(".tabs > div").forEach((tab) => {
      tab.addEventListener("click", () => {
        console.log(
          "<- [TypeSwitch] タブクリックによるモード変更:",
          tab.textContent,
        );

        // クリックされたタブのテキスト（MEMO または TODO）を取得
        const selectedMode = tab.textContent.trim();

        // `$mode` ストアに新しいモードを設定
        // これにより subscribe している全コンポーネントに通知が行く
        $mode.set(selectedMode);
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/TypeSwitch/style.css">
      <div class="tabs" role="tablist">
        <div data-active>MEMO</div>
        <div>TODO</div>
      </div>
    `;
  }
}

customElements.define("type-switch", TypeSwitch);