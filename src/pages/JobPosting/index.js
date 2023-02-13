import AuthenticatedPage from "../../classes/AuthenticatedPage";
import { readURL } from "../../js/utils";
import { uploadFile } from "../../js/upload-files/upload-image";
import { setJobPosting } from "../../js/job-posting/job-posting";
import Template from "./posting.html";
import "./job-posting.scss";
import { pageTransition } from "../../router";
class JobPosting extends AuthenticatedPage {
  constructor() {
    super("Job Posting");
    this.image = null;
  }

  async load() {
    return Template;
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
        userId: this.currentUser.uid,
      };

      try {
        jobPosting.bannerImageUrl = await uploadFile(this.image, "jobPostings");
        const id = await setJobPosting(jobPosting);

        if (id) {
          pageTransition(`/job-posting/draft/${id}`);
        }
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
