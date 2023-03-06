import DefaultImage from "../../../static/images/sample.jpg";
class ApplicantBox {
  constructor(obj) {
    this.data = obj;
    this.wrapper = null;

    this.initElements();
  }

  initElements() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "applicant";

    const img = document.createElement("img");
    img.src = this.data.profileImageUrl;
    img.alt = "Applicant Image";

    this.wrapper.appendChild(img);

    const content = document.createElement("div");
    content.className = "content";

    const title = document.createElement("h4");

    title.textContent = this.data.userDisplayName;

    content.appendChild(title);

    const stars = document.createElement("div");
    stars.className = "stars";

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("i");
      star.className = "fas fa-star";

      if (i < 4) {
        star.classList.add("active");
      }

      stars.appendChild(star);
    }

    const span = document.createElement("span");
    span.textContent = "( 4 )";
    stars.appendChild(span);

    content.appendChild(stars);

    // const p = document.createElement("p");
    // p.textContent = '" Willing to work part time! "';
    // content.appendChild(p);

    const meta = document.createElement("div");
    meta.className = "meta";

    const anchorViewProfile = document.createElement("a");
    anchorViewProfile.href = "javascript:void(0)";
    anchorViewProfile.className = "gradient-text";
    anchorViewProfile.textContent = "View Profile";

    meta.appendChild(anchorViewProfile);

    const actionBtns = document.createElement("div");
    actionBtns.className = "action-btns";

    const btnRefuse = document.createElement("button");
    btnRefuse.className = "refuse secondary-button";
    btnRefuse.textContent = "Refuse";
    actionBtns.appendChild(btnRefuse);

    const btnHire = document.createElement("button");
    btnHire.className = "hire primary-button";
    btnHire.textContent = "Hire";
    actionBtns.appendChild(btnHire);

    meta.appendChild(actionBtns);

    content.appendChild(meta);

    this.wrapper.appendChild(content);
  }

  toElement() {
    return this.wrapper;
  }
}

export default ApplicantBox;
