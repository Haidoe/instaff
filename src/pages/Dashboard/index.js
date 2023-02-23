import EmployerPage from "../../classes/EmployerPage";
import {
  getActiveTotalApplicantsByUser,
  getActiveTotalEmployeeToPayByUser,
  getActiveTotalJobPostingsByUser,
  getAllActiveJobPostingsByUser,
} from "../../js/job-posting/job-posting";
import template from "./dashboard.html";
import RecentJob from "./components/recent-job";
import "./dashboard.scss";
import {
  getTotalAcceptedApplicantsByPostId,
  getTotalApplicantsByPostId,
} from "../../js/applicants";

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

    // const addedExtraInfo = recent.map(async (item) => {
    //   const totalApplicants = await getTotalApplicantsByPostId(item.id);
    //   const totalAcceptedApplicants = await getTotalAcceptedApplicantsByPostId(
    //     item.id
    //   );

    //   console.log(totalApplicants);

    //   return {
    //     totalApplicants,
    //     totalAcceptedApplicants:
    //       item.positionAvailable - totalAcceptedApplicants,
    //     ...item,
    //   };
    // });

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

    console.log(recent);

    // console.log(addedExtraInfo);

    // for (const item of addedExtraInfo) {
    //   container.appendChild(RecentJob(item));
    // }
  }

  async mounted() {
    // // Page is loaded
    // const articleImg = document.querySelector("#articleTest img");

    // articleImg.src = "/static/images/1.png";

    // const articleImg2 = document.querySelector("#articleTest2 img");

    // articleImg2.src = "/static/images/2.png";

    // const articleImg3 = document.querySelector("#articleTest3 img");

    // articleImg3.src = "/static/images/3.png";

    // const articleImg4 = document.querySelector("#articleTest4 img");

    // articleImg4.src = "/static/images/3.png";

    // const articleImg5 = document.querySelector("#articleTest5 img");

    // articleImg5.src = "/static/images/2.png";

    // const applicantImage = document.querySelector(".applicant img");

    // applicantImage.src = "/static/images/sample.jpg";

    // const applicantImage2 = document.querySelector(
    //   ".applicant:nth-of-type(2) img"
    // );

    // applicantImage2.src = "/static/images/sample.jpg";

    // const applicantImage3 = document.querySelector(
    //   ".applicant:nth-of-type(3) img"
    // );

    // applicantImage3.src = "/static/images/sample.jpg";

    this.loadBoardData();
    this.loadRecentJobsPosting();
    //Add event listeners for Submenu
    this.subMenuEvent();
  }
}

export default Dashboard;
