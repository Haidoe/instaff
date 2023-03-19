import Modal from "../index";
import "./first-time.scss";

class FirstTime extends Modal {
  constructor() {
    super(null);

    this.modal.classList.add("first-time-modal");

    this.buttonSecondary.textContent = "Maybe later";
    this.buttonPrimary.textContent = "Go to profile";

    this.modalContent.innerHTML = "";

    const title = document.createElement("p");
    title.textContent = "To ensure best experience, please complete your profile.";
    this.modalContent.appendChild(title);

    this.handleConfirm = () => {
      console.log("Confirm");
      this.close();
    };


    this.buttonPrimary.addEventListener('click', function (e) {
      console.log("Primary clicked");
      window.open("/account-employee");
    })

  }

}

export default FirstTime;
