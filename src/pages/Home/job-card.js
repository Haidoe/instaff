import Modal from "../../components/modal/job-posting-detail";
class JobCard {
  constructor(job) {
    this.job = job;
  }

  toElement() {
    const jobCard = document.createElement("a");
    jobCard.href = "javascript:void(0)";
    jobCard.classList.add("job-card");

    jobCard.addEventListener("click", () => {
      const modal = new Modal(this.job);
      modal.open();
    });

    const jobCardThumbnail = document.createElement("div");
    jobCardThumbnail.classList.add("job-card__thumbnail");
    jobCard.appendChild(jobCardThumbnail);

    const jobCardThumbnailImage = document.createElement("img");
    jobCardThumbnailImage.src = this.job.bannerImageUrl;
    jobCardThumbnailImage.alt = this.job.companyName;
    jobCardThumbnail.appendChild(jobCardThumbnailImage);

    const jobCardTitle = document.createElement("div");
    jobCardTitle.classList.add("job-card__title");
    jobCardTitle.innerText = this.job.positionTitle;
    jobCard.appendChild(jobCardTitle);

    const jobCardWage = document.createElement("div");
    jobCardWage.classList.add("job-card__wage");
    jobCardWage.innerText = `$${this.job.wageRate.toFixed(2)}`;
    jobCard.appendChild(jobCardWage);

    const jobCardCompanyName = document.createElement("div");
    jobCardCompanyName.classList.add("job-card__company-name");
    jobCardCompanyName.innerText = this.job.companyName;
    jobCard.appendChild(jobCardCompanyName);

    const jobCardLocation = document.createElement("div");
    jobCardLocation.classList.add("job-card__location");
    jobCardLocation.innerText = `${this.job.city}, ${this.job.province}`;
    jobCard.appendChild(jobCardLocation);

    return jobCard;
  }
}

export default JobCard;
