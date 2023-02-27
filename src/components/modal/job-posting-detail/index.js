import "./job-posting-detail.scss";

class Modal {
  constructor(textContent) {
    //This is where the modal get rendered.
    this.wrapper = document.querySelector("body");

    this.modal = document.createElement("div");
    this.modal.classList.add("jp-detail-main-modal");
    this.modal.classList.add("default");

    this.modalContainer = document.createElement("div");
    this.modalContainer.classList.add("modal-container");
    this.modal.appendChild(this.modalContainer);

    this.modalContent = document.createElement("div");
    this.modalContent.classList.add("modal-content");
    this.modalContent.textContent =
      textContent || "Please, replace with me something special.";
    this.modalContainer.appendChild(this.modalContent);

    //Close Button Related
    this.modalClose = document.createElement("button");
    this.modalClose.classList.add("close-btn");
    this.modalContainer.appendChild(this.modalClose);

    const closeIcon = document.createElement("span");
    closeIcon.className = "icon close-icon";
    this.modalClose.appendChild(closeIcon);

    const closeText = document.createElement("span");
    closeText.className = "visually-hidden";
    closeText.textContent = "Close Modal";
    this.modalClose.appendChild(closeText);

    //Events
    this.handleClose = () => {
      this.close();
    };

    this.modalClose.addEventListener("click", () => {
      this.handleClose();
    });
  }

  open() {
    this.wrapper.appendChild(this.modal);
  }

  close() {
    this.wrapper.removeChild(this.modal);
  }

  addContainerClass(className) {
    this.modalContainer.classList.add(className);
  }
}

export default Modal;
