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
    console.log(response);
    for (let job of response) {
      const customMarker = document.createElement("div");
      customMarker.className = "custom-marker";

      const markerImg = document.createElement("img");
      markerImg.src = "/static/icons/colored-pin.svg";
      customMarker.appendChild(markerImg);

      const marker = new tt.Marker({ element: customMarker })
        .setLngLat(job.coordinates)
        .addTo(this.map);

      marker.getElement().addEventListener("click", () => {
        const modal = new Modal(job);
        modal.wrapper = document.querySelector(".new-home-page");
        modal.open();
        const item = marker.getElement();
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
