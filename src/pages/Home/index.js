import AuthenticatedPage from "../../classes/AuthenticatedPage";
import JobMatch from "../../components/modal/job-match";
import Modal from "../../components/modal/job-posting-detail";
import getAllActiveJobPostings from "../../js/job-posting/getAllActiveJobPostings";
import { pageTransition } from "../../router";
import Template from "./home.html";
import "./home.scss";

class Home extends AuthenticatedPage {
  static markers = [];
  static markerIDRef = [];
  static appliedMarkerRef = [];
  static joblist = [];
  static jobTitleList = [];
  static currentlist = [];
  static showlist = [];
  static modalList = [];
  static focusedMarker;
  static focusedItem = null;
  static defaultCenter = {
    lat: 49.23512376137244,
    lng: -123.03851521512506,
  };

  static JobOptions = [];

  constructor() {
    super("Home");
    this.map = null;
    this.marker = null;
    this.userId = null;
    this.infoHint = null;
    this.errorHint = null;

    this.geoAPILoaded = false;
  }

  async preload() {
    const result = await super.preload();

    if (result) {
      if (this.currentUser.details.typeOfUser === "employer") {
        pageTransition("/dashboard");
        return false;
      }
    }

    return result;
  }

  async load() {
    return Template;
  }

  getRandomNumberInRange(min, max) {
    return Math.random() * (max - min) + min;
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
      center: Home.defaultCenter,
      zoom: defaultZoom,
    });

    this.map.addControl(new tt.NavigationControl());

    //Added for getting location
    this.map.addControl(new tt.FullscreenControl());

    searchBtn.addEventListener("click", this.jobFilter.bind(this));
    resetBtn.addEventListener("click", this.mapReset.bind(this));

    this.map.on("moveend", this.updateList.bind(this));

    const sidebarOffBtn = document.getElementById("toogle-button-off");
    const sidebarOnBtn = document.getElementById("toogle-button-on");
    const searchDiv = document.getElementsByClassName("search-div");
    const sideBar = document.getElementById("side-bar");
    const homePage = document.getElementById("new-home-page");
    sidebarOnBtn.style.display = "none";

    sidebarOffBtn.addEventListener("click", function (e) {
      sideBar.style.width = "0";
      sideBar.style.left = "-2rem";
      homePage.style.marginLeft = "0";
      sidebarOnBtn.style.display = "flex";
      searchDiv[0].style.left = "50%";
    });

    sidebarOnBtn.addEventListener("click", function (e) {
      sideBar.style.width = "300px";
      sideBar.style.left = "0";
      // homePage.style.marginLeft = "300px";
      sidebarOnBtn.style.display = "none";
      searchDiv[0].style.left = "64%";
    });
  }

  removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
  async fetchAllActiveJobPostings() {
    const response = await getAllActiveJobPostings();
    Home.joblist = response;
    Home.joblist.forEach(function (job) {
      Home.jobTitleList.push(job.positionTitle);
    });

    Home.JobOptions = [];
    Home.JobOptions = this.removeDuplicates(Home.jobTitleList);
    const jobPositionList = document.getElementById("job_title_list");
    jobPositionList.innerHTML = "";
    Home.JobOptions.forEach(function (job_title) {
      const option = document.createElement("option");
      option.value = job_title;
      jobPositionList.appendChild(option);
    });
  }

  updateList() {
    //1. Get the view boundary
    const currentBound = this.map.getBounds();
    //2. Calculate the elements inside this boundary
    Home.showlist = [];
    Home.modalList = [];

    Home.currentlist.forEach(function (job) {
      if (
        job.coordinates.lng >=
          currentBound._sw.lng +
            (currentBound._ne.lng - currentBound._sw.lng) * 0.3 &&
        job.coordinates.lng <= currentBound._ne.lng &&
        job.coordinates.lat >= currentBound._sw.lat &&
        job.coordinates.lat <= currentBound._ne.lat
      ) {
        Home.showlist.push(job);
      }
    });
    //3. Update the list
    const JobInfoList = document.getElementById("job-info-list");
    JobInfoList.innerHTML = "";

    const jobCount = Home.showlist.length;
    const listTitle = document.getElementById("side-list-title");

    if (jobCount == 0) {
      listTitle.innerHTML = "There's no job in this area";
    } else if (jobCount == 1) {
      listTitle.innerHTML = `There is 1 job in this area`;
    } else if (jobCount > 1) {
      listTitle.innerHTML = `There are ${jobCount} jobs in this area`;
    }

    Home.showlist.forEach((job) => {
      let job_province = "";
      if (job.province == "British Columbia") {
        job_province = "BC";
      }
      let job_temp = "";
      job_temp += `<p class="job-article-id">${job.id}</p>`;
      job_temp += `<img class="job-image" src="https://picsum.photos/200/300"></img>`;
      job_temp += `<p class="job-article-title">${job.positionTitle}</p>`;
      job_temp += `<p class="job-article-wage">$${job.wageRate}/hr</p>`;
      job_temp += `<p class="job-article-city">${job.city}, ${job_province}</p>`;

      const singleArticle = document.createElement("article");
      singleArticle.innerHTML = job_temp;

      const modal = new Modal(job);
      modal.wrapper = document.querySelector(".new-home-page");
      Home.modalList.push(modal);

      singleArticle.addEventListener("click", () => {
        const currentBound = this.map.getBounds();
        modal.open();
        const drift = (currentBound._ne.lng - currentBound._sw.lng) / 3;

        this.map.easeTo({
          center: {
            lat: job.coordinates.lat,
            lng: job.coordinates.lng - drift,
          },
        });

        const jobID = job.id;
        Home.markerIDRef.forEach((marker) => {
          if (marker.jobID == jobID) {
            const item = marker.markerObj.getElement();
            if (Home.focusedMarker) {
              const previousMarkerItem = Home.focusedMarker.getElement();
              previousMarkerItem.classList.toggle("marker-selected");
            }
            Home.focusedMarker = marker.markerObj;
            if (!item.classList.contains("marker-selected")) {
              item.classList.toggle("marker-selected");
            }
          }
        });

        if (Home.focusedItem != null) {
          Home.focusedItem.classList.toggle("focus-article");
        }
        singleArticle.classList.toggle("focus-article");
        Home.focusedItem = singleArticle;
      });
      JobInfoList.appendChild(singleArticle);
    });
  }

  mapReset() {
    this.showJobs();
    this.map.easeTo({
      center: Home.defaultCenter,
    });
  }

  jobFilter() {
    this.removeMarkers();
    Home.currentlist = [];

    const keyword = job_keyword.value;

    let searchCount = 0;

    if (job_keyword.value.length == 0) {
      alert("Please add your keywords.");
      this.showJobs();
    } else {
      for (let job of Home.joblist) {
        if (job.positionTitle.toUpperCase() === keyword.toUpperCase()) {
          searchCount++;
          Home.currentlist.push(job);

          const customMarker = document.createElement("div");
          customMarker.className = "custom-marker";

          const markerImg = document.createElement("img");
          markerImg.src = "/static/icons/colored-pin.svg";
          customMarker.appendChild(markerImg);

          const marker = new tt.Marker({
            element: customMarker,
          })
            .setLngLat(job.coordinates)
            .addTo(this.map);

          Home.markers.push(marker);
          const markerRef = {
            markerObj: marker,
            jobID: job.id,
          };

          Home.markerIDRef.push(markerRef);

          const modal = new Modal(job);

          modal.wrapper = document.querySelector(".new-home-page");
          const item = marker.getElement();

          marker.getElement().addEventListener("click", () => {
            console.log("CLICKED!");
            const item = marker.getElement();
            const currentBound = this.map.getBounds();
            modal.open();

            const drift = (currentBound._ne.lng - currentBound._sw.lng) / 3;
            this.map.easeTo({
              center: {
                lat: job.coordinates.lat,
                lng: job.coordinates.lng - drift,
              },
            });

            if (Home.focusedMarker) {
              const previousMarkerItem = Home.focusedMarker.getElement();
              previousMarkerItem.classList.toggle("marker-selected");
            }

            Home.focusedMarker = marker;
            if (!item.classList.contains("marker-selected")) {
              item.classList.toggle("marker-selected");
            }
          });
        }
      }

      if (searchCount == 0) {
        alert("Cannot find such job, please try another keyword.");
        this.showJobs();
      } else if (searchCount > 0) {
        let temp_lng = 0;
        let temp_lat = 0;

        Home.currentlist.forEach(function (item) {
          temp_lng += item.coordinates.lng;
          temp_lat += item.coordinates.lat;
        });

        temp_lng = temp_lng / Home.currentlist.length;
        temp_lat = temp_lat / Home.currentlist.length;

        console.log(temp_lng + " , " + temp_lat);
        this.map.easeTo({
          center: {
            lat: temp_lat,
            lng: temp_lng,
          },
        });
        this.updateList();
      }
    }
  }

  removeMarkers() {
    if (Home.markers.length > 0) {
      Home.markers.forEach(function (marker) {
        marker.remove();
      });
    }
  }

  async showJobs() {
    await this.fetchAllActiveJobPostings();
    this.removeMarkers();
    Home.markerIDRef = [];
    Home.currentlist = [];
    job_keyword.value = "";

    for (let job of Home.joblist) {
      Home.currentlist.push(job);
      const customMarker = document.createElement("div");
      customMarker.className = "custom-marker";

      const markerImg = document.createElement("img");
      markerImg.src = "/static/icons/colored-pin.svg";
      customMarker.appendChild(markerImg);

      const marker = new tt.Marker({
        element: customMarker,
      })
        .setLngLat(job.coordinates)
        .addTo(this.map);

      Home.markers.push(marker);

      const markerRef = {
        markerObj: marker,
        jobID: job.id,
      };

      Home.markerIDRef.push(markerRef);

      marker.getElement().addEventListener("click", () => {
        const modal = new Modal(job);

        modal.wrapper = document.querySelector(".new-home-page");

        const currentBound = this.map.getBounds();

        modal.open();

        const drift = (currentBound._ne.lng - currentBound._sw.lng) / 3;
        this.map.easeTo({
          center: {
            lat: job.coordinates.lat,
            lng: job.coordinates.lng - drift,
          },
        });

        const articles = document.querySelectorAll("article");

        let focusMarkerID = null;
        //Get the element in the list styled
        Home.markerIDRef.forEach(function (markerRef) {
          if (markerRef.markerObj == marker) {
            focusMarkerID = markerRef.jobID;
          }
        });

        articles.forEach(function (article) {
          if (article.firstChild.innerHTML == focusMarkerID) {
            if (!article.classList.contains("focus-article")) {
              if (Home.focusedItem != null) {
                Home.focusedItem.classList.toggle("focus-article");
              }
              article.classList.toggle("focus-article");
              Home.focusedItem = article;
            }
          }
        });

        const item = marker.getElement();

        if (Home.focusedMarker) {
          const previousMarkerItem = Home.focusedMarker.getElement();
          previousMarkerItem.classList.toggle("marker-selected");
        }

        Home.focusedMarker = marker;
        if (!item.classList.contains("marker-selected")) {
          item.classList.toggle("marker-selected");
        }
      });
    }
    this.updateList();
  }

  async initJobMatch() {
    //This is temporary, will be replaced with the actual API call
    const items = await getAllActiveJobPostings();
    items.length = 2;

    this.jobMatchModal = new JobMatch(items);
    this.jobMatchModal.open();
  }

  async initCurrentLocation() {
    this.geoAPI = navigator.geolocation.watchPosition(async (position) => {
      if (this.geoAPILoaded) return true;

      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (pos.lat && pos.lng) {
        const customMarker = document.createElement("div");
        customMarker.className = "custom-marker you-are-here";

        this.currentPositionMarker = new tt.Marker({
          element: customMarker,
        })
          .setLngLat(pos)
          .addTo(this.map);

        this.map.easeTo({ center: pos });

        this.geoAPILoaded = true;
      }
    });
  }

  async mounted() {
    document.querySelector("body").classList.add("new-home-body");
    this.initMap();
    this.showJobs();

    const activeMenu = document.querySelector(".main-header nav a[href='/']");
    activeMenu?.classList.add("active-menu-item");

    this.initJobMatch();
    this.initCurrentLocation();
  }

  close() {
    document.querySelector("body").classList.remove("new-home-body");

    //Just to make sure Active Menu is set to Dashboard
    const activeMenu = document.querySelector(".main-header nav a[href='/']");
    activeMenu?.classList.remove("active-menu-item");

    this.jobMatchModal?.close();

    this.geoAPI && navigator.geolocation.clearWatch(this.geoAPI);
  }
}

export default Home;
