import Pages from "../classes/Page";
import Template from "./home.html";
import "./home.scss";
import { getAllJobPostings
 } from "../js/job-posting/job-posting"
class Home extends Pages {
  constructor() {
    super("Home");
  }

  async load() {
    return Template;
  }

  handleSearch() {

  }

  async mounted() {
    document.querySelector("body").classList.add("home-body");

    const defaultCenter = {
      lat: 49.23512376137244,
      lng: -123.03851521512506,
    };

    let defaultZoom = 15;

    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "home-page",
      center: defaultCenter,
      zoom: defaultZoom,
    });

    const result = await getAllJobPostings();
    
    console.log(result)
  }

  close() {
    document.querySelector("body").classList.remove("home-body");
  }
}

export default Home;
