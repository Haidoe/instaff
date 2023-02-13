import AuthenticatedPage from "../../classes/AuthenticatedPage";
import { getJobPostingDetail } from "../../js/job-posting/job-posting";
import { formatDate, readURL } from "../../js/utils";
import Template from "./draft.html";
import "./job-posting.scss";

class DraftJobPosting extends AuthenticatedPage {
  constructor({ id }) {
    super("Draft Job Posting");
    this.id = id;
  }

  async load() {
    return Template;
  }

  init() {
    const bannerImg = document.querySelector("#bannerImg");
    const positionTitle = document.getElementById("positionTitle");
    const shiftDate = document.getElementById("shiftDate");
    const fromTime = document.getElementById("fromTime");
    const toTime = document.getElementById("toTime");
    const wage = document.getElementById("wage");
    const positionAvailable = document.getElementById("positionAvailable");
    const description = document.getElementById("description");
    const additionalInfo = document.getElementById("additionalInfo");
    const companyName = document.getElementById("companyName");
    const city = document.getElementById("city");
    const address = document.getElementById("address");
    const parsedDate = this.data.shiftDate.toDate().toDateString();

    bannerImg.src = this.data.bannerImageUrl;
    bannerImg.classList.add("visible");
    companyName.value = this.data.companyName;
    positionTitle.value = this.data.positionTitle;
    shiftDate.value = formatDate(parsedDate);
    fromTime.value = this.data.time.from;
    toTime.value = this.data.time.to;
    wage.value = this.data.wageRate;
    positionAvailable.value = this.data.positionAvailable;
    description.value = this.data.description;
    additionalInfo.value = this.data.additionalInfo;
    city.value = this.data.city;
    address.value = this.data.address;
  }

  async mounted() {
    const detailsForm = document.querySelector("#detailsForm");
    const noresult = document.querySelector(".no-result");
    const loading = document.querySelector(".loading");

    const response = await getJobPostingDetail(this.id);
    if (response) {
      this.data = response;
      this.init();
      detailsForm.classList.add("visible");
    } else {
      noresult.classList.add("visible");
    }

    loading.classList.add("hide");

    detailsForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const jobPostingUpdate = {
        id: this.data.id,
        status: "published",
      };

      console.log(jobPostingUpdate);
    });
  }
}

export default DraftJobPosting;
