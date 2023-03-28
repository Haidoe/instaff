import { getUserDetails } from "../../../js/users";
import StarRating from "../../star-rating";
import Modal from "../index";
import "./profile.scss";

class Profile extends Modal {
  constructor(data) {
    super("");
    this.data = data;
    this.profile = null;
    this.hideMeta();
    this.modal.classList.add("profile-modal");

    this.modalContent.innerHTML = "Loading...";

    this.getProfileInfo();
  }

  async getProfileInfo() {
    this.profile = await getUserDetails(this.data.userId);
    this.render();
  }

  render() {
    this.modalContent.innerHTML = "";
    const header = document.createElement("header");
    header.className = "profile-header";

    const img = document.createElement("img");
    img.src = this.data.userProfileImageUrl ?? "/static/images/anonymous.svg";
    img.alt = "Profile Image";

    img.addEventListener("error", (e) => {
      e.target.src = "/static/images/anonymous.svg";
    });

    header.appendChild(img);

    const content = document.createElement("div");
    content.className = "profile-content";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = this.profile.displayName;
    content.appendChild(title);

    const subtitle = document.createElement("div");
    subtitle.className = "subtitle";
    const star = new StarRating(0);
    subtitle.appendChild(star.toElement());

    star.suffix = `${this.data.rating}/5`;
    star.rating = Math.floor(this.data.rating);
    star.rerender();
    content.appendChild(subtitle);

    header.appendChild(content);

    this.modalContent.appendChild(header);

    const callBtn = document.createElement("button");
    callBtn.className = "call-btn";
    callBtn.textContent = "Call";

    callBtn.addEventListener("click", () => {
      window.open(`tel:${this.profile.contactNumber}`);
    });

    content.appendChild(callBtn);

    //Section
    const section = document.createElement("section");
    section.className = "profile-section";

    //Contact
    const infoContact = document.createElement("div");
    infoContact.classList.add("info-group");
    section.appendChild(infoContact);
    this.modalContent.appendChild(section);

    const infoContactProp = document.createElement("div");
    infoContactProp.classList.add("prop");
    infoContactProp.textContent = "Contact";
    infoContact.appendChild(infoContactProp);

    const infoContactValue = document.createElement("div");
    infoContactValue.classList.add("value");
    infoContactValue.textContent = this.profile.contactNumber;
    infoContact.appendChild(infoContactValue);

    //Email
    const infoEmail = document.createElement("div");
    infoEmail.classList.add("info-group");
    section.appendChild(infoEmail);
    this.modalContent.appendChild(section);

    const infoEmailProp = document.createElement("div");
    infoEmailProp.classList.add("prop");
    infoEmailProp.textContent = "Email Address";
    infoEmail.appendChild(infoEmailProp);

    const infoEmailValue = document.createElement("div");
    infoEmailValue.classList.add("value");
    infoEmailValue.textContent = this.profile.emailAddress;
    infoEmail.appendChild(infoEmailValue);

    //Address
    const infoAddress = document.createElement("div");
    infoAddress.classList.add("info-group");
    section.appendChild(infoAddress);
    this.modalContent.appendChild(section);

    const infoAddressProp = document.createElement("div");
    infoAddressProp.classList.add("prop");
    infoAddressProp.textContent = "Address";
    infoAddress.appendChild(infoAddressProp);

    const infoAddressValue = document.createElement("div");
    infoAddressValue.classList.add("value");
    infoAddressValue.textContent = `${this.profile.address}, ${this.profile.postalCode}, ${this.profile.province}`;
    infoAddress.appendChild(infoAddressValue);

    //Proof of Work
    const infoProofOfWork = document.createElement("div");
    infoProofOfWork.classList.add("info-group");
    section.appendChild(infoProofOfWork);
    this.modalContent.appendChild(section);

    const infoProofOfWorkProp = document.createElement("div");
    infoProofOfWorkProp.classList.add("prop");
    infoProofOfWorkProp.textContent = "Proof of Work";
    infoProofOfWork.appendChild(infoProofOfWorkProp);

    const infoProofOfWorkValue = document.createElement("div");
    infoProofOfWorkValue.classList.add("value");
    infoProofOfWorkValue.innerHTML = this.profile.uploadProfURL
      ? "Uploaded"
      : "No Proof of Work Uploaded";
    infoProofOfWork.appendChild(infoProofOfWorkValue);
  }

  open() {
    super.open();

    setTimeout(() => {
      this.modalContainer.classList.add("open");
    }, 100);
  }
}

export default Profile;
