import EmployerPage from "../../classes/EmployerPage";
import template from "./account-employer.html";
import { formatDate, readURL } from "../../js/utils";
import { getProfile, setProfileInfo } from "../../js/account-setting/account";
import { uploadFile } from "../../js/upload-files/upload-image";
import "./account-employer.scss";
import {
  convertCoordinatesToAddress,
  convertAddressToCoordinates,
} from "../../js/map-util";
import pubsub from "../../classes/PubSub";

class AccountEmployer extends EmployerPage {
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
    const profileName = document.querySelector(".profile-name");
    const dateOfBirth = document.getElementById("dateOfBirth");
    const companyName = document.getElementById("companyName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const contactNumber = document.getElementById("contactNumber");
    const businessNumber = document.getElementById("businessNumber");
    const emailAddress = document.getElementById("emailAddress");
    const postalCode = document.getElementById("postalCode");
    const viewProof = document.getElementById("viewProof");
    const uploadedDate = document.getElementById("uploadedDate");
    const submitBtn = document.getElementById("submitBtn");

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
      //this.profileImageToUpload = this.data.imageURL;
    } else {
      profileImage.children[3].style.display = "None";
      profileImage.style.backgroundImage = `url(../../static/images/anonymous.svg)`;
      bannerImage.style.backgroundImage = `url(../../static/images/anonymous.svg)`;
    }
    if (
      typeof this.data.uploadProfURL !== "undefined" &&
      this.data.uploadProfURL !== ""
    ) {
      viewProof.href = this.data.uploadProfURL;
      const newContent = document.createTextNode(
        `${this.data.displayName}-proof-of-business`
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

    companyName.value =
      typeof this.data.companyName !== "undefined" ? this.data.companyName : "";
    address.value =
      typeof this.data.address !== "undefined" ? this.data.address : "";
    city.value = typeof this.data.city !== "undefined" ? this.data.city : "";
    contactNumber.value =
      typeof this.data.contactNumber !== "undefined"
        ? this.data.contactNumber
        : "";
    postalCode.value =
      typeof this.data.postalCode !== "undefined" ? this.data.postalCode : "";
    businessNumber.value =
      typeof this.data.businessNumber !== "undefined"
        ? this.data.businessNumber
        : "";
    emailAddress.value =
      typeof this.data.emailAddress !== "undefined"
        ? this.data.emailAddress
        : "";
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;

    const form = document.querySelector("#form1");
    const profileImage = document.getElementById("profileImage");
    const postingProfileImage = document.getElementById("postingProfileImage");
    const uploadProfURL = document.getElementById("uploadProfURL");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
    postingProfileImage.addEventListener(
      "change",
      this.handleProfileImageChange.bind(this)
    );

    // profileURL.addEventListener("click", (e) => {
    //   e.preventDefault();

    //   const mainPageContainer = document.querySelector(
    //     ".account-employer-page"
    //   );
    //   mainPageContainer.classList.add("profile-page-mobile");
    //   pubsub.publish("mainHeaderShowBackBtn");

    //   if (window.innerWidth < 768) {
    //     window.scrollTo(0, 0);
    //     globalState.preventPopState = true;
    //   }
    // });

    uploadProfURL.addEventListener(
      "change",
      this.uploadProfURLChange.bind(this)
    );

    this.initMap();
    this.addressListener();
    this.init();
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";
    const displayName = document.getElementById("displayName");
    const dateOfBirth = document.getElementById("dateOfBirth");
    const companyName = document.getElementById("companyName");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const contactNumber = document.getElementById("contactNumber");
    const businessNumber = document.getElementById("businessNumber");
    const emailAddress = document.getElementById("emailAddress");
    const postalCode = document.getElementById("postalCode");
    const data = {
      id: this.currentUser.uid, //this.profileId,
      displayName: displayName.value,
      dateOfBirth:
        dateOfBirth.value !== null ? new Date(dateOfBirth.value) : "",
      companyName: companyName.value,
      province: "British Columbia",
      city: city.value,
      address: address.value,
      contactNumber: contactNumber.value,
      businessNumber: businessNumber.value,
      emailAddress: emailAddress.value,
      postalCode: postalCode.value,
    };
    if (this.coordinates) {
      data.coordinates = this.coordinates;
    }
    try {
      data.uploadProfURL =
        this.uploadProfURL !== null
          ? await uploadFile(this.uploadProfURL, "users")
          : "";

      if (
        this.profileImageToUpload !== null &&
        this.profileImageToUpload !== "undefined"
      ) {
        data.imageURL = await uploadFile(this.profileImageToUpload, "users");
      }

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
export default AccountEmployer;
