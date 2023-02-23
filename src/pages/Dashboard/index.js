import EmployerPage from "../../classes/EmployerPage";
import {
  getActiveTotalApplicantsByUser,
  getActiveTotalEmployeeToPayByUser,
  getActiveTotalJobPostingsByUser,
  getAllActiveJobPostingsByUser,
} from "../../js/job-posting/job-posting";
import template from "./dashboard.html";
import RecentJob from "./components/recent-job";
import HistoryJob from "./components/history-job";
import "./dashboard.scss";
import {
  getTotalAcceptedApplicantsByPostId,
  getTotalApplicantsByPostId,
} from "../../js/applicants";
import getPostingHistoryByUser from "../../js/job-posting/getPostingHistoryByUser";

class Dashboard extends EmployerPage {
  constructor() {
    super("Home");
  }

  async load() {
    return template;
  }

  loadBoardData() {
    getActiveTotalJobPostingsByUser(this.currentUser.uid)
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
      }
    });
  }

  async loadRecentJobsPosting() {
    const container = document.querySelector("section.recent");
    const recent = await getAllActiveJobPostingsByUser(this.currentUser.uid);

    for (const item of recent) {
      const totalApplicants = await getTotalApplicantsByPostId(item.id);
      const totalAcceptedApplicants = await getTotalAcceptedApplicantsByPostId(
        item.id
      );

      item.totalApplicants = totalApplicants;
      item.totalPositionAvailableLeft =
        item.positionAvailable - totalAcceptedApplicants;

      container.appendChild(RecentJob(item));
    }
  }

  async loadPostingHistory() {
    const total = await getPostingHistoryByUser(this.currentUser.uid);

    if (total.length > 0) {
      const container = document.querySelector(".postings aside");

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

  async mounted() {
    this.loadBoardData();
    this.loadRecentJobsPosting();
    this.loadPostingHistory();
    //Add event listeners for Submenu
    this.subMenuEvent();
  }
}

export default Dashboard;
