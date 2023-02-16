import EmployerPage from "../../../classes/EmployerPage";
import { getJobPostingDetail } from "../../../js/job-posting/job-posting";
import { extractTime, formatDate } from "../../../js/utils";
import Template from "./detail.html";
import "../job-posting.scss";

class JobPosting extends EmployerPage {
  constructor({ id }) {
    super("Job Posting");
    this.id = id;
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
    const hoursOfShift = document.getElementById("hoursOfShift");
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
    fromTime.value = extractTime(this.data.time.from);
    wage.value = this.data.wageRate;
    positionAvailable.value = this.data.positionAvailable;
    description.value = this.data.description;
    additionalInfo.value = this.data.additionalInfo;
    city.value = this.data.city;
    address.value = this.data.address;
    hoursOfShift.value = this.data.hoursOfShift;

    this.initMap(this.data.coordinates);
  }

  initMap(coordinates) {
    let defaultZoom = 16;

    const map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "job-posting-map",
      center: coordinates,
      zoom: defaultZoom,
    });

    const marker = new tt.Marker().setLngLat(coordinates).addTo(map);
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
