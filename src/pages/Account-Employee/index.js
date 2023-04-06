import template from "./account-employee.html";
import EmployeePage from "../../classes/EmployeePage";
import {
  setProfileInfo,
  getProfile,
  getTypeOfWorkByUserId,
  updatetypeOfWork,
  setTypeOfWorkInfo,
  getAvailabilityByUserId,
  updateAvailability,
  setAvailability,
  getLengthOfShiftByUserId,
  setLengthOfShift,
  updatelengthOfShift,
} from "../../js/account-setting/account";
import { uploadFile } from "../../js/upload-files/upload-image";
import { formatDate, readURL } from "../../js/utils";
import pubsub from "../../classes/PubSub";
import "./account-employee.scss";
import {
  convertCoordinatesToAddress,
  convertAddressToCoordinates,
} from "../../js/map-util";

import globalState from "../../classes/GlobalState";

class AccountEmployee extends EmployeePage {
  constructor() {
    super("Profile");
    this.profileImageToUpload = null;
    this.uploadProfURL = null;
    this.image = null;
    this.map = null;
    this.marker = null;
    this.coordinates = null;
    this.state = null;
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
      container: "profile-map",
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

    this.geoAPI = navigator.geolocation.watchPosition(async (position) => {
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
  async init() {
    const postingProfileImage = document.getElementById("postingProfileImage");
    const profileImage = document.querySelector("#profileImage");
    const bannerImage = document.querySelector(".banner-image");
    const displayName = document.querySelector("#displayName");
    const dateOfBirth = document.querySelector("#dateOfBirth");
    const profileName = document.querySelector(".profile-name");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const contactNumber = document.getElementById("contactNumber");
    const postalCode = document.getElementById("postalCode");
    const emailAddress = document.getElementById("emailAddress");
    const viewProof = document.getElementById("viewProof");
    const uploadedDate = document.getElementById("uploadedDate");

    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      document.getElementById("lblProfileImage").innerHTML =
        "Change profile photo";
      profileImage.children[3].style.display = "None";
      profileImage.style.backgroundImage = `url("${this.data.imageURL}")`;
      bannerImage.style.backgroundImage = `url("${this.data.imageURL}")`;
      postingProfileImage.removeAttribute("required");
    } else {
      //profileImage.src = "../../static/images/sample.jpg";
      profileImage.children[3].style.display = "None";
      profileImage.style.backgroundImage = `url(../../static/images/anonymous.svg)`;
      bannerImage.style.backgroundImage = `url(../../static/images/anonymous.svg)`;
    }
    if (
      typeof this.data.uploadProfURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      viewProof.href = this.data.uploadProfURL;
      const newContent = document.createTextNode(
        `${this.data.displayName}-proof-of-work`
      );
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      uploadedDate.innerHTML = this.data.updated
        .toDate()
        .toLocaleDateString("en-CA", options);
      viewProof.appendChild(newContent);
      this.uploadProfURL = this.data.uploadProfURL;
    }
    displayName.value = this.data.displayName;
    profileName.innerHTML = this.data.displayName;
    dateOfBirth.value =
      typeof this.data.dateOfBirth !== "undefined"
        ? formatDate(this.data.dateOfBirth.toDate().toDateString())
        : "";

    address.value =
      typeof this.data.address !== "undefined" ? this.data.address : "";
    city.value = typeof this.data.city !== "undefined" ? this.data.city : "";
    contactNumber.value =
      typeof this.data.contactNumber !== "undefined"
        ? this.data.contactNumber
        : "";
    postalCode.value =
      typeof this.data.postalCode !== "undefined" ? this.data.postalCode : "";
    this.coordinates =
      typeof this.data.coordinates != "undefined"
        ? (this.coordinates = this.data.coordinates)
        : "";
    emailAddress.value =
      typeof this.data.emailAddress !== "undefined"
        ? this.data.emailAddress
        : "";
  }

  async loadTypeOfWorkListingData() {
    let results = await getTypeOfWorkByUserId(this.profileId);
    const checkList = [
      "Helper",
      "Cleaner",
      "Cashier",
      "Custodial",
      "Counter Staff",
      "Dishwasher",
      "Server",
      "Crew",
      "Warehouse Worker",
      "Housekeeper",
      "Laundry Attendant",
      "Clerk",
      "Fast food worker",
    ];

    checkList.forEach((item) => {
      let findItem = undefined;

      if (results.length > 0) {
        if (results[0].positionTitle !== undefined) {
          findItem = results[0].positionTitle.find(
            (e) => e.toLowerCase() == item.toLowerCase()
          );
        }
      }
      const checkboxContainer = document.createElement("label");
      checkboxContainer.className = "checkbox-container";
      checkboxContainer.innerHTML = item;
      const inputCheckbox = document.createElement("input");
      inputCheckbox.type = "checkbox";
      inputCheckbox.id = item.toLowerCase();
      inputCheckbox.name = "workType";
      inputCheckbox.value = item;
      inputCheckbox.checked = findItem != undefined ? true : false;

      const labelCheckboxFor = document.createElement("span");
      labelCheckboxFor.className = "checkmark";
      checkboxContainer.appendChild(inputCheckbox);
      checkboxContainer.appendChild(labelCheckboxFor);
      const typeOfWorkContainer = document.querySelector(
        ".form-group-typeOfWork"
      );
      typeOfWorkContainer.appendChild(checkboxContainer);
    });
  }
  async loadAvailabilityListingData() {
    let results = await getAvailabilityByUserId(this.profileId);
    const checkList = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    checkList.forEach((item) => {
      let findItem = undefined;

      if (results.length > 0) {
        if (results[0].days !== undefined) {
          findItem = results[0].days.find(
            (e) => e.toLowerCase() == item.toLowerCase()
          );
        }
      }
      const checkboxContainer = document.createElement("label");
      checkboxContainer.className = "checkbox-container";
      checkboxContainer.innerHTML = item;
      const inputCheckbox = document.createElement("input");
      inputCheckbox.type = "checkbox";
      inputCheckbox.id = item.toLowerCase();
      inputCheckbox.name = "availability";
      inputCheckbox.value = item;
      inputCheckbox.checked = findItem != undefined ? true : false;

      const labelCheckboxFor = document.createElement("span");
      labelCheckboxFor.className = "checkmark";
      checkboxContainer.appendChild(inputCheckbox);
      checkboxContainer.appendChild(labelCheckboxFor);

      const availabilityContainer = document.querySelector(
        ".form-group-availability"
      );
      availabilityContainer.appendChild(checkboxContainer);
    });
  }

  async loadLengthOfShiftListingData() {
    const checkList = [];

    for (let i = 0; i < 5; i++) {
      checkList.push({
        ctrlId: "checkbox_timeslot_" + i,
      });
    }
    let results = await getLengthOfShiftByUserId(this.profileId);
    checkList.forEach((item) => {
      let findItem = undefined;
      let idx = checkList.indexOf(item);

      if (results.length) {
        if (results[0].time != undefined && results[0].time.length > idx) {
          findItem = results[0].time[idx];
        }
      }
      const lengthOfShiftFormWrapper = document.querySelector(
        ".form-wrapper-lengthOfShift"
      );

      const lengthOfShiftContainer = document.createElement("div");
      lengthOfShiftContainer.className = "form-group-lengthOfShift";
      const containerShift = document.createElement("div");
      containerShift.innerHTML = `Shift ${idx + 1}`;
      lengthOfShiftContainer.appendChild(containerShift);
      // lengthOfShiftFormWrapper.appendChild(lengthOfShiftContainer);
      const containerFromTime = document.createElement("div");
      const inputFromTime = document.createElement("input");
      inputFromTime.type = "time";
      inputFromTime.id = `fromTime_${idx}`;
      inputFromTime.name = `fromTime_${idx}`;
      inputFromTime.value = `${findItem != undefined ? findItem.from : ""}`;
      containerFromTime.appendChild(inputFromTime);
      lengthOfShiftContainer.appendChild(containerFromTime);
      lengthOfShiftFormWrapper.appendChild(lengthOfShiftContainer);

      const containerToTime = document.createElement("div");
      const inputToTime = document.createElement("input");
      inputToTime.type = "time";
      inputToTime.id = `toTime_${idx}`;
      inputToTime.value = `${findItem != undefined ? findItem.to : ""}`;
      containerToTime.appendChild(inputToTime);
      lengthOfShiftContainer.appendChild(containerToTime);
      lengthOfShiftFormWrapper.appendChild(lengthOfShiftContainer);
    });
  }

  popStateListener(e) {
    const mainPageContainer = document.querySelector(".account-employee-page");

    if (mainPageContainer.classList.contains("profile-page-mobile")) {
      mainPageContainer.classList.remove("profile-page-mobile");
      pubsub.publish("mainHeaderHideBackBtn");
    }

    if (mainPageContainer.classList.contains("preference-page-mobile")) {
      mainPageContainer.classList.remove("preference-page-mobile");
      pubsub.publish("mainHeaderHideBackBtn");
    }

    if (mainPageContainer.classList.contains("typeofWork-page")) {
      mainPageContainer.classList.remove("typeofWork-page");
      mainPageContainer.classList.add("preference-page-mobile");
      pubsub.publish("mainHeaderShowBackBtn");
    }
    if (mainPageContainer.classList.contains("availability-page")) {
      mainPageContainer.classList.remove("availability-page");
      mainPageContainer.classList.add("preference-page-mobile");
      pubsub.publish("mainHeaderShowBackBtn");
    }
    if (mainPageContainer.classList.contains("lengthOfShift-page")) {
      mainPageContainer.classList.remove("lengthOfShift-page");
      mainPageContainer.classList.add("preference-page-mobile");
      pubsub.publish("mainHeaderShowBackBtn");
    }
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();
    this.loadTypeOfWorkListingData();
    this.loadAvailabilityListingData();
    this.loadLengthOfShiftListingData();

    const profileForm = document.querySelector("#profileForm");
    const profileImage = document.getElementById("profileImage");
    const postingProfileImage = document.getElementById("postingProfileImage");
    const uploadProfURL = document.getElementById("uploadProfURL");
    const profileURL = document.getElementById("profileURL");
    const preferenceURL = document.getElementById("preferenceURL");
    const webPreferenceURL = document.getElementById("webPreferenceURL");
    const webProfileURL = document.getElementById("webProfileURL");
    const typeOfWorkURL = document.getElementById("typeOfWorkURL");
    const availabilityURL = document.getElementById("availabilityURL");
    const lengthOfShiftURL = document.getElementById("lengthOfShiftURL");

    profileForm.addEventListener(
      "submit",
      this.handleProfileFormSubmit.bind(this)
    );

    // Profile image listener===========================
    postingProfileImage.addEventListener(
      "change",
      this.handleProfileImageChange.bind(this)
    );

    // Begin: Profile URL listener===========================
    profileURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("profile-page-mobile");
      mainPageContainer.classList.remove("typeofWork-page-clicked");
      mainPageContainer.classList.remove("preference-page-clicked");
      mainPageContainer.classList.remove("preference-wrapper-clicked");

      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    webProfileURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("profile-page-clicked");
      mainPageContainer.classList.remove("preference-page-clicked");
      mainPageContainer.classList.remove("preference-wrapper-clicked");
      mainPageContainer.classList.remove("preference-page-mobile");
      mainPageContainer.classList.remove("preference-page");
      mainPageContainer.classList.remove("typeofWork-page");
      mainPageContainer.classList.remove("availability-page");
      mainPageContainer.classList.remove("lengthOfShift-page");
      mainPageContainer.classList.remove("lengthOfShift-page-clicked");

      // Set Active Link
      const previousActiveMenu = document.querySelector(".web-menu li.active");
      previousActiveMenu.classList.remove("active");
      e.target.parentElement.classList.add("active");
    });

    // End: Profile URL Listener

    // Preference URL listener===========================
    preferenceURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("preference-page-mobile");
      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    // Web =======================
    webPreferenceURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("preference-wrapper-clicked");
      mainPageContainer.classList.add("preference-page-clicked");
      mainPageContainer.classList.remove("profile-page-clicked");
      mainPageContainer.classList.remove("profile-page-mobile");

      const previousActiveMenu = document.querySelector(".web-menu li.active");
      previousActiveMenu.classList.remove("active");
      e.target.parentElement.classList.add("active");
    });

    // Begin: Type of Work ===========================

    const typeOfWorkForm = document.querySelector("#typeOfWorkForm");
    typeOfWorkForm.addEventListener(
      "submit",
      this.handleTypeOfWorkFormSubmit.bind(this)
    );

    typeOfWorkURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("typeofWork-page"); // Mobile
      mainPageContainer.classList.add("typeofWork-page-clicked"); //Web
      mainPageContainer.classList.remove("availability-page-clicked");
      mainPageContainer.classList.remove("lengthOfShift-page-clicked");

      // Set Active Link
      const previousSideActiveMenu = document.querySelector(
        ".preference-page nav ul li.sideMenu-active"
      );
      previousSideActiveMenu.classList.remove("sideMenu-active");
      e.target.parentElement.parentElement.classList.add("sideMenu-active");
      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    // End: Type of Work ===========================

    // Begin: Availability ==========================
    const availabilityForm = document.querySelector("#availabilityForm");
    availabilityForm.addEventListener(
      "submit",
      this.handleAvailabilityFormSubmit.bind(this)
    );

    availabilityURL.addEventListener("click", (e) => {
      e.preventDefault();
      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("availability-page"); // For Mobile
      mainPageContainer.classList.add("availability-page-clicked"); //For Web
      mainPageContainer.classList.remove("typeofWork-page-clicked");
      mainPageContainer.classList.remove("lengthOfShift-page-clicked");
      mainPageContainer.classList.remove("profile-page-mobile");

      // Set Active Link
      const previousSideActiveMenu = document.querySelector(
        ".preference-page nav ul li.sideMenu-active"
      );
      previousSideActiveMenu.classList.remove("sideMenu-active");
      e.target.parentElement.parentElement.classList.add("sideMenu-active");

      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    // End: Availability ===========================

    // Begin: Length of Shift ==========================
    const lengthOfShiftForm = document.querySelector("#lengthOfShiftForm");
    lengthOfShiftForm.addEventListener(
      "submit",
      this.handleLengthOfShiftFormSubmit.bind(this)
    );
    lengthOfShiftURL.addEventListener("click", (e) => {
      e.preventDefault();
      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("lengthOfShift-page"); // For Mobile
      mainPageContainer.classList.add("lengthOfShift-page-clicked"); // For Web
      mainPageContainer.classList.remove("availability-page-clicked");
      mainPageContainer.classList.remove("typeofWork-page-clicked");
      mainPageContainer.classList.remove("profile-page-mobile");

      // Set Active Link
      const previousSideActiveMenu = document.querySelector(
        ".preference-page nav ul li.sideMenu-active"
      );
      previousSideActiveMenu.classList.remove("sideMenu-active");
      e.target.parentElement.parentElement.classList.add("sideMenu-active");

      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    // End: Length of Shift ===============

    //PubSub for Mobile Related Stuff
    pubsub.subscribe("mainHeaderBackBtnClicked", this.popStateListener);
    window.addEventListener("popstate", this.popStateListener);

    // Begin: Profile Events Listener ===========================
    uploadProfURL.addEventListener(
      "change",
      this.uploadProfURLChange.bind(this)
    );

    this.initMap();
    this.addressListener();
  }

  close() {
    pubsub.unsubscribe("mainHeaderBackBtnClicked", this.popStateListener);
    window.removeEventListener("popstate", this.popStateListener);
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

  async handleProfileFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";
    const displayName = document.getElementById("displayName");
    const dateOfBirth = document.getElementById("dateOfBirth");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const contactNumber = document.getElementById("contactNumber");
    const postalCode = document.getElementById("postalCode");
    const emailAddress = document.getElementById("emailAddress");
    const data = {
      id: this.currentUser.uid,
      displayName: displayName.value,
      province: "British Columbia",
      city: city.value,
      dateOfBirth:
        dateOfBirth.value !== null ? new Date(dateOfBirth.value) : "",
      address: address.value,
      contactNumber: contactNumber.value,
      postalCode: postalCode.value,
      emailAddress: emailAddress.value,
    };
    if (this.coordinates) {
      data.coordinates = this.coordinates;
    }

    try {
      uploadProfURL.imageURL =
        this.uploadProfURL !== null
          ? await uploadFile(this.uploadProfURL, "users")
          : "";

      if (
        this.profileImageToUpload !== null &&
        this.profileImageToUpload !== "undefined"
      ) {
        data.imageURL = await uploadFile(this.profileImageToUpload, "users");
      }

      data.uploadProfURL = uploadProfURL.imageURL;
      setProfileInfo(data);
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtn.innerHTML = "Save";
    }
  }

  async handleProfileImageChange(e) {
    e.preventDefault();
    const profileImageExtension = document.getElementById(
      "postingProfileImage"
    );
    const isValid = _validate(profileImageExtension, [
      ".png",
      ".jpg",
      ".jpeg",
      ".bmp",
      ".gif",
      ".png",
    ]);
    if (!isValid) alert("Invalid Image File");

    if (isValid) {
      const profileImage = document.getElementById("profileImage");
      this.profileImageToUpload = e.target.files[0];
      const imgUrl = await readURL(this.profileImageToUpload);
      profileImage.style.backgroundImage = `url(${imgUrl})`;
      profileImage.classList.add("visible");
      profileImage.children[3].style.display = "None";
    } else {
      profileImage.classList.remove("visible");
    }
  }

  async uploadProfURLChange(e) {
    e.preventDefault();
    const uploadProfURL = document.getElementById("uploadProfURL");
    const isValid = _validate(uploadProfURL, [
      ".png",
      ".jpg",
      ".jpeg",
      ".bmp",
      ".gif",
      ".png",
      ".pdf",
    ]);
    if (isValid) {
      this.uploadProfURL = e.target.files[0];
    } else {
      alert("Invalid Proof of Business Registration");
    }
  }
  // End: Profile Events Listener ===========================

  // Begin: Type of Work Events Listener ===========================

  async handleTypeOfWorkFormSubmit(e) {
    e.preventDefault();
    submitBtnTypeOfWork.innerHTML = "Saving...";

    let form = document.querySelector("#typeOfWorkForm");
    let checkBoxes = form.querySelectorAll('input[type="checkbox"]');

    const typeOfWork = {
      userId: this.profileId,
      positionTitle: [],
    };

    checkBoxes.forEach((item) => {
      if (item.checked) {
        typeOfWork.positionTitle.push(item.value); //stored the objects to result array
      }
    });

    let results = await getTypeOfWorkByUserId(typeOfWork.userId);
    try {
      if (results.length > 0) {
        await updatetypeOfWork(results[0].id, typeOfWork);
      } else {
        await setTypeOfWorkInfo(typeOfWork);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtnTypeOfWork.innerHTML = "Save";
    }
  }

  // End: Type of Work Events Listener ===========================

  // Begin: Availability Events Listener ===========================
  async handleAvailabilityFormSubmit(e) {
    e.preventDefault();
    availabilitySubmit.innerHTML = "Saving...";

    let form = document.querySelector("#availabilityForm");
    let checkBoxes = form.querySelectorAll('input[type="checkbox"]');
    const availability = {
      userId: this.profileId,
      days: [],
    };

    checkBoxes.forEach((item) => {
      if (item.checked) {
        availability.days.push(item.value); //stored the objects to result array
      }
    });

    let results = await getAvailabilityByUserId(availability.userId);

    try {
      if (results.length > 0) {
        await updateAvailability(results[0].id, availability);
      } else {
        await setAvailability(availability);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      availabilitySubmit.innerHTML = "Save";
    }
  }

  // End: Availability Events Listener ===========================

  // Begin: Length Of Shift Events Listener ===========================
  async handleLengthOfShiftFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";
    let form = document.querySelector("#lengthOfShiftForm");
    let fromTimes = form.querySelectorAll('input[id^="fromTime_"]');

    const lengthOfShift = {
      userId: this.profileId,
      time: [],
    };

    fromTimes.forEach((item) => {
      if (item.value !== "") {
        let closestParent = item.closest("div .form-group-lengthOfShift");
        let toTime = closestParent.querySelector('input[id^="toTime_"]');

        let _from = item.value.trim();
        let _to = toTime.value.trim();

        lengthOfShift.time.push({ from: _from, to: _to });
      }
    });

    let results = await getLengthOfShiftByUserId(lengthOfShift.userId);
    try {
      if (results.length > 0) {
        await updatelengthOfShift(results[0].id, lengthOfShift);
      } else {
        await setLengthOfShift(lengthOfShift);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtn.innerHTML = "Save";
    }
  }
  // End: Length Of Shift Events Listener ===========================
}

function _validate(oInput, extensions) {
  var sFileName = oInput.value;
  if (sFileName.length > 0) {
    for (let ext of extensions) {
      const isValid =
        sFileName
          .substr(sFileName.length - ext.length, ext.length)
          .toLowerCase() == ext.toLowerCase();
      if (isValid) return true;
    }
  }
  return false;
}

function _showHide() {}

export default AccountEmployee;
