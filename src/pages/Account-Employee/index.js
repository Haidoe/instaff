import template from "./account-employee.html";
import EmployeePage from "../../classes/EmployeePage";
import {
  setProfileInfo,
  getProfile,
  getTypeOfWorkByUserId,
  updatetypeOfWork,
  setTypeOfWorkInfo,
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
    console.log(process.env.INSTAFF_MAP_KEY);
    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "profile-map",
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
  async init() {
    //const lblProfileImage = document.getElementById("lblProfileImage");
    const profileImage = document.querySelector("#profileImage");
    const bannerImage = document.querySelector(".banner-image");
    const displayName = document.querySelector("#displayName");
    const dateOfBirth = document.querySelector("#dateOfBirth");
    const profileName = document.querySelector(".profile-name");
    const address = document.getElementById("address");
    const contactNumber = document.getElementById("contactNumber");
    const postalCode = document.getElementById("postalCode");
    const emailAddress = document.getElementById("emailAddress");

    console.log(this.data);
    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      document.getElementById("lblProfileImage").innerHTML =
        "Change profile photo";
      console.log(this.data.imageURL);
      profileImage.children[3].style.display = "None";
      profileImage.style.backgroundImage = `url("${this.data.imageURL}")`;
      bannerImage.style.backgroundImage = `url("${this.data.imageURL}")`;
      this.profileImageToUpload = this.data.imageURL;
    } else {
      //profileImage.src = "../../static/images/sample.jpg";
      profileImage.children[3].style.display = "None";
      profileImage.style.backgroundImage = `url(../../static/images/sample.jpg)`;
      bannerImage.style.backgroundImage = `url(../../static/images/sample.jpg)`;
    }
    if (
      typeof this.data.uploadProfURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
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
    contactNumber.value =
      typeof this.data.contactNumber !== "undefined"
        ? this.data.contactNumber
        : "";
    postalCode.value =
      typeof this.data.postalCode !== "undefined" ? this.data.postalCode : "";
    emailAddress.value =
      typeof this.data.emailAddress !== "undefined"
        ? this.data.emailAddress
        : "";
  }

  async loadTypeOfWorkListingData() {
    let results = await getTypeOfWorkByUserId(this.profileId);
    const checkList = [
      "Barista",
      "Dishwasher",
      "EventServer",
      "Bartender",
      "CounterStaff",
      "EventSetup",
      "WarehouseAssociate",
      "Barback",
      "Busser",
      "Custodial",
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
      const inputCheckbox = document.createElement("input");
      inputCheckbox.type = "checkbox";
      inputCheckbox.className = "logo";
      inputCheckbox.id = item.toLowerCase();
      inputCheckbox.name = "workType";
      inputCheckbox.value = item;
      inputCheckbox.checked = findItem != undefined ? true : false;

      const labelCheckboxFor = document.createElement("label");
      labelCheckboxFor.innerHTML = item;

      const typeOfWorkContainer = document.querySelector(".form-group");
      typeOfWorkContainer.appendChild(inputCheckbox);
      typeOfWorkContainer.appendChild(labelCheckboxFor);
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
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();
    this.loadTypeOfWorkListingData();

    const profileForm = document.querySelector("#profileForm");
    const profileImage = document.getElementById("profileImage");
    const postingProfileImage = document.getElementById("postingProfileImage");
    const uploadProfURL = document.getElementById("uploadProfURL");
    const profileURL = document.getElementById("profileURL");
    const preferenceURL = document.getElementById("preferenceURL");
    const webPreferenceURL = document.getElementById("webPreferenceURL");
    const webProfileURL = document.getElementById("webProfileURL");
    const typeOfWorkURL = document.getElementById("typeOfWorkURL");

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
      mainPageContainer.classList.remove("preference-wrapper-clicked");
      mainPageContainer.classList.remove("preference-page-mobile");
      mainPageContainer.classList.remove("preference-page");
      mainPageContainer.classList.remove("typeofWork-page");

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
      console.log("hello from web page");

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("preference-wrapper-clicked");
      mainPageContainer.classList.add("preference-page");
      mainPageContainer.classList.remove("profile-page-clicked");

      const previousActiveMenu = document.querySelector(".web-menu li.active");
      previousActiveMenu.classList.remove("active");
      e.target.parentElement.classList.add("active");

      // Set Active Link
      // const previousSideActiveMenu = document.querySelector(
      //   ".preference-page nav li.sideMenu-active"
      // );
      //previousSideActiveMenu.classList.remove("sideMenu-active");
      //e.target.parentElement.classList.add("sideMenu-active");
    });

    // Begin: Type of Work ===========================

    const typeOfWorkForm = document.querySelector("#typeOfWorkForm");
    typeOfWorkForm.addEventListener(
      "submit",
      this.handleTypeOfWorkFormSubmit.bind(this)
    );

    // const results = await getTypeOfWorkByUserId(this.profileId);
    // console.log(results);

    typeOfWorkURL.addEventListener("click", (e) => {
      e.preventDefault();

      const mainPageContainer = document.querySelector(
        ".account-employee-page"
      );
      mainPageContainer.classList.add("typeofWork-page");
      pubsub.publish("mainHeaderShowBackBtn");

      if (window.innerWidth < 768) {
        window.scrollTo(0, 0);
        globalState.preventPopState = true;
      }
    });

    // End: Type of Work ===========================

    //PubSub for Mobile Related Stuff
    pubsub.subscribe("mainHeaderBackBtnClicked", this.popStateListener);
    window.addEventListener("popstate", this.popStateListener);

    // Begin: Profile Events Listener ===========================
    uploadProfURL.addEventListener(
      "change",
      this.uploadProfURLChange.bind(this)
    );

    this.initMap();
    console.log("Map");
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

  async handleProfileFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";
    const displayName = document.getElementById("displayName");
    const dateOfBirth = document.getElementById("dateOfBirth");
    const address = document.getElementById("address");
    const contactNumber = document.getElementById("contactNumber");
    const postalCode = document.getElementById("postalCode");
    const emailAddress = document.getElementById("emailAddress");
    const data = {
      id: this.currentUser.uid, //this.profileId,
      //   userUID: this.currentUser.uid, //this.profileId,
      displayName: displayName.value,
      province: "BC",
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

      data.imageURL =
        postingProfileImage !== null
          ? await uploadFile(this.profileImageToUpload, "users")
          : "";
      console.log(this.profileImageToUpload);
      console.log(data.imageURL);
      data.uploadProfURL = uploadProfURL.imageURL;
      console.log(data);
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
      console.log(e.target.files[0]);
      this.profileImageToUpload = e.target.files[0];
      const imgUrl = await readURL(this.profileImageToUpload);
      profileImage.style.backgroundImage = `url(${imgUrl})`;
      profileImage.classList.add("visible");
      profileImage.children[3].style.display = "None";
      console.log(imgUrl);
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

export default AccountEmployee;
