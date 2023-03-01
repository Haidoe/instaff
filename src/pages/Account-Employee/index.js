import template from "./account-employee.html";
import EmployeePage from "../../classes/EmployeePage";
import { setProfileInfo, getProfile } from "../../js/account-setting/account";
import { uploadFile } from "../../js/upload-files/upload-image";
import { formatDate, readURL } from "../../js/utils";
import pubsub from "../../classes/PubSub";
import "./account-employee.scss";
import {
  convertCoordinatesToAddress,
  convertAddressToCoordinates,
} from "../../js/map-util";

class AccountEmployee extends EmployeePage {
  constructor() {
    super("Profile");
    this.profileImageToUpload = null;
    this.uploadProfURL = null;
    this.image = null;
    this.map = null;
    this.marker = null;
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
    const submitBtn = document.getElementById("submitBtn");
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

  popStateListener(e) {
    const mainPageContainer = document.querySelector(".account-employee-page");
    mainPageContainer.classList.remove("profile-page-mobile");
    pubsub.publish("mainHeaderHideBackBtn");
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();

    const form = document.querySelector("#form1");
    const profileImage = document.getElementById("profileImage");
    const postingProfileImage = document.getElementById("postingProfileImage");
    const uploadProfURL = document.getElementById("uploadProfURL");
    const profileURL = document.getElementById("profileURL");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
    postingProfileImage.addEventListener(
      "change",
      this.handleProfileImageChange.bind(this)
    );
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

    //PubSub for Mobile Related Stuff
    pubsub.subscribe("mainHeaderBackBtnClicked", this.popStateListener);
    window.addEventListener("popstate", this.popStateListener);

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
  async handleFormSubmit(e) {
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
