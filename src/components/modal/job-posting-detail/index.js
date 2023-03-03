import { getAuth, onAuthStateChanged } from "firebase/auth";
import addApplicant from "../../../js/applicants/addApplicant";
import deleteApplicationRecord from "../../../js/applicants/deleteApplicationRecord";
import isAlreadyApplied from "../../../js/applicants/isAlreadyApplied";
import { getUserDetails } from "../../../js/users";
import { extractTime } from "../../../js/utils";
import ConfirmModal from "../index";
import "./job-posting-detail.scss";

class Modal {
  constructor(data) {
    this.data = data;

    //Will have a value if the user has already applied for the job posting.
    this.applicationId = null;
    this.userId = null;
    this.userDetail = null;

    //This is where the modal get rendered.
    this.wrapper = document.querySelector("body");

    //This is where the modal elements get rendered.
    this.init();
  }

  init() {
    this.modal = document.createElement("div");
    this.modal.classList.add("jp-detail-main-modal");
    this.modal.classList.add("default");

    this.modalContainer = document.createElement("div");
    this.modalContainer.classList.add("modal-container");
    this.modal.appendChild(this.modalContainer);

    this.modalContent = document.createElement("div");
    this.modalContent.classList.add("modal-content");
    this.initContent();
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

  initContent() {
    this.modalContentHeader = document.createElement("header");
    this.modalContent.appendChild(this.modalContentHeader);

    this.modalContentHeaderImage = document.createElement("img");
    this.modalContentHeaderImage.src = this.data.bannerImageUrl;
    this.modalContentHeaderImage.alt = "job posting banner";
    this.modalContentHeader.appendChild(this.modalContentHeaderImage);

    this.modalContentHeaderTitle = document.createElement("h2");
    this.modalContentHeaderTitle.textContent = this.data.companyName;
    this.modalContentHeader.appendChild(this.modalContentHeaderTitle);

    this.initMeta();

    this.modalContentBody = document.createElement("div");
    this.modalContentBody.classList.add("modal-body");
    this.modalContent.appendChild(this.modalContentBody);

    this.modalContentBodyNav = document.createElement("nav");
    this.modalContentBody.appendChild(this.modalContentBodyNav);

    this.modalContentBodyNavList = document.createElement("ul");
    this.modalContentBodyNav.appendChild(this.modalContentBodyNavList);

    this.modalContentBodyNavListDetails = document.createElement("li");
    this.modalContentBodyNavListDetails.classList.add("active");
    this.modalContentBodyNavList.appendChild(
      this.modalContentBodyNavListDetails
    );

    this.modalContentBodyNavListDetailsLink = document.createElement("a");
    this.modalContentBodyNavListDetailsLink.href = "javascript:void(0)";
    this.modalContentBodyNavListDetailsLink.textContent = "Details";
    this.modalContentBodyNavListDetails.appendChild(
      this.modalContentBodyNavListDetailsLink
    );

    this.modalContentBodyNavListRating = document.createElement("li");
    this.modalContentBodyNavList.appendChild(
      this.modalContentBodyNavListRating
    );

    this.modalContentBodyNavListRatingLink = document.createElement("a");
    this.modalContentBodyNavListRatingLink.href = "javascript:void(0)";
    this.modalContentBodyNavListRatingLink.textContent = "Rating";
    this.modalContentBodyNavListRating.appendChild(
      this.modalContentBodyNavListRatingLink
    );

    this.initBodySectionDetail();
    this.initBodySectionRating();

    this.initContentNavListeners();
  }

  initBodySectionDetail() {
    this.modalContentBodySectionDetails = document.createElement("section");
    this.modalContentBodySectionDetails.classList.add("details");
    this.modalContentBody.appendChild(this.modalContentBodySectionDetails);

    const infoPositionTitle = document.createElement("div");
    infoPositionTitle.classList.add("info-group");
    this.modalContentBodySectionDetails.appendChild(infoPositionTitle);

    const infoPositionProp = document.createElement("div");
    infoPositionProp.classList.add("prop");
    infoPositionProp.textContent = "Position";
    infoPositionTitle.appendChild(infoPositionProp);

    const infoPositionValue = document.createElement("div");
    infoPositionValue.classList.add("value");
    infoPositionValue.textContent = this.data.positionTitle;
    infoPositionTitle.appendChild(infoPositionValue);

    const infoSchedule = document.createElement("div");
    infoSchedule.classList.add("info-group");
    this.modalContentBodySectionDetails.appendChild(infoSchedule);

    const infoScheduleProp = document.createElement("div");
    infoScheduleProp.classList.add("prop");
    infoScheduleProp.textContent = "Schedule";
    infoSchedule.appendChild(infoScheduleProp);

    const infoScheduleValue = document.createElement("div");
    infoScheduleValue.classList.add("value");
    infoSchedule.appendChild(infoScheduleValue);

    const parsedDate = this.data.shiftDate.toDate().toDateString();
    const infoScheduleValueDate = document.createElement("div");
    infoScheduleValueDate.textContent = parsedDate;
    infoScheduleValue.appendChild(infoScheduleValueDate);

    const time = {
      from: extractTime(this.data.time.from),
      to: extractTime(this.data.time.to),
    };

    const infoScheduleValueRange = document.createElement("div");
    infoScheduleValueRange.textContent = `${time.from} - ${time.to}`;
    infoScheduleValue.appendChild(infoScheduleValueRange);

    const infoLocation = document.createElement("div");
    infoLocation.classList.add("info-group");
    this.modalContentBodySectionDetails.appendChild(infoLocation);

    const infoLocationProp = document.createElement("div");
    infoLocationProp.classList.add("prop");
    infoLocationProp.textContent = "Address";
    infoLocation.appendChild(infoLocationProp);

    const infoLocationValue = document.createElement("div");
    infoLocationValue.classList.add("value");
    infoLocationValue.textContent = ` ${this.data.address}, ${this.data.city}, ${this.data.province}, ${this.data.postalCode}`;
    infoLocation.appendChild(infoLocationValue);

    const infoDescription = document.createElement("div");
    infoDescription.classList.add("info-group");
    this.modalContentBodySectionDetails.appendChild(infoDescription);

    const infoDescriptionProp = document.createElement("div");
    infoDescriptionProp.classList.add("prop");
    infoDescriptionProp.textContent = "Description";
    infoDescription.appendChild(infoDescriptionProp);

    const infoDescriptionValue = document.createElement("div");
    infoDescriptionValue.classList.add("value");
    infoDescriptionValue.textContent = this.data.description;
    infoDescription.appendChild(infoDescriptionValue);
  }

  initBodySectionRating() {
    this.modalContentBodySectionRating = document.createElement("section");
    this.modalContentBodySectionRating.classList.add("rating");
    this.modalContentBodySectionRating.classList.add("hidden");
    this.modalContentBodySectionRating.textContent = "No Rating Yet.";
    this.modalContentBody.appendChild(this.modalContentBodySectionRating);
  }

  initContentNavListeners() {
    this.modalContentBodyNavListDetailsLink.addEventListener("click", () => {
      this.modalContentBodyNavListDetails.classList.add("active");
      this.modalContentBodyNavListRating.classList.remove("active");
      this.modalContentBodySectionRating.classList.add("hidden");
      this.modalContentBodySectionDetails.classList.remove("hidden");
    });

    this.modalContentBodyNavListRatingLink.addEventListener("click", () => {
      this.modalContentBodyNavListDetails.classList.remove("active");
      this.modalContentBodyNavListRating.classList.add("active");
      this.modalContentBodySectionRating.classList.remove("hidden");
      this.modalContentBodySectionDetails.classList.add("hidden");
    });
  }

  initMeta() {
    const auth = getAuth();
    this.modalContentMeta = document.createElement("div");
    this.modalContentMeta.classList.add("modal-meta");
    this.modalContent.appendChild(this.modalContentMeta);

    this.modalContentMetaButtonApply = document.createElement("button");
    this.modalContentMetaButtonApply.classList.add("primary-button");
    this.modalContentMetaButtonApply.textContent = "Apply for this job!";
    this.modalContentMetaButtonApply.addEventListener(
      "click",
      this.handleApplyButton.bind(this)
    );

    this.modalContentMetaButtonCancel = document.createElement("button");
    this.modalContentMetaButtonCancel.classList.add("secondary-button");
    this.modalContentMetaButtonCancel.textContent = "Cancel Application";
    this.modalContentMetaButtonCancel.addEventListener(
      "click",
      this.handleCancelApplication.bind(this)
    );

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;

        //Prevent Employers to Apply.
        this.userDetail = await getUserDetails(user.uid);

        if (this.userDetail.typeOfUser === "employer") return;

        const jobId = this.data.id;

        this.applicationId = await isAlreadyApplied(jobId, user.uid);

        if (this.applicationId === false) {
          this.modalContentMeta.appendChild(this.modalContentMetaButtonApply);
        } else {
          this.modalContentMeta.appendChild(this.modalContentMetaButtonCancel);
        }
      }
    });
  }

  handleApplyButton() {
    const confirm = new ConfirmModal();
    confirm.addContainerClass("job-posting-detail-confirm-modal");
    confirm.modalContent.innerHTML = `
        You are about to apply for this shift. 
        Please confirm the application. Please, check our <a href="javascript:void(0)">terms and conditions</a>.
      `;
    confirm.open();

    confirm.handleConfirm = async () => {
      const application = {
        userId: this.userId,
        jobPostingId: this.data.id,
        status: "pending",
        userDisplayName: this.userDetail.displayName,
      };

      try {
        this.applicationId = await addApplicant(application).catch((err) => {
          console.log(err);
        });

        this.modalContentMeta.innerHTML = "";
        this.modalContentMeta.appendChild(this.modalContentMetaButtonCancel);

        confirm.close();
      } catch (error) {
        console.log(error);
      }
    };
  }

  handleCancelApplication() {
    const confirm = new ConfirmModal();
    confirm.addContainerClass("job-posting-detail-confirm-modal");
    confirm.modalContent.innerHTML = ` Are you sure you want to cancel your application? ${this.applicationId}`;
    confirm.open();

    confirm.handleConfirm = () => {
      deleteApplicationRecord(this.applicationId).catch((err) => {
        console.log(err);
      });

      this.applicationId = null;
      this.modalContentMeta.innerHTML = "";
      this.modalContentMeta.appendChild(this.modalContentMetaButtonApply);

      confirm.close();
    };
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
