import Pages from "../../classes/Page";
import Modal from "../../components/modal/job-posting-detail";
import getAllActiveJobPostings from "../../js/job-posting/getAllActiveJobPostings";
import Template from "./home.html";
import "./home.scss";

class Home extends Pages {
  constructor() {
    super("Home");
    this.map = null;
    this.marker = null;
  }

  async load() {
    return Template;
  }

  initMap() {
    const defaultCenter = {
      lat: 49.23512376137244,
      lng: -123.03851521512506,
    };

    const defaultZoom = 11;

    this.map = tt.map({
      key: process.env.INSTAFF_MAP_KEY,
      container: "new-home-page",
      center: defaultCenter,
      zoom: defaultZoom,
    });

    this.map.addControl(new tt.NavigationControl());
  }

  async fetchAllActiveJobPostings() {
    const response = await getAllActiveJobPostings();

    for (let job of response) {
      const marker = new tt.Marker().setLngLat(job.coordinates).addTo(this.map);

      const modal = new Modal(job);

      modal.wrapper = document.querySelector(".new-home-page");

      marker.getElement().addEventListener("click", () => {
        modal.open();
      });
    }
  }

  async mounted() {
    document.querySelector("body").classList.add("new-home-body");

    this.initMap();
    this.fetchAllActiveJobPostings();
  }

  close() {
    document.querySelector("body").classList.remove("new-home-body");
  }
}

export default Home;
