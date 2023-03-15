import Modal from "../index";
import "./first-time.scss";

class FirstTime extends Modal {
  constructor() {
    super(null);

    this.modal.classList.add("first-time-modal");

    this.buttonSecondary.textContent = "SAMPLE TEXT";
    this.buttonPrimary.textContent = "REDIRECT";

    this.modalContent.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Welcome to the first time modal";
    this.modalContent.appendChild(title);

    this.handleConfirm = () => {
      console.log("Confirm");
      this.close();
    };
  }
}

export default FirstTime;
