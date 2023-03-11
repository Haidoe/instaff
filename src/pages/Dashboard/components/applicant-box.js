import StarRating from "../../../components/star-rating";
import Modal from "../../../components/modal";
import ProfileModal from "../../../components/modal/profile";
import getFeedbackRatingByUser from "../../../js/ratingandfeedback/getFeedbackRatingByUser";
import {
  hireApplicant,
  cancelHiredApplicant,
  rejectApplicant,
} from "../../../js/applicants";
class ApplicantBox {
  constructor(obj) {
    this.data = obj;
    this.wrapper = null;

    this.initElements();
  }

  async initElements() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "applicant";

    if (this.data.status === "rejected") {
      this.wrapper.classList.add("rejected");
    }

    const img = document.createElement("img");
    img.src = this.data.userProfileImageUrl ?? "/static/images/anonymous.svg";
    img.alt = "Applicant Image";

    this.wrapper.appendChild(img);

    const content = document.createElement("div");
    content.className = "content";

    const title = document.createElement("h4");

    title.textContent = this.data.userDisplayName;

    content.appendChild(title);

    const stars = new StarRating(0);
    content.appendChild(stars.toElement());

    getFeedbackRatingByUser(this.data.userId).then(({ rating, total }) => {
      this.data = {
        ...this.data,
        rating,
        total,
      };

      stars.prefix = rating || null;
      stars.suffix = `(${total})`;
      stars.rating = Math.floor(rating);
      stars.rerender();
    });

    const meta = document.createElement("div");
    meta.className = "meta";

    const anchorViewProfile = document.createElement("a");
    anchorViewProfile.href = "javascript:void(0)";
    anchorViewProfile.className = "gradient-text";
    anchorViewProfile.textContent = "View Profile";

    anchorViewProfile.addEventListener("click", () => {
      const modal = new ProfileModal(this.data);

      modal.open();
    });

    meta.appendChild(anchorViewProfile);

    this.actionBtns = document.createElement("div");
    this.actionBtns.className = "action-btns";

    meta.appendChild(this.actionBtns);
    this.initActionBtns();
    this.renderActionBtns();
    content.appendChild(meta);
    this.wrapper.appendChild(content);
  }

  initActionBtns() {
    this.btnRefuse = document.createElement("button");
    this.btnRefuse.className = "refuse secondary-button";
    this.btnRefuse.textContent = "Reject";

    this.btnRefuse.addEventListener("click", () => {
      const modal = new Modal();
      modal.wrapper = this.wrapper;
      modal.modalContent.innerHTML = `
        Are you sure you want to reject <a href="javascript:void(0)"> ${this.data.userDisplayName} </a>?
      `;

      modal.handleConfirm = () => {
        rejectApplicant(this.data.id);
        this.data.status = "rejected";
        this.renderActionBtns();
        this.wrapper.classList.add("rejected");
        modal.close();
      };

      modal.open();
    });

    this.btnCancelRefuse = document.createElement("button");
    this.btnCancelRefuse.className = "refuse secondary-button";
    this.btnCancelRefuse.textContent = "Rejected.";

    this.btnCancelRefuse.addEventListener("click", () => {
      const modal = new Modal();

      modal.modalContent.innerHTML = `
        Are you sure you want to cancel rejecting <a href="javascript:void(0)"> ${this.data.userDisplayName} </a>?
      `;

      modal.handleConfirm = () => {
        cancelHiredApplicant(this.data.id);
        this.data.status = "pending";
        this.renderActionBtns();
        this.wrapper.classList.remove("rejected");
        modal.close();
      };

      modal.open();
    });

    this.btnHire = document.createElement("button");
    this.btnHire.className = "hire primary-button";
    this.btnHire.textContent = "Hire";

    this.btnHire.addEventListener("click", () => {
      const modal = new Modal();
      modal.wrapper = this.wrapper;
      modal.modalContent.innerHTML = `
        In order to proceed, you must agree to hire the candidate as a <a href="javascript:void(0)"> temporary worker </a> and to <a href="javascript:void(0)"> sign a contract </a> of employment.
      `;

      modal.handleConfirm = () => {
        hireApplicant(this.data.id);
        this.data.status = "hired";
        this.renderActionBtns();
        modal.close();
      };

      modal.open();
    });

    this.btnCancelHire = document.createElement("button");
    this.btnCancelHire.className = "refuse secondary-button";
    this.btnCancelHire.textContent = "Hired.";

    this.btnCancelHire.addEventListener("click", () => {
      const modal = new Modal();
      modal.wrapper = this.wrapper;
      modal.modalContent.innerHTML = `
        Are you sure you want to cancel hiring, <a href="javascript:void(0)"> ${this.data.userDisplayName} </a>?.
      `;

      modal.handleConfirm = () => {
        cancelHiredApplicant(this.data.id);
        this.data.status = "pending";
        this.renderActionBtns();
        modal.close();
      };

      modal.open();
    });
  }

  renderActionBtns() {
    this.actionBtns.innerHTML = "";

    if (this.data.status === "hired") {
      this.actionBtns.appendChild(this.btnCancelHire);
    } else if (this.data.status === "rejected") {
      this.actionBtns.appendChild(this.btnCancelRefuse);
    } else {
      this.actionBtns.appendChild(this.btnRefuse);
      this.actionBtns.appendChild(this.btnHire);
    }
  }

  toElement() {
    return this.wrapper;
  }
}

export default ApplicantBox;
