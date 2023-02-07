import AuthenticatedPage from "../../classes/AuthenticatedPage";
import { readURL } from "../../js/utils";
import { uploadFile } from "../../js/upload-files/upload-image";
import { setJobPosting } from "../../js/job-posting/job-posting";

import "./job-posting.scss";
import { pageTransition } from "../../router";
class JobPosting extends AuthenticatedPage {
  constructor() {
    super("Job Posting");
    this.image = null;
  }

  async load() {
    return `
      <div class="job-posting-page">
        <h2> Job Posting </h2>

        <form action="#" id="jobPostingForm">
          <div class="form-group">
            <label for="postingBanner">Upload Image</label>
            <input required type="file" id="postingBanner">
            <img src="" alt="banner image" class="formImg" id="bannerImg" />
          </div>
          
          <div class="form-group">
            <label for="companyName">
              Company Name
            </label>
        
            <input required type="text" id="companyName">
          </div>
        
          <div class="form-group">
            <label for="positionTitle">Position Title</label>
            <input required type="text" id="positionTitle">
          </div>
        
          <div class="form-group">
            <label for="shiftDate">Shift Date</label>
            <input required type="date" id="shiftDate">
          </div>
        
          <div class="form-group">
            <label for="fromTime">
              Time:
            </label>
            <input required type="text" id="fromTime">
            <span>to</span>
            <input required type="text" id="toTime">
          </div>
        
          <div class="form-group">
            <label for="wage">Wage ($)</label>
            <input required type="number" id="wage">
          </div>
        
          <div class="form-group">
            <label for="positionAvailable">Position Available</label>
            <input required type="number" id="positionAvailable">
          </div>
        
          <div class="form-group">
            <label for="description">
              Description
            </label>
        
            <textarea required id="description"></textarea>
          </div>
        
          <div class="form-group">
            <label for="additionalInfo">
              Additional Information
            </label>
        
            <textarea required id="additionalInfo"></textarea>
          </div>
        
          <div class="form-group">
            <label for="city">
              City
            </label>
        
            <input required type="text" id="city">
          </div>
        
          <div class="form-group">
            <label for="address">Address</label>
            <input required type="text" id="address">
          </div>
        
          <button type="submit" id="submitBtn">Submit</button>
        </form>
      </div>
    `;
  }

  async mounted() {
    const form = document.querySelector("#jobPostingForm");
    const postingBanner = document.querySelector("#postingBanner");
    const bannerImg = document.querySelector("#bannerImg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      submitBtn.innerHTML = "Loading...";

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

      const jobPosting = {
        companyName: companyName.value,
        positionTitle: positionTitle.value,
        shiftDate: new Date(shiftDate.value),
        time: {
          from: fromTime.value,
          to: toTime.value,
        },
        wageRate: Number(wage.value),
        positionAvailable: Number(positionAvailable.value),
        description: description.value,
        additionalInfo: additionalInfo.value,
        city: city.value,
        address: address.value,
      };

      try {
        jobPosting.bannerImageUrl = await uploadFile(this.image, "jobPostings");
        await setJobPosting(jobPosting);
        form.reset();
        companyName.focus();
        bannerImg.classList.remove("visible");
      } catch (error) {
        console.log("ERROR", error);
      } finally {
        submitBtn.innerHTML = "Submit";
      }
    });

    postingBanner.addEventListener("change", async (e) => {
      e.preventDefault();
      this.image = e.target.files[0];

      if (this.image) {
        const imgUrl = await readURL(this.image);
        bannerImg.src = imgUrl;
        bannerImg.classList.add("visible");
      } else {
        bannerImg.classList.remove("visible");
      }
    });
  }
}

export default JobPosting;
