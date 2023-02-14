import Pages from "../classes/Page";
import Template from "./home.html";
import "./home.scss";
import { convertAddressToCoordinates } from "../js/job-posting/job-posting";
class Home extends Pages {
  constructor() {
    super("Home");
  }

  async load() {
    return Template;
  }

  async mounted() {
    // TODO - Remove this in the future
    // This is just temporary
    const temp = document.querySelector("#temp");
    temp.innerHTML = "";

    const user = await this.getCurrentUser();
    if (user) {
      const button = document.createElement("button");
      button.textContent = "Sign out";
      button.onclick = this.signOutUser;
      temp.appendChild(button);
    }

    console.log("Home mounted", process.env.MAPS_KEY);
  }
}

export default Home;
