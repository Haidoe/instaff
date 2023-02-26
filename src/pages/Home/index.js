import Pages from "../../classes/Page";
import Modal from "../../components/modal";
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
      // console.log(job, job.coordinates);

      const marker = new tt.Marker().setLngLat(job.coordinates).addTo(this.map);

      marker.getElement().addEventListener("click", () => {
        //Open the modal here.
        const modal = new Modal();
        modal.wrapper = document.querySelector(".new-home-page");

        //If this will be massive, create a new html for this.
        //But it will be easier to maintain if you create a javascript class element for this.
        //Just like modal ---- check components/modal/index.js
        modal.modalContent.innerHTML = `
            <div class="your-own-modal-css">
              ${job.positionTitle} - ${job.companyName}
            </div>
          `;

        //Hide Action Buttons
        modal.hideMeta();

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
    document.querySelector("body").classList.remove("home-body");
  }
}

export default Home;
