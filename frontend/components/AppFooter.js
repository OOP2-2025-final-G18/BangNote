export class AppFooter extends HTMLElement {
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
  }
 
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./components/AppFooter.css">
 
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
    this.shadowRoot.querySelectorAll(".color").forEach(color => {
      color.addEventListener("click", () => {
        this.shadowRoot.querySelectorAll(".color")
          .forEach(c => c.classList.remove("selected"));
 
        color.classList.add("selected");
        this.selectedColor = color.dataset.color;
 
        //  NoteDetail へ色変更を通知
        this.dispatchEvent(new CustomEvent("color-change", {
          detail: { color: this.selectedColor },
          bubbles: true,
          composed: true
        }));
      });
    });
 
    // チェックON/OFF
    const checkbox = this.shadowRoot.querySelector("#notify-check");
    checkbox.addEventListener("change", (e) => {
      this.notifyEnabled = e.target.checked;
    });
 
    // 日付変更
    this.shadowRoot.querySelector(".date-input")
      .addEventListener("change", (e) => {
        this.deadline = new Date(e.target.value);
        if (this.notifyEnabled) {
          this.scheduleNotification();
        }
      });
  }
 
  scheduleNotification() {
    if (!this.deadline || !this.notifyEnabled) return;
    if (!("Notification" in window)) return;
 
    Notification.requestPermission().then(permission => {
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
 
customElements.define("app-footer", AppFooter);