import { async } from "@firebase/util";
import { getFirestore, getDoc, doc, collection } from "firebase/firestore";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import { setProfileInfo, getProfile } from "../../js/profile-setting/profile";
import { uploadFile } from "../../js/upload-files/upload-image";
import { formatDate, readURL } from "../../js/utils";
import "./profile.scss";
class Profile extends AuthenticatedPage {
  constructor() {
    super("Profie Setup");
    this.profileImageToUpload = null;
    this.proofOfWork = null;
  }

  async load() {
    return `
    <div class="profile-page">
        <h2> Profile Setup</h2>
        <form action="#" id="profileSetupForm">
        <div class="form-group profile-image">
            <img src="" alt="profile image" class="formImg" id="profileImg"/>
            <label for="profileImage">Upload Your Profie Pitcture</label>
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
            <label for="User Type">
              Employee or Employer
            </label>
        
            <select id="selectUserType" name="selectUserType">
              <option value="">--Please choose an option--</option>
              <option value="employee">Employee</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <div class="form-group">
            <label for="Province">
              Province
            </label>
        
            <select id="selectProvince">
              <option value="">--Please choose an option--</option>
              <option value="AB">Alberta</option>
              <option value="BC">British Coloumbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              
            </select>
          </div>
          <div class="form-group">
            <label for="zipCode">Zip Code</label>
            <input required type="text" id="zipCode">
            

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
            
            <label for="proofOfWork">Proof to work</label>
            <input type="file" id="proofOfWork">
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
    const selectProvince = document.getElementById("selectProvince");
    const addressLine = document.getElementById("addressLine");
    const contactNumber = document.getElementById("contactNumber");
    const zipCode = document.getElementById("zipCode");
    const submitBtn = document.getElementById("submitBtn");

    console.log(this.data.imageURL);
    if (typeof this.data.imageURL !== 'undefined' && this.data.imageURL !== "") {
      profileImg.src = this.data.imageURL;
    } else {
      profileImg.src = "../static/images/sample.jpg";
    }

    displayName.value = this.data.displayName;
    dateOfBirth.value = typeof this.data.dateOfBirth !== 'undefined' ? formatDate(this.data.dateOfBirth.toDate().toDateString()) : "";
    selectUserType.value = this.data.typeOfUser;
    selectProvince.value = typeof this.data.province !== 'undefined' ? this.data.province : "";
    addressLine.value = typeof this.data.addressLine !== 'undefined' ? this.data.addressLine : "";
    contactNumber.value = typeof this.data.contactNumber !== 'undefined' ? this.data.contactNumber : "";
    zipCode.value = typeof this.data.zipCode !== 'undefined' ? this.data.zipCode : "";
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
    const proofOfWork = document.getElementById("proofOfWork");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.innerHTML = "Saving...";
      const displayName = document.getElementById("displayName");
      const dateOfBirth = document.querySelector("#dateOfBirth");
      const selectUserType = document.getElementById("selectUserType");
      const selectProvince = document.getElementById("selectProvince");
      const addressLine = document.getElementById("addressLine");
      const contactNumber = document.getElementById("contactNumber");
      const zipCode = document.getElementById("zipCode");
      const profile = {
        id: this.currentUser.uid, //this.profileId,
        displayName: displayName.value,
        dateOfBirth: dateOfBirth.value !== null ? new Date(dateOfBirth.value) : "",
        typeOfUser: selectUserType.value,
        province: selectProvince.value,
        addressLine: addressLine.value,
        contactNumber: contactNumber.value,
        zipCode: zipCode.value,
      };
      try {
        postingProfileImage.imageURL = await uploadFile(
          this.profileImageToUpload,
          "users"
        );
        proofOfWork.imageURL = this.proofOfWork !== null ? await uploadFile(this.proofOfWork, "users") : "";

        profile.imageURL = postingProfileImage !== null ? await uploadFile(this.profileImageToUpload, "users") : "";
        console.log(this.profileImageToUpload);
        console.log(profile.imageURL);
        profile.proofOfWork = proofOfWork.imageURL;
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
    proofOfWork.addEventListener("change", async (e) => {
      e.preventDefault();
      const proofOfWork = document.getElementById("proofOfWork");
      const isValid = _validate(proofOfWork, [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".gif",
        ".png",
        ".pdf",
      ]);
      if (isValid) {
        this.proofOfWork = e.target.files[0];
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
