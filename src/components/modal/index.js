import "./modal.scss";

class Modal {
  constructor(textContent) {
    //This is where the modal get rendered.
    this.wrapper = document.querySelector("body");

    this.modal = document.createElement("div");
    this.modal.classList.add("main-modal");

    this.modalContainer = document.createElement("div");
    this.modalContainer.classList.add("modal-container");
    this.modal.appendChild(this.modalContainer);

    this.modalContent = document.createElement("div");
    this.modalContent.classList.add("modal-content");
    this.modalContent.textContent =
      textContent || "Please, replace with me something special.";
    this.modalContainer.appendChild(this.modalContent);

    //Action Buttons
    this.modalMeta = document.createElement("div");
    this.modalMeta.classList.add("modal-meta");
    this.modalContainer.appendChild(this.modalMeta);

    //Secondary Button
    this.buttonSecondary = document.createElement("button");
    this.buttonSecondary.classList.add("secondary-button");
    this.buttonSecondary.textContent = "Cancel";
    this.modalMeta.appendChild(this.buttonSecondary);

    this.buttonPrimary = document.createElement("button");
    this.buttonPrimary.classList.add("primary-button");
    this.buttonPrimary.textContent = "Confirm";
    this.modalMeta.appendChild(this.buttonPrimary);

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

    this.handleConfirm = () => {
      this.close();
    };

    this.modalClose.addEventListener("click", () => {
      this.handleClose();
    });

    this.buttonSecondary.addEventListener("click", () => {
      this.handleClose();
    });

    this.buttonPrimary.addEventListener("click", () => {
      this.handleConfirm();
    });
  }

  open() {
    document.body.classList.add("no-scroll");
    this.wrapper.appendChild(this.modal);
  }

  close() {
    document.body.classList.remove("no-scroll");
    this.wrapper.removeChild(this.modal);
  }

  hideMeta() {
    this.modalMeta.style.display = "none";
  }

  addContainerClass(className) {
    this.modalContainer.classList.add(className);
  }
}

export default Modal;
