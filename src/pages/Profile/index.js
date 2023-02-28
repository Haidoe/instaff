import EmployeePage from "../../classes/EmployeePage";
import { setProfileInfo, getProfile } from "../../js/account-setting/account";
import { uploadFile } from "../../js/upload-files/upload-image";
import { formatDate, readURL } from "../../js/utils";
import "./profile.scss";
class Profile extends EmployeePage {
  constructor() {
    super("Profie Setup");
    this.profileImageToUpload = null;
    this.uploadProfURL = null;
  }

  async load() {
    return `
    <div class="profile-page">
        <h2> Profile Setup</h2>
        <form action="#" id="profileSetupForm">
        <div class="form-group profile-image">
            <img src="" alt="profile image" class="formImg" id="profileImg"/>
            <label id="profileImage">Upload Your Profie Pitcture</label>
            <input type="file" id="postingProfileImage">
          </div>
          <div class="form-group">
            <label for="Display Name">
              Display Name
            </label>
        
            <input required type="text" id="displayName">
          </div>
          <div class="form-group">
            <label for="dateOfBirth">Date of Birth</label>
            <input required type="date" id="dateOfBirth">
          </div>
          
          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input required type="text" id="postalCode">
            

          </div>
          <div class="form-group">
            <label for="address">Address Line</label>
            <input type="text" id="addressLine">
          </div>
          <div class="form-group">
            <label for="address">Contact Number</label>
            <input required type="text" id="contactNumber">
          </div>
          <div class="form-group">
            
            <label for="uploadProfURL">Proof to work</label>
            <input type="file" id="uploadProfURL">
          </div>

          <button type="submit" id="submitBtn">Submit</button>
        </form>
    </div> 
    `;
  }

  async init() {
    const profileImg = document.querySelector("#profileImg");
    const displayName = document.querySelector("#displayName");
    const dateOfBirth = document.querySelector("#dateOfBirth");
    const selectUserType = document.getElementById("selectUserType");
    const addressLine = document.getElementById("addressLine");
    const contactNumber = document.getElementById("contactNumber");
    const postalCode = document.getElementById("postalCode");
    const submitBtn = document.getElementById("submitBtn");

    console.log(this.data.imageURL);
    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      document.getElementById("profileImage").innerHTML =
        "Change profile photo";
      profileImg.src = this.data.imageURL;
    } else {
      profileImg.src = "../static/images/sample.jpg";
    }

    displayName.value = this.data.displayName;
    dateOfBirth.value =
      typeof this.data.dateOfBirth !== "undefined"
        ? formatDate(this.data.dateOfBirth.toDate().toDateString())
        : "";
    addressLine.value =
      typeof this.data.addressLine !== "undefined" ? this.data.addressLine : "";
    contactNumber.value =
      typeof this.data.contactNumber !== "undefined"
        ? this.data.contactNumber
        : "";
    postalCode.value =
      typeof this.data.postalCode !== "undefined" ? this.data.postalCode : "";
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();

    const form = document.querySelector("#profileSetupForm");
    const profileImage = document.getElementById("profileImage");
    const postingProfileImage = document.getElementById("postingProfileImage");
    const uploadProfURL = document.getElementById("uploadProfURL");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.innerHTML = "Saving...";
      const displayName = document.getElementById("displayName");
      const dateOfBirth = document.querySelector("#dateOfBirth");
      const addressLine = document.getElementById("addressLine");
      const contactNumber = document.getElementById("contactNumber");
      const postalCode = document.getElementById("postalCode");
      const profile = {
        userUID: this.currentUser.uid, //this.profileId,
        displayName: displayName.value,
        dateOfBirth:
          dateOfBirth.value !== null ? new Date(dateOfBirth.value) : "",
        typeOfUser: selectUserType.value,
        province: "BC",
        addressLine: addressLine.value,
        contactNumber: contactNumber.value,
        postalCode: postalCode.value,
      };
      try {
        postingProfileImage.imageURL = await uploadFile(
          this.profileImageToUpload,
          "users"
        );
        uploadProfURL.imageURL =
          this.uploadProfURL !== null
            ? await uploadFile(this.uploadProfURL, "users")
            : "";

        profile.imageURL =
          postingProfileImage !== null
            ? await uploadFile(this.profileImageToUpload, "users")
            : "";
        console.log(this.profileImageToUpload);
        console.log(profile.imageURL);
        profile.uploadProfURL = uploadProfURL.imageURL;
        console.log(profile);
        setProfileInfo(profile);
      } catch (error) {
        console.log("ERROR", error);
      } finally {
        submitBtn.innerHTML = "Submit";
      }
    });

    postingProfileImage.addEventListener("change", async (e) => {
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
        const profileImage = document.getElementById("profileImg");
        this.profileImageToUpload = e.target.files[0];
        const imgUrl = await readURL(this.profileImageToUpload);
        profileImage.src = imgUrl;
        profileImage.classList.add("visible");
        console.log(profileImage);
        console.log(imgUrl);
      } else {
        profileImage.classList.remove("visible");
      }
    });
    uploadProfURL.addEventListener("change", async (e) => {
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
        alert("Invalid Proof of Work");
      }
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

export default Profile;
