import EmployerPage from "../../classes/EmployerPage";
import template from "./template.html";
import "./job-post.scss";
import { readURL } from "../../js/utils";
import {
  convertCoordinatesToAddress,
  convertAddressToCoordinates,
} from "../../js/map-util";
import { uploadFile } from "../../js/upload-files/upload-image";

class JobPosting extends EmployerPage {
  constructor() {
    super("Job Posting");
    //Banner related variables
    this.image = null;

    //Map related variables
    this.map = null;
    this.marker = null;
    //This will get the coordinates of the address - on input change
    this.coordinates = null;

    //Form related variables
    this.jobPosting = {};
  }

  async load() {
    return template;
  }

  initMap() {
    const defaultCenter = {
      lat: 49.23512376137244,
      lng: -123.03851521512506,
    };

    let defaultZoom = 15;

    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "job-post-map",
      center: defaultCenter,
      zoom: defaultZoom,
    });

    this.marker = new tt.Marker().setLngLat(defaultCenter).addTo(this.map);

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.coordinates = pos;

        this.map.easeTo({ center: pos });
        this.marker.setLngLat(pos).addTo(this.map);

        // convertCoordinatesToAddress
        const response = await convertCoordinatesToAddress(pos.lat, pos.lng);

        if (response.municipality) {
          document.querySelector("#city").value = response.municipality;
        }

        if (response.streetNameAndNumber) {
          document.querySelector("#address").value =
            response.streetNameAndNumber;
        }

        if (response.extendedPostalCode) {
          document.querySelector("#postalCode").value =
            response.extendedPostalCode;
        }
      } catch (error) {
        console.log(error);
        console.log("Unable to do autocomplete.");
      }
    });
  }

  imageListener() {
    const imageContainer = document.querySelector(".banner-field");
    const postingBanner = document.querySelector("#postingBanner");
    const postingBannerInfo = document.querySelector(".banner-field .info");

    postingBanner.addEventListener("change", async (e) => {
      e.preventDefault();
      this.image = e.target.files[0];

      if (this.image) {
        const imgUrl = await readURL(this.image);
        imageContainer.style.backgroundImage = `url(${imgUrl})`;
        postingBannerInfo.style.display = "none";
      } else {
        postingBannerInfo.style.display = "unset";
        imageContainer.style.backgroundImage = "none";
      }
    });
  }

  formListener() {
    const partition1 = document.querySelector(".partition-1");
    const partition2 = document.querySelector(".partition-2");
    const partition3 = document.querySelector(".partition-3");

    const form1 = document.querySelector("#form1");
    const form2 = document.querySelector("#form2");
    const form3 = document.querySelector("#form3");

    const back1 = document.querySelector(".partition-2 .back-btn");
    const back2 = document.querySelector(".partition-3 .back-btn");

    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form1);

      const data = Object.fromEntries(formData.entries());

      this.jobPosting = {
        ...this.jobPosting,
        ...data,
      };

      partition1.style.display = "none";
      partition2.style.display = "block";
    });

    form2.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form2);

      const data = Object.fromEntries(formData.entries());

      this.jobPosting = {
        ...this.jobPosting,
        ...data,
      };

      partition2.style.display = "none";
      partition3.style.display = "block";
    });

    form3.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form3);

      const data = Object.fromEntries(formData.entries());

      this.jobPosting = {
        ...this.jobPosting,
        ...data,
      };

      console.log("SUBMIT!!", this.jobPosting);
    });

    back1.addEventListener("click", (e) => {
      e.preventDefault();
      partition1.style.display = "block";
      partition2.style.display = "none";
    });

    back2.addEventListener("click", (e) => {
      e.preventDefault();
      partition2.style.display = "block";
      partition3.style.display = "none";
    });
  }

  addressListener() {
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

  async handleSubmit() {
    // const from = new Date(`${shiftDate.value} ${fromTime.value}`);
    // const to = new Date(`${shiftDate.value} ${fromTime.value}`);
    // to.setHours(to.getHours() + Number(hoursOfShift.value));

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

    if (this.coordinates) {
      jobPosting.coordinates = this.coordinates;
    }

    // jobPosting.bannerImageUrl = await uploadFile(this.image, "jobPostings");

    // const id = await setJobPosting(jobPosting);

    // if (id) {
    //   pageTransition(`/post/draft/${id}`);
    // }
  }

  mounted() {
    this.initMap();
    this.imageListener();
    this.formListener();
    this.addressListener();
  }
}

export default JobPosting;
