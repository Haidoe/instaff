import { pageTransition } from "../../../router";
import Modal from "../index";
import "./first-time.scss";

class FirstTime extends Modal {
  constructor() {
    super(null);

    this.modal.classList.add("first-time-modal");

    this.buttonSecondary.textContent = "Just Browsing";
    this.buttonPrimary.textContent = "Let's do it";

    this.modalContent.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = "Thank you for creating an account with us!";
    const p1 = document.createElement("p");
    p1.textContent =
      "To make the most of our services, we kindly ask you to complete two simple steps:";

    p1.classList.add("bold-p");
    const p2 = document.createElement("p");
    p2.textContent =
      "1. To apply for jobs, please provide proof of your work eligibility.";
    const p3 = document.createElement("p");
    p3.textContent =
      "2. Set your profile preferences to that we can match you with the best job opportunities.";

    this.modalContent.appendChild(title);
    this.modalContent.appendChild(p1);
    this.modalContent.appendChild(p2);
    this.modalContent.appendChild(p3);

    this.handleConfirm = () => {
      console.log("Confirm");
      this.close();
    };

    this.buttonPrimary.addEventListener("click", function (e) {
      console.log("Primary clicked");
      // window.open("/account-employee");
      pageTransition("/account-employee");
    });
  }
}

export default FirstTime;
