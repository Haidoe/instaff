import { async } from "@firebase/util";
import { getProfile } from "../../js/account-setting/account";
import EmployeePage from "../../classes/EmployeePage";
import "./account.scss";

class Account extends EmployeePage {
  constructor() {
    super("Account");
  }

  async load() {
    return `
      <div class="account-page">
        <div class="profile">
            <img src="" alt="profile image" class="formImg" id="profileImg"/>
            <h2 id="displayName"></h2>
            <ul class="menu">
                <li><span class="logo"></span><span class="text"><a href="/profile">Profile</a></span></li>
                <li><span class="logo"></span><span class="text"><a href="/account/preferences">Preferences</a></span></li>
                <li><span class="logo"></span><span class="text"><a href="/account/setting">Settings</a></span></li>
               
            </ul>
        </div>
      </div> 
      `;
  }

  async init() {
    const profileImg = document.querySelector("#profileImg");
    const displayName = document.querySelector("#displayName");

    displayName.innerHTML = this.data.displayName;

    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      profileImg.src = this.data.imageURL;
    } else {
      profileImg.src = "../static/images/sample.jpg";
    }
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();
  }
}

export default Account;
