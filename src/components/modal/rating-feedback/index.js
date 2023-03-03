import Modal from "../index";
import "./style.scss";

class RatingFeedback extends Modal {
  constructor(textContent) {
    super(textContent);
    this.hideMeta();
    this.addContainerClass("rating-feedback-modal");

    // You can do this
    this.modalContent.innerHTML = `
      <div class="your-desired-class-name-here">
        You're amazing. It will get better!
      </div>
    `;

    // But this is better and faster ---- and will practice your DOM skills
    const yourDesiredDivContainer = document.createElement("div");
    yourDesiredDivContainer.classList.add("your-desired-class-name-here");
    this.modalContent.appendChild(yourDesiredDivContainer);

    const btn = document.createElement("button");

    btn.textContent = "Click me!";

    btn.addEventListener("click", () => {
      console.log("You clicked me!");
      this.close();
    });

    yourDesiredDivContainer.appendChild(btn);

    this.changeMeLater();
  }

  changeMeLater() {
    const justAMessage = document.createElement("p");
    justAMessage.textContent = "I'm a message!";
    this.modalContent.appendChild(justAMessage);
  }
}

export default RatingFeedback;
