import { getProfile } from "../../js/profile-setting/profile";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import "./account.scss";

class Account extends AuthenticatedPage {
  constructor() {
    super("Preferences");
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
                <li><span class="logo"></span><span class="text">Setting</span></li>
               
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