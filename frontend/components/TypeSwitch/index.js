import { $mode } from "../../stores/mode.js";

export class TypeSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const tabs = this.shadowRoot.querySelectorAll(".tabs > div");

    /**
     * モード変更時のタブの更新
     */
    $mode.subscribe((mode) => {
      console.log("  -> [TypeSwitch] モード変更検知:", mode);
      tabs.forEach((tab) => {
        tab.toggleAttribute("data-active", tab.textContent === mode);
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
        $mode.set(tab.textContent);
      });
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/TypeSwitch/style.css">
      <div class="tabs" role="tablist">
        <div>MEMO</div>
        <div data-active>TODO</div>
      </div>
    `;
  }
}

customElements.define("type-switch", TypeSwitch);
