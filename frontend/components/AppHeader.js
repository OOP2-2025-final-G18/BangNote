import { $mode } from "../stores/mode.js";

export class AppHeader extends HTMLElement {
  mode;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    $mode.subscribe((value) => {
      this.mode = value;
      this.updateActiveTab();
    });

    this.shadowRoot.querySelectorAll(".tabs > div").forEach((tab) => {
      tab.addEventListener("click", () => {
        $mode.set(tab.textContent);
      });
    });
  }

  updateActiveTab() {
    const tabs = this.shadowRoot.querySelectorAll(".tabs > div");
    tabs.forEach((tab) => {
      if (tab.textContent === this.mode) {
        tab.setAttribute("data-active", "");
      } else {
        tab.removeAttribute("data-active");
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/AppHeader.css">
      <div class="tabs" role="tablist">
        <div>MEMO</div>
        <div data-active>TODO</div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
 