import EmployerPage from "../../../classes/EmployerPage";
import {
  getJobPostingDetail,
  updateJobPosting,
} from "../../../js/job-posting/job-posting";
import { extractTime, formatDate, readURL } from "../../../js/utils";
import { uploadFile } from "../../../js/upload-files/upload-image";
import Template from "./edit.html";
import "../job-posting.scss";
import { pageTransition } from "../../../router";
import { convertAddressToCoordinates } from "../../../js/map-util";

class EditJobPosting extends EmployerPage {
  constructor({ id }) {
    super("Edit | Job Posting");
    this.id = id;
    this.image = null;
    this.data = null;
    // Map related states
    this.map = null;
    this.marker = null;
    this.coordinates = null;
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
    const postalCode = document.getElementById("postalCode");

    bannerImg.src = this.data.bannerImageUrl;
    bannerImg.classList.add("visible");
    companyName.value = this.data.companyName;
    positionTitle.value = this.data.positionTitle;
    shiftDate.value = formatDate(parsedDate);
    fromTime.value = extractTime(this.data.time.from);
    hoursOfShift.value = this.data.hoursOfShift;
    wage.value = this.data.wageRate;
    positionAvailable.value = this.data.positionAvailable;
    description.value = this.data.description;
    additionalInfo.value = this.data.additionalInfo;
    city.value = this.data.city;
    address.value = this.data.address;
    postalCode.value = this.data.postalCode;
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
    const hoursOfShift = document.getElementById("hoursOfShift");
    const wage = document.getElementById("wage");
    const positionAvailable = document.getElementById("positionAvailable");
    const description = document.getElementById("description");
    const additionalInfo = document.getElementById("additionalInfo");
    const companyName = document.getElementById("companyName");
    const city = document.getElementById("city");
    const address = document.getElementById("address");
    const postalCode = document.getElementById("postalCode");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      //Automating Time
      const from = new Date(`${shiftDate.value} ${fromTime.value}`);
      const to = new Date(`${shiftDate.value} ${fromTime.value}`);
      console.log(fromTime.value);
      to.setHours(to.getHours() + Number(hoursOfShift.value));

      const jobPosting = {
        companyName: companyName.value,
        positionTitle: positionTitle.value,
        shiftDate: new Date(shiftDate.value),
        time: { from, to },
        wageRate: Number(wage.value),
        positionAvailable: Number(positionAvailable.value),
        description: description.value,
        additionalInfo: additionalInfo.value,
        city: city.value,
        address: address.value,
        userId: this.currentUser.uid,
        postalCode: postalCode.value,
        hoursOfShift: Number(hoursOfShift.value),
      };

      try {
        if (this.image) {
          const imageUrl = await uploadFile(this.image);
          jobPosting.bannerImageUrl = imageUrl;
        }

        if (this.coordinates) {
          jobPosting.coordinates = this.coordinates;
        }

        const response = await updateJobPosting(this.id, jobPosting);

        if (response) {
          pageTransition(`/post/draft/${this.data.id}`);
        }
      } catch (error) {
        console.log("Job Posting Update Error: ", error);
      }
    });
  }

  handleCancelBtn() {
    const cancelBtn = document.querySelector("#cancel-job-posting-summary");

    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pageTransition(`/post/draft/${this.data.id}`);
    });
  }

  initMap(coordinates) {
    let defaultZoom = 16;

    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "job-posting-map",
      center: coordinates,
      zoom: defaultZoom,
    });

    this.marker = new tt.Marker().setLngLat(coordinates).addTo(this.map);
  }

  handleAddressUpdateListener() {
    document
      .getElementById("address")
      .addEventListener("focusout", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city");
        const address = document.getElementById("address");

        const trimCity = city.value.trim();
        const trimAddress = address.value.trim();

        if (trimCity && trimAddress) {
          const query = `${trimAddress}, ${trimCity}, BC, Canada`;
          const position = await convertAddressToCoordinates(query);
          this.coordinates = position;

          this.map.easeTo({ center: position });
          this.marker.setLngLat(position).addTo(this.map);
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
      this.initMap(this.data.coordinates);
      detailsForm.classList.add("visible");
    } else {
      noresult.classList.add("visible");
    }

    loading.classList.add("hide");

    this.handleImage();
    this.handleUpdate();
    this.handleCancelBtn();
    this.handleAddressUpdateListener();
  }
}

export default EditJobPosting;
