import EmployerPage from "../../classes/EmployerPage";
import template from "./dashboard.html";
import "./dashboard.scss";

class Dashboard extends EmployerPage {
  constructor() {
    super("Home");
  }

  async load() {
    return template;
  }

  async mounted() {
    // Page is loaded
    const articleImg = document.querySelector("#articleTest img");

    articleImg.src = "/static/images/1.png";

    const articleImg2 = document.querySelector("#articleTest2 img");

    articleImg2.src = "/static/images/2.png";

    const articleImg3 = document.querySelector("#articleTest3 img");

    articleImg3.src = "/static/images/3.png";

    const articleImg4 = document.querySelector("#articleTest4 img");

    articleImg4.src = "/static/images/3.png";

    const articleImg5 = document.querySelector("#articleTest5 img");

    articleImg5.src = "/static/images/2.png";
  }
}

export default Dashboard;