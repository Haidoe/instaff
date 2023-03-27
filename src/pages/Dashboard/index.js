import EmployerPage from "../../classes/EmployerPage";
import template from "./dashboard.html";
import RecentJob from "./components/recent-job";
import ApplicantBox from "./components/applicant-box";
import "./dashboard.scss";
import {
  getTotalAcceptedApplicantsByPostId,
  getApplicantsByPostId,
} from "../../js/applicants";
import getAllActiveJobPostingByUser from "../../js/job-posting/getAllActiveJobPostingByUser";
import getTotalActiveJobPostingByUser from "../../js/job-posting/getTotalActiveJobPostingByUser";
import pubsub from "../../classes/PubSub";
import globalState from "../../classes/GlobalState";
import RealTimeApplicants from "../../js/applicants/realTimeApplicantsByJobPostingId";

class Dashboard extends EmployerPage {
  constructor() {
    super("Home");

    this.realTimeApplicants = null;
    this.activeJobPosting = null;
  }

  async load() {
    return template;
  }

  loadBoardData() {
    getTotalActiveJobPostingByUser(this.currentUser.uid)
      .then((total) => {
        const boxPostedJobs = document.querySelector("#box-posted-jobs p");
        boxPostedJobs.textContent = total;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadBoardTotalApplicants(data) {
    const applicants = document.querySelector("#box-applicants p");

    const totalNumOfApplicants = data.reduce((acc, curr) => {
      return acc + (curr.numOfCandidates ?? 0);
    }, 0);

    applicants.textContent = totalNumOfApplicants;
  }

  // TODO - Refactor this -- add event listener to the specific element [posted and payable]
  subMenuEvent() {
    // Refactory This
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-submenu]")) {
        e.preventDefault();

        const previousActiveMenu = document.querySelector(
          ".postings nav li.active"
        );
        previousActiveMenu.classList.remove("active");
        e.target.parentElement.classList.add("active");

        // Check if the same menu is clicked
        if (
          previousActiveMenu.children[0].dataset.submenu ===
          e.target.dataset.submenu
        ) {
          return;
        }

        console.log("ITS NOT THE SAME");

        const pageContentRecent = document.querySelector(
          ".page-contents section.recent-job-posting-content"
        );
        const pageContentHistory = document.querySelector(
          ".page-contents section.history"
        );
        const pageContentCompleted = document.querySelector(
          ".page-contents section.completed"
        );

        if (e.target.dataset.submenu === "active-jobs") {
          pageContentRecent.classList.remove("hidden");
          pageContentHistory.classList.add("hidden");
          pageContentCompleted.classList.add("hidden");
        } else if (e.target.dataset.submenu === "completed-jobs") {
          pageContentRecent.classList.add("hidden");
          pageContentHistory.classList.add("hidden");
          pageContentCompleted.classList.remove("hidden");
        } else {
          pageContentRecent.classList.add("hidden");
          pageContentHistory.classList.remove("hidden");
          pageContentCompleted.classList.add("hidden");
        }
      }
    });
  }

  async loadRecentJobsPosting() {
    const container = document.querySelector("aside .recent");

    const recent = await getAllActiveJobPostingByUser(this.currentUser.uid);

    this.loadBoardTotalApplicants(recent);

    for (const item of recent) {
      const totalAcceptedApplicants = await getTotalAcceptedApplicantsByPostId(
        item.id
      );

      item.totalPositionAvailableLeft =
        item.positionAvailable - totalAcceptedApplicants;

      const recentJob = RecentJob(item);

      recentJob.addEventListener("click", () => {
        this.loadJobListingDetails(item);
        pubsub.publish("mainHeaderShowBackBtn");
        const mainPageContainer = document.querySelector(".dashboard-page");
        mainPageContainer.classList.add("db-page-mobile");

        if (window.innerWidth < 768) {
          window.scrollTo(0, 0);
          globalState.preventPopState = true;
        }

        const jobDetailsContainer = document.querySelector(
          "section.recent-job-posting-content section.content"
        );

        jobDetailsContainer.classList.add("show");
      });

      container.appendChild(recentJob);
    }

    if (recent.length) {
      const data = recent[0];
      this.loadJobListingDetails(data);
      this.loadApplicants(data);

      const jobDetailsContainer = document.querySelector(
        "section.recent-job-posting-content section.content"
      );

      jobDetailsContainer.classList.add("loaded");
    }
  }

  loadJobListingDetails(data) {
    const jpCompanyName = document.querySelector("#jpCompanyName");
    const jpTitle = document.querySelector("#jpTitle");
    const jpWageRate = document.querySelector("#jpWageRate");
    const jpTotalApplicants = document.querySelector("#jpTotalApplicants");
    const jpPositionAvailableLeft = document.querySelector(
      "#jpPositionAvailableLeft"
    );
    const jpPositionAvailable = document.querySelector("#jpPositionAvailable");

    jpCompanyName.textContent = data.companyName;
    jpTitle.textContent = data.positionTitle;
    jpWageRate.textContent = data.wageRate;
    jpTotalApplicants.textContent = data.numOfCandidates ?? 0;
    jpPositionAvailableLeft.textContent = data.totalPositionAvailableLeft;
    jpPositionAvailable.textContent = data.positionAvailable;

    const previousActiveJob = document.querySelector(
      "aside .recent article.active"
    );

    if (previousActiveJob) {
      previousActiveJob.classList.remove("active");
      this.loadApplicants(data);
    }

    const recentJobContainer = document.querySelector(`#jp-${data.id}`);
    recentJobContainer.classList.add("active");
  }

  async loadApplicants(jobPosting) {
    this.activeJobPosting = jobPosting;
    const container = document.querySelector("div.applicants");
    container.innerHTML = "";

    this.realTimeApplicants?.unsubscribe();
    this.realTimeApplicants = new RealTimeApplicants(jobPosting.id);
    this.realTimeApplicants.subscribe(this.handleLoadApplicants.bind(this));
  }

  handleLoadApplicants(applicants) {
    console.log("Applicants", applicants);
    const container = document.querySelector("div.applicants");

    const totalApplicants = document.querySelector("#jpTotalApplicants");
    totalApplicants.textContent = applicants.length;

    const totalApplicantsAside = document.querySelector(
      `#jp-${this.activeJobPosting.id} .applied-candidates span`
    );

    totalApplicantsAside.textContent = applicants.length;

    container.innerHTML = "";

    if (applicants.length) {
      for (const applicant of applicants) {
        const applicantBox = new ApplicantBox(applicant, this.activeJobPosting);
        container.appendChild(applicantBox.toElement());
      }
    } else {
      const noApplicants = document.createElement("div");
      noApplicants.className = "no-applicants";
      noApplicants.textContent = "No applicants yet.";
      container.appendChild(noApplicants);
    }
  }

  popStateListener(e) {
    const mainPageContainer = document.querySelector(".dashboard-page");
    mainPageContainer.classList.remove("db-page-mobile");
    pubsub.publish("mainHeaderHideBackBtn");

    const jobDetailsContainer = document.querySelector(
      "section.recent-job-posting-content section.content"
    );

    jobDetailsContainer?.classList.remove("show");
  }

  async mounted() {
    document.querySelector("#app").classList.add("dashboard-app");

    this.loadBoardData();
    this.loadRecentJobsPosting();

    //Add event listeners for Submenu
    this.subMenuEvent();

    //Just to make sure Active Menu is set to Dashboard
    const dashboardMenu = document.querySelector(
      ".main-header a[href='/dashboard']"
    );

    dashboardMenu.classList.add("active-menu-item");

    //PubSub for Mobile Related Stuff
    pubsub.subscribe("mainHeaderBackBtnClicked", this.popStateListener);
    window.addEventListener("popstate", this.popStateListener);

    //Event Listener for Floating Icon
    const floatingIcon = document.querySelector(".floating-icon");
    floatingIcon.addEventListener("click", () => {
      //This is to make that no one can prevent the popstate event
      globalState.preventPopState = false;
    });
  }

  close() {
    document.querySelector("#app").classList.remove("dashboard-app");
    pubsub.publish("mainHeaderHideBackBtn");
    window.removeEventListener("popstate", this.popStateListener);
    pubsub.unsubscribe("mainHeaderBackBtnClicked", this.popStateListener);
    this.realTimeApplicants?.unsubscribe();

    //Just to make sure Active Menu is set to Dashboard
    const dashboardMenu = document.querySelector(
      ".main-header a[href='/dashboard']"
    );

    dashboardMenu?.classList.remove("active-menu-item");
  }
}

export default Dashboard;
