import AuthenticatedPage from "../../classes/AuthenticatedPage";
import EmployeePage from "../../classes/EmployeePage";
import { getProfile } from "../../js/account-setting/account";
import "./account.scss";

class Preferences extends EmployeePage {
  constructor() {
    super("Preferences");
  }

  async load() {
    return `
      <div class="account-page">
        <div class="profile">
            <h2 id="displayName">Preferences</h2>
            <ul class="menu">
                
                <li><span class="logo"></span><span class="text"><a href="/account/typeOfWork">Type of work</a></span></li>
                <li><span class="logo"></span><span class="text"><a href="/account/availability">Availability</a></span></li>
                <li><span class="logo"></span><span class="text"><a href="/account/lengthOfShift">Length of shift</a></span></li>
                
            </ul>
        </div>
      </div> 
      `;
  }

  async init() {
    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      //profileImg.src = this.data.imageURL;
    }
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    console.log(this.profileId);
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    this.init();
  }
}

export default Preferences;
