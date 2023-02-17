import AuthenticatedPage from "../../../classes/AuthenticatedPage";
import {
  getJobPostingDetail,
  updateJobPosting,
} from "../../../js/job-posting/job-posting";
import { formatDate, readURL } from "../../../js/utils";
import { uploadFile } from "../../../js/upload-files/upload-image";
import Template from "./edit.html";
import "../job-posting.scss";
import { pageTransition } from "../../../router";

class EditJobPosting extends AuthenticatedPage {
  constructor({ id }) {
    super("Edit | Job Posting");
    this.id = id;
    this.image = null;
    this.data = null;
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

  handleImage() {
    const postingBanner = document.querySelector("#postingBanner");
    const bannerImg = document.querySelector("#bannerImg");

    postingBanner.addEventListener("change", async (e) => {
      e.preventDefault();
      this.image = e.target.files[0];

      if (this.image) {
        const imgUrl = await readURL(this.image);
        bannerImg.src = imgUrl;
      } else {
        bannerImg.src = this.data.bannerImageUrl;
      }
    });
  }

  handleUpdate() {
    const form = document.querySelector("#detailsForm");

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

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

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
        if (this.image) {
          const imageUrl = await uploadFile(this.image);
          jobPosting.bannerImageUrl = imageUrl;
        }

        const response = await updateJobPosting(this.id, jobPosting);

        if (response) {
          pageTransition(`/job-posting/draft/${this.data.id}`);
        }
      } catch (error) {
        console.log("Job Posting Update Error: ", error);
      }
    });
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

    this.handleImage();
    this.handleUpdate();
  }
}

export default EditJobPosting;
