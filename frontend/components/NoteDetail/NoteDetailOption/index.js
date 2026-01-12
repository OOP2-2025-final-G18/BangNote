const icon = {
  plane:
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z"/></svg>',
  add: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>',
};
 
export class NoteDetailOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.selectedColor = "white";
    this.deadline = null;
    this.notifyEnabled = false;
  }
 
  connectedCallback() {
    this.render();
    this.setupEvents();
 
    // NoteDetailからの入力通知を受け取る
    window.addEventListener("note-input", (e) => {
      this.updateAddButton(e.detail.hasText);
    });
  }
 
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/frontend/components/NoteDetail/NoteDetailOption/style.css">
 
      <div class="control-area">
        <div class="colors">
          <div class="color white selected" data-color="white"></div>
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
 
      <div class="add-btn">+</div>
    `;
  }
 
  setupEvents() {
    // 色選択
    this.shadowRoot.querySelectorAll(".color").forEach((color) => {
      color.addEventListener("click", () => {
        this.shadowRoot
          .querySelectorAll(".color")
          .forEach((c) => c.classList.remove("selected"));
 
        color.classList.add("selected");
        this.selectedColor = color.dataset.color;
 
        this.dispatchEvent(
          new CustomEvent("color-change", {
            detail: { color: this.selectedColor },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
 
    // 通知チェック
    const checkbox = this.shadowRoot.querySelector("#notify-check");
    checkbox.addEventListener("change", (e) => {
      this.notifyEnabled = e.target.checked;
    });
 
    // 日付変更
    this.shadowRoot
      .querySelector(".date-input")
      .addEventListener("change", (e) => {
        this.deadline = new Date(e.target.value);
        if (this.notifyEnabled) {
          this.scheduleNotification();
        }
      });
  }
 
  updateAddButton(hasText) {
    const btn = this.shadowRoot.querySelector(".add-btn");
    // btn.textContent = hasText ? "" : "+";
    btn.innerHTML = hasText ? icon.plane : icon.add;
  }
 
  scheduleNotification() {
    if (!this.deadline || !this.notifyEnabled) return;
    if (!("Notification" in window)) return;
 
    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") return;
 
      const delay = this.deadline - new Date();
      if (delay > 0) {
        setTimeout(() => {
          new Notification("通知日です", {
            body: "設定した日付になりました",
          });
        }, delay);
      }
    });
  }
}
 
customElements.define("note-detail-option", NoteDetailOption);
 
 