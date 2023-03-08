import Pages from "../../classes/Page";
import Modal from "../../components/modal/job-posting-detail";
import getAllActiveJobPostings from "../../js/job-posting/getAllActiveJobPostings";
import JobPosting from "../JobPostingV2";
import isAlreadyApplied from "../../js/applicants/isAlreadyApplied";
import InfoHint from "../../assets/js/info-hint"
import { getUserDetails } from "../../js/users";
import Template from "./home.html";
import "./home.scss";

class Home extends Pages {
  static markers = [];
  static markerIDRef = [];
  static appliedMarkerRef = [];
  static joblist = [];
  static jobTitleList = [];
  static currentlist = [];
  static showlist = [];
  static modalList = [];
  static focusedMarker;
  static focusedItem=null;
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

    searchBtn.addEventListener('click', this.jobFilter.bind(this));
    resetBtn.addEventListener('click', this.mapReset.bind(this));


    this.map.on("moveend", this.updateList.bind(this));
  }

  removeDuplicates(arr) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }
  async fetchAllActiveJobPostings() {
    const response = await getAllActiveJobPostings();
    Home.joblist = response;
    //console.log(Home.joblist);
    Home.joblist.forEach(function (job) {
      Home.jobTitleList.push(job.positionTitle)
    })

    console.log(Home.jobTitleList);
    Home.JobOptions = []
    Home.JobOptions = this.removeDuplicates(Home.jobTitleList);

    const jobPositionList = document.getElementById('job_title_list');
    jobPositionList.innerHTML='';
    Home.JobOptions.forEach(function (job_title) {
      const option = document.createElement('option');
      option.value = job_title;
      jobPositionList.appendChild(option);
    })
  }

  updateList(){
    //1. Get the view boundary
    //console.log(this.map.getBounds())
    const currentBound = this.map.getBounds();
    //2. Calculate the elements inside this boundary
    Home.showlist = []
    Home.modalList = []

    Home.currentlist.forEach(function(job){
      if(job.coordinates.lng>=currentBound._sw.lng && 
        job.coordinates.lng<=currentBound._ne.lng &&
        job.coordinates.lat>=currentBound._sw.lat &&
        job.coordinates.lat<=currentBound._ne.lat
        ){
          Home.showlist.push(job)
          // console.log(job.companyName+" , "+job.coordinates.lng+" , "+job.coordinates.lat);
        }
    })
    //3. Update the list
    const JobInfoList = document.getElementById("job-info-list");
    JobInfoList.innerHTML = "";


    Home.showlist.forEach((job) => {
      let job_province='';
      if(job.province=='British Columbia'){
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

      singleArticle.addEventListener('click',()=>{
        const currentBound = this.map.getBounds();
        modal.open();
        const drift = (currentBound._ne.lng - currentBound._sw.lng )/4;
        console.log(drift);

        console.log(job.coordinates);
        this.map.easeTo({
          center: { 
            lat: job.coordinates.lat,
            lng: job.coordinates.lng-drift,
          }
        });

        const jobID = job.id;
        console.log(jobID)
        Home.markerIDRef.forEach((marker) => {
              if (marker.jobID == jobID) {
                const item = marker.markerObj.getElement();
                // console.log(Home.focusedMarker);
                if (Home.focusedMarker) {
                  const previousMarkerItem = Home.focusedMarker.getElement();
                  previousMarkerItem.classList.toggle("marker-selected");
                }
                Home.focusedMarker = marker.markerObj;
                if (!item.classList.contains("marker-selected")) {
                  item.classList.toggle("marker-selected");
                }
          }
        })
  
        if(Home.focusedItem!=null){
          Home.focusedItem.classList.toggle("focus-article");
        }
        console.log("before toggle")
        singleArticle.classList.toggle("focus-article");
        console.log("after toggle")
        Home.focusedItem = singleArticle;


      })
      JobInfoList.appendChild(singleArticle);
    });
  }

  mapReset(){
    this.showJobs();
    this.map.easeTo({
      center: Home.defaultCenter
    });

  }

  jobFilter() {
    this.removeMarkers();
    Home.currentlist = [];

    const keyword = job_keyword.value;

    console.log("Searching for " + keyword)

    for (let job of Home.joblist) {
      if (job.positionTitle == keyword) {
        Home.currentlist.push(job);

        const customMarker = document.createElement("div");
        customMarker.className = "custom-marker";

        const markerImg = document.createElement("img");
        markerImg.src = "/static/icons/colored-pin.svg";
        customMarker.appendChild(markerImg);


        const marker = new tt.Marker({
            element: customMarker
          })
          .setLngLat(job.coordinates)
          .addTo(this.map);

        Home.markers.push(marker);
        const markerRef = {
          markerObj: marker,
          jobID: job.id
        }
  
        Home.markerIDRef.push(markerRef);

        const modal = new Modal(job);

        modal.wrapper = document.querySelector(".new-home-page");

        const item = marker.getElement();
        console.log(item);


        marker.getElement().addEventListener("click", () => {
          const item = marker.getElement();
          console.log(item);
          modal.open();


          
          // Home.markers.forEach(function(marker_temp){
          //   if(this.marker==marker_temp){
          //     console.log(marker_temp)
          //   }
          // })
        
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

    console.log(Home.currentlist)
    let temp_lng = 0;
    let temp_lat = 0;

    Home.currentlist.forEach(function(item){
      temp_lng+=item.coordinates.lng;
      temp_lat+=item.coordinates.lat;
    })
    // let length = Home.currentlist.length;

    // for(i=0; i < length; i++){
    //   temp_lng+= Home.currentlist[i].coordinatees.lng;
    //   temp_lat+= Home.currentlist[i].coordinatees.lat;
    // }

    temp_lng=temp_lng/Home.currentlist.length;
    temp_lat=temp_lat/Home.currentlist.length;

    console.log(temp_lng+" , "+temp_lat)

    this.map.easeTo({
      center: { 
        lat: temp_lat,
        lng: temp_lng,
      }
    });

    this.updateList();
    //console.log(Home.currentlist)
  }

  removeMarkers(){
    if(Home.markers.length>0){
      Home.markers.forEach(function(marker){
        marker.remove();
      })
    }
  }

  async showJobs() {
    await this.fetchAllActiveJobPostings()
    this.removeMarkers();
    Home.markerIDRef = [];
    Home.currentlist = [];
    job_keyword.value='';

    for (let job of Home.joblist) {
      Home.currentlist.push(job);
      const customMarker = document.createElement("div");
      customMarker.className = "custom-marker";

      const markerImg = document.createElement("img");
      markerImg.src = "/static/icons/colored-pin.svg";
      customMarker.appendChild(markerImg);

      const marker = new tt.Marker({
          element: customMarker
        })
        .setLngLat(job.coordinates)
        .addTo(this.map);

      Home.markers.push(marker);

      const markerRef = {
        markerObj: marker,
        jobID: job.id
      }

      Home.markerIDRef.push(markerRef);

      const modal = new Modal(job);

      modal.wrapper = document.querySelector(".new-home-page");

      marker.getElement().addEventListener("click", () => {
        console.log("marker clicked")
        console.log(marker._element)
        // console.log(marker)

        modal.open();
        
        console.log(marker)

        const articles = document.querySelectorAll("article");

        let focusMarkerID = null;
        //Get the element in the list styled
        Home.markerIDRef.forEach(function(markerRef){
          if(markerRef.markerObj==marker){
            // console.log(markerRef.jobID)
            focusMarkerID = markerRef.jobID;
          }
        })


        articles.forEach(function(article){
          if(article.firstChild.innerHTML==focusMarkerID){
            if(!article.classList.contains("focus-article")){
              if(Home.focusedItem!=null){
                Home.focusedItem.classList.toggle("focus-article");
              }
              article.classList.toggle("focus-article");
              Home.focusedItem = article;
            }
          }
        })



        const item = marker.getElement();
        // console.log(Home.focusedMarker);

        if(Home.focusedMarker){
          const previousMarkerItem = Home.focusedMarker.getElement();
          previousMarkerItem.classList.toggle("marker-selected");
        }

        Home.focusedMarker=marker;
        if(!item.classList.contains("marker-selected")){
          item.classList.toggle("marker-selected");
        }
      });
    }
    this.updateList();
  }
  

  async mounted() {
    document.querySelector("body").classList.add("new-home-body");
    this.initMap();
    this.showJobs();
  }

  close() {
    document.querySelector("body").classList.remove("new-home-body");
  }
}

export default Home;
