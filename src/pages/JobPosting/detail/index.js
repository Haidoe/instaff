import Page from "../../../classes/Page";
import { getJobPostingDetail } from "../../../js/job-posting/job-posting";
import { formatDate } from "../../../js/utils";
import "../job-posting.scss";

class JobPosting extends Page {
  constructor({ id }) {
    super("Job Posting");
    this.id = id;
    this.data = null;
  }

  async load() {
    return `
      <div class="job-posting-page details-page">
        <h2> [PUBLISHED] Job Posting </h2>

        <div class="loading">
          Loading...
        </div>

        <div class="no-result">
          No details found.
        </div>

        <form action="#" id="detailsForm">
          <div class="form-group">
            <img src="" alt="banner image" class="formImg" id="bannerImg" />
          </div>
          
          <div class="form-group">
            <label for="companyName">
              Company Name
            </label>
        
            <input readonly type="text" id="companyName">
          </div>
        
          <div class="form-group">
            <label for="positionTitle">Position Title</label>
            <input readonly type="text" id="positionTitle">
          </div>
        
          <div class="form-group">
            <label for="shiftDate">Shift Date</label>
            <input readonly type="date" id="shiftDate">
          </div>
        
          <div class="form-group">
            <label for="fromTime">
              Time:
            </label>
            <input readonly type="text" id="fromTime">
            <span>to</span>
            <input readonly type="text" id="toTime">
          </div>
        
          <div class="form-group">
            <label for="wage">Wage ($)</label>
            <input readonly type="number" id="wage">
          </div>
        
          <div class="form-group">
            <label for="positionAvailable">Position Available</label>
            <input readonly type="number" id="positionAvailable">
          </div>
        
          <div class="form-group">
            <label for="description">
              Description
            </label>
        
            <textarea readonly id="description"></textarea>
          </div>
        
          <div class="form-group">
            <label for="additionalInfo">
              Additional Information
            </label>
        
            <textarea readonly id="additionalInfo"></textarea>
          </div>
        
          <div class="form-group">
            <label for="city">
              City
            </label>
        
            <input readonly type="text" id="city">
          </div>
        
          <div class="form-group">
            <label for="address">Address</label>
            <input readonly type="text" id="address">
          </div>
        </form>
      </div>
    `;
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
    window.scrollTo(0, 0);

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
  }
}

export default JobPosting;
