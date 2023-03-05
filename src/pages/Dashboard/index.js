import EmployerPage from "../../classes/EmployerPage";
import {
  getActiveTotalApplicantsByUser,
  getActiveTotalEmployeeToPayByUser,
} from "../../js/job-posting/job-posting";
import template from "./dashboard.html";
import RecentJob from "./components/recent-job";
import HistoryJob from "./components/history-job";
import ApplicantBox from "./components/applicant-box";
import "./dashboard.scss";
import {
  getTotalAcceptedApplicantsByPostId,
  getTotalApplicantsByPostId,
} from "../../js/applicants";
import getPostingHistoryByUser from "../../js/job-posting/getPostingHistoryByUser";
import getAllActiveJobPostingByUser from "../../js/job-posting/getAllActiveJobPostingByUser";
import getTotalActiveJobPostingByUser from "../../js/job-posting/getTotalActiveJobPostingByUser";
import pubsub from "../../classes/PubSub";
import globalState from "../../classes/GlobalState";

class Dashboard extends EmployerPage {
  constructor() {
    super("Home");
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

    getActiveTotalEmployeeToPayByUser(this.currentUser.uid)
      .then((total) => {
        const applicants = document.querySelector("#box-applicants p");
        applicants.textContent = total;
      })
      .catch((error) => {
        console.log(error);
      });

    getActiveTotalApplicantsByUser(this.currentUser.uid)
      .then((total) => {
        const toPay = document.querySelector("#box-pending-payments p");
        toPay.textContent = total;
      })
      .catch((error) => {
        console.log(error);
      });
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

    for (const item of recent) {
      const totalApplicants = await getTotalApplicantsByPostId(item.id);
      const totalAcceptedApplicants = await getTotalAcceptedApplicantsByPostId(
        item.id
      );

      item.totalApplicants = totalApplicants;
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
      });

      container.appendChild(recentJob);
    }

    if (recent.length) {
      const data = recent[0];
      this.loadJobListingDetails(data);
      this.loadApplicants();

      const jobDetailsContainer = document.querySelector(
        "section.recent-job-posting-content section.content"
      );

      jobDetailsContainer.classList.add("show");
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
    jpTotalApplicants.textContent = data.totalApplicants;
    jpPositionAvailableLeft.textContent = data.totalPositionAvailableLeft;
    jpPositionAvailable.textContent = data.positionAvailable;

    const previousActiveJob = document.querySelector(
      "aside .recent article.active"
    );

    if (previousActiveJob) {
      previousActiveJob.classList.remove("active");
      this.loadApplicants();
    }

    const recentJobContainer = document.querySelector(`#jp-${data.id}`);
    recentJobContainer.classList.add("active");
  }

  async loadPostingHistory() {
    const total = await getPostingHistoryByUser(this.currentUser.uid);

    if (total.length > 0) {
      const container = document.querySelector(
        "section.recent-job-posting-content"
      );

      const history = document.createElement("section");
      history.className = "history";

      const historyTitle = document.createElement("h3");
      historyTitle.textContent = "History";

      history.appendChild(historyTitle);
      container.appendChild(history);

      for (const item of total) {
        history.appendChild(HistoryJob(item));
      }
    }
  }

  async loadApplicants() {
    const container = document.querySelector("div.applicants");
    container.innerHTML = "";

    const applicants = Math.round(Math.random());

    if (applicants) {
      for (let i = 0; i < 4; i++) {
        const applicant = new ApplicantBox({});
        container.appendChild(applicant.toElement());
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
  }

  close() {
    document.querySelector("#app").classList.remove("dashboard-app");
    pubsub.publish("mainHeaderHideBackBtn");
    window.removeEventListener("popstate", this.popStateListener);
    pubsub.unsubscribe("mainHeaderBackBtnClicked");
  }
}

export default Dashboard;
