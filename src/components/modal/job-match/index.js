import Modal from "../index";
import JobPostingModal from "../job-posting-detail";
import "./job-match.scss";

class JobMatch extends Modal {
  constructor(jobItems) {
    super(null);

    this.jobItems = jobItems;
    // console.log(this.jobItems);

    this.modal.classList.add("job-match-modal");

    this.modalClose.remove();
    this.hideMeta();

    this.modalContent.innerHTML = "";

    this.initCloseButton();
    this.initOpenButton();

    const title = document.createElement("h2");
    title.textContent = "Suggested jobs for you this week";
    this.modalContent.appendChild(title);

    this.initJobList();
  }

  initOpenButton() {
    this.openButton = document.createElement("button");
    this.openButton.className = "open-button";

    const openButtonImg = document.createElement("img");
    openButtonImg.src = "./static/icons/arrow-up-gradient.svg";
    openButtonImg.alt = "Open Job Match";
    this.openButton.appendChild(openButtonImg);

    this.openButton.addEventListener("click", () => {
      this.openButton.classList.remove("open");
      // this.modalContainer.classList.remove("close");
      this.modal.classList.remove("close");
    });

    this.modal.appendChild(this.openButton);
  }

  initCloseButton() {
    this.closeButton = document.createElement("button");
    this.closeButton.className = "close-button";

    const img = document.createElement("img");
    img.src = "./static/icons/arrow-down-gradient.svg";
    img.alt = "Close Job Match";
    this.closeButton.appendChild(img);

    this.closeButton.addEventListener("click", () => {
      this.modal.classList.add("close");
      this.openButton.classList.add("open");
    });

    this.modalContent.appendChild(this.closeButton);
  }

  initJobList() {
    const jobList = document.createElement("ul");
    jobList.className = "job-list";
    this.modalContent.appendChild(jobList);

    this.jobItems.forEach((item) => {
      const jobListItem = document.createElement("li");
      jobListItem.className = "job-list-item";

      jobListItem.addEventListener("click", () => {
        const modal = new JobPostingModal(item);
        modal.open();
      });

      const jobListItemImg = document.createElement("img");
      jobListItemImg.src = item.bannerImageUrl;
      jobListItemImg.alt = "Job";
      jobListItem.appendChild(jobListItemImg);

      const jobListItemTitle = document.createElement("h3");
      jobListItemTitle.textContent = item.positionTitle;
      jobListItem.appendChild(jobListItemTitle);

      const jobListItemWage = document.createElement("p");
      jobListItemWage.className = "wage";
      jobListItemWage.textContent = `$${item.wageRate.toFixed(2)} / hr`;
      jobListItem.appendChild(jobListItemWage);

      const companyName = document.createElement("p");
      companyName.className = "company-name";
      companyName.textContent = `${item.companyName}`;
      jobListItem.appendChild(companyName);

      const jobListItemLocation = document.createElement("p");
      jobListItemLocation.textContent = `${item.city}, ${item.province}`;
      jobListItem.appendChild(jobListItemLocation);

      jobList.appendChild(jobListItem);
    });
  }
}

export default JobMatch;
