import EmployerPage from "../../classes/EmployerPage";
import template from "./template.html";
import "./job-post.scss";
import { readURL } from "../../js/utils";

class JobPosting extends EmployerPage {
  constructor() {
    super("Job Posting");
    this.image = null;

    //Map related variables
    this.map = null;
    this.marker = null;
    //This will get the coordinates of the address - on input change
    this.coordinates = null;
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

      console.log(this.image);

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

  mounted() {
    this.initMap();
    this.imageListener();
  }
}

export default JobPosting;
