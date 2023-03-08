import EmployeePage from "../../classes/EmployeePage";
import { getProfile } from "../../js/account-setting/account";
import "./account.scss";

class setting extends EmployeePage {
  constructor() {
    super("Setting");
  }

  async load() {
    return `
        <div class="account-page">
            <div class="profile">
                <h2 id="displayName">Settings</h2>
                <ul class="menu">
                    
                    <li><span class="logo"></span><span class="text"><a href="#">Language</a></span></li>
                    <li><span class="logo"></span><span class="text"><a href="#">Dark mode</a></span></li>
                    <li><span class="logo"></span><span class="text"><a href="#">Data privacy</a></span></li>
                    <li><span class="logo"></span><span class="text"><a href="#">Security</a></span></li>
                    <li><span class="logo"></span><span class="text"><a href="#">Terms of service</a></span></li>
                    <li><span class="logo"></span><span class="text"><a href="#">Contact support</a></span></li>
                </ul>
            </div>
      </div> 
        `;
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

export default setting;
