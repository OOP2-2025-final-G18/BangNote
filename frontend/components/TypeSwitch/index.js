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

      // TODO (@kouro0328): タブのアクティブ状態の切り替えを実装する.
      // - 選択されているモードに対応するタブに `data-active` 属性を付与する
      // - それ以外のタブからは `data-active` 属性を削除する
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

        // TODO (@kouro0328): タブクリック時のモード変更を実装する.
        // モードの変更はほかのコンポーネントにも伝えないといけないので, `$mode` ストアを使います.
        // `$mode` ストアが定義されている `stores/mode.js` にサンプルコードがあります.
        //
        // - クリックされたタブに対応するモードを `$mode` に設定する
        //   - 例えば、`MEMO` タブがクリックされたときは `$mode.set("MEMO")` を実行する
        // - 逆に, このコンポーネントのタブの状態変更は行わない
        //   - 上部の `$mode.subscribe` の中でタブのアクティブ状態を更新するので不要.
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
