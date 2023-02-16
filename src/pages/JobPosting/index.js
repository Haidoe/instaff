import { readURL } from "../../js/utils";
import { uploadFile } from "../../js/upload-files/upload-image";
import { setJobPosting } from "../../js/job-posting/job-posting";
import Template from "./posting.html";
import "./job-posting.scss";
import { pageTransition } from "../../router";
import {
  convertAddressToCoordinates,
  convertCoordinatesToAddress,
} from "../../js/map-util";
import EmployerPage from "../../classes/EmployerPage";
class JobPosting extends EmployerPage {
  constructor() {
    super("Job Posting");
    this.image = null;
    this.map = null;
    this.marker = null;
    //This will get the coordinates of the address - on input change
    this.coordinates = null;
  }

  async load() {
    return Template;
  }

  initMap() {
    const defaultCenter = {
      lat: 49.23512376137244,
      lng: -123.03851521512506,
    };

    let defaultZoom = 15;

    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "job-posting-map",
      center: defaultCenter,
      zoom: defaultZoom,
    });

    this.marker = new tt.Marker().setLngLat(defaultCenter).addTo(this.map);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.coordinates = pos;

      this.map.easeTo({ center: pos });
      this.marker.setLngLat(pos).addTo(this.map);

      // convertCoordinatesToAddress
      const response = await convertCoordinatesToAddress(pos.lat, pos.lng);

      console.log(response);

      if (response.municipality) {
        document.querySelector("#city").value = response.municipality;
      }

      if (response.streetNameAndNumber) {
        document.querySelector("#address").value = response.streetNameAndNumber;
      }

      if (response.extendedPostalCode) {
        document.querySelector("#postalCode").value =
          response.extendedPostalCode;
      }
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    submitBtn.innerHTML = "Loading...";

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

    //Automating Time
    const from = new Date(`${shiftDate.value} ${fromTime.value}`);
    const to = new Date(`${shiftDate.value} ${fromTime.value}`);
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
      if (this.coordinates) {
        jobPosting.coordinates = this.coordinates;
      }

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
  }

  async mounted() {
    const form = document.querySelector("#jobPostingForm");
    const postingBanner = document.querySelector("#postingBanner");
    const bannerImg = document.querySelector("#bannerImg");

    form.addEventListener("submit", this.handleFormSubmit.bind(this));

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

    this.initMap();

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
}

export default JobPosting;
