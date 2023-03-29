import EmployerPage from "../../classes/EmployerPage";
import template from "./template.html";
import "./job-post.scss";
import { readURL } from "../../js/utils";
import addJobPosting from "../../js/job-posting/addJobPosting";
import {
  convertCoordinatesToAddress,
  convertAddressToCoordinates,
} from "../../js/map-util";
import Modal from "../../components/modal";
import { uploadFile } from "../../js/upload-files/upload-image";
import { pageTransition } from "../../router";
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

    const customMarker = document.createElement("div");
    customMarker.className = "custom-marker";

    const markerImg = document.createElement("img");
    markerImg.src = "/static/icons/colored-pin.svg";
    customMarker.appendChild(markerImg);

    this.marker = new tt.Marker({
      element: customMarker,
    })
      .setLngLat(defaultCenter)
      .addTo(this.map);

    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      if (this.isClosed) return;

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

    const asideList1 = document.querySelector("#part1");
    const asideList2 = document.querySelector("#part2");
    const asideList3 = document.querySelector("#part3");

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

      asideList2.classList.add("active");
      asideList1.classList.remove("active");
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

      asideList3.classList.add("active");
      asideList2.classList.remove("active");

      this.map.resize();
    });

    form3.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form3);

      const data = Object.fromEntries(formData.entries());

      this.jobPosting = {
        ...this.jobPosting,
        ...data,
      };

      const ConfirmModal = new Modal("Would you like to post this job?");

      ConfirmModal.handleConfirm = () => {
        ConfirmModal.close();
        this.handleSubmit();
      };

      ConfirmModal.open();
    });

    back1.addEventListener("click", (e) => {
      e.preventDefault();
      partition1.style.display = "block";
      partition2.style.display = "none";

      asideList1.classList.add("active");
      asideList2.classList.remove("active");
    });

    back2.addEventListener("click", (e) => {
      e.preventDefault();
      partition2.style.display = "block";
      partition3.style.display = "none";

      asideList2.classList.add("active");
      asideList3.classList.remove("active");
    });
  }

  addressListener() {
    let timer = null;
    const typingInterval = 1500;
    const addressInput = document.getElementById("address");

    addressInput.addEventListener("keyup", async (e) => {
      e.preventDefault();
      clearTimeout(timer);
      timer = setTimeout(this.handleChangeAddress.bind(this), typingInterval);
    });

    addressInput.addEventListener("keydown", (e) => {
      clearTimeout(timer);
    });
  }

  async handleChangeAddress() {
    const city = document.getElementById("city");
    const address = document.getElementById("address");
    const trimCity = city.value.trim();
    const trimAddress = address.value.trim();

    if (trimCity && trimAddress) {
      const query = `${trimAddress}, ${trimCity}, BC, Canada`;
      const position = await convertAddressToCoordinates(query);

      this.coordinates = {
        lat: position.lat,
        lng: position.lon,
      };

      this.map.easeTo({ center: this.coordinates });
      this.marker.setLngLat(this.coordinates).addTo(this.map);
    }
  }

  async handleSubmit() {
    const submitBtn = document.querySelector(".partition-3 .submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";

    const from = new Date(
      `${this.jobPosting.shiftDate} ${this.jobPosting.fromTime}`
    );
    const to = new Date(
      `${this.jobPosting.shiftDate} ${this.jobPosting.fromTime}`
    );

    to.setHours(to.getHours() + Number(this.jobPosting.hoursOfShift));

    const data = {
      companyName: this.jobPosting.companyName,
      positionTitle: this.jobPosting.positionTitle,
      shiftDate: new Date(this.jobPosting.shiftDate),
      time: { from, to },
      wageRate: Number(this.jobPosting.wage),
      positionAvailable: Number(this.jobPosting.positionAvailable),
      description: this.jobPosting.description,
      additionalInfo: this.jobPosting.additionalInfo,
      city: this.jobPosting.city,
      address: this.jobPosting.address,
      userId: this.currentUser.uid,
      postalCode: this.jobPosting.postalCode,
      hoursOfShift: Number(this.jobPosting.hoursOfShift),
      contactNumber: this.jobPosting.contactNumber,
      status: "published",
      paymentType: "Cash",
      province: "British Columbia",
      numOfCandidates: 0,
    };

    if (this.coordinates) {
      data.coordinates = this.coordinates;
    }

    try {
      data.bannerImageUrl = await uploadFile(this.image, "jobPostings");
      const id = await addJobPosting(data);

      if (id) {
        pageTransition(`/dashboard`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Save";
      console.log(data);
    }
  }

  mounted() {
    document.querySelector("body").classList.add("job-post-body");

    //Added Minimum Date for Shift Date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("shiftDate").setAttribute("min", today);

    //Just to make sure Active Menu is set to Dashboard
    const jobPostingMenu = document.querySelector(
      ".main-header a[href='/post']"
    );

    jobPostingMenu.classList.add("active-menu-item");

    this.initMap();
    this.imageListener();
    this.formListener();
    this.addressListener();
  }

  close() {
    this.isClosed = true;
    document.querySelector("body").classList.remove("job-post-body");

    try {
      //Just to make sure Active Menu is set to Dashboard
      const jobPostingMenu = document.querySelector(
        ".main-header a[href='/post']"
      );

      jobPostingMenu.classList.remove("active-menu-item");
    } catch (error) {}
  }
}

export default JobPosting;
