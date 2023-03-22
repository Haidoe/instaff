import template from "./my-jobs.html";
import "./my-jobs.scss";
import {
  Timestamp,
} from "firebase/firestore";
import getJobsAppliedByUser from "../../js/applicants/getJobsAppliedByUser";
import getJobDetail from "./getJobDetail";
import getJobsHiredByUser from "../../js/applicants/getJobsHiredByUser";
import createJobBoxElement from "./components/createJobBoxElement";
import createJobBoxMainElement from "./components/createJobBoxMainElement";
import createJobBoxMainElementApplied from "./components/createJobBoxMainElementApplied";
import deleteApplicationRecord from "../../js/applicants/deleteApplicationRecord";

import { getProfile } from "../../js/account-setting/account";
import EmployeePage from "../../classes/EmployeePage";
import pubsub from "../../classes/PubSub";

import globalState from "../../classes/GlobalState";

class MyJobs extends EmployeePage {
  constructor() {
    super("My Jobs");
  }

  async load() {
    return template;
  }

  async loadactiveJobSection() {
    const hiredJobsIdCol = await getJobsHiredByUser(this.profileId);

    const hiredJobsIdArray = hiredJobsIdCol.map((job) => job.jobPostingId);

    const hiredJobsDetailArray = [];
    for (const jobId of hiredJobsIdArray) {
      const hiredJobsDetail = await getJobDetail(jobId);
      hiredJobsDetailArray.push(hiredJobsDetail);
    }

    const hiredJobsCol = hiredJobsDetailArray.flat();

    //filter out hired jobs that are expired
    const hiredJobsColFiltered = hiredJobsCol.filter((job) => {
      return job.time.to.toDate() > Timestamp.now().toDate();
    });

    //render active jobs to active job section aside
    const activeJobSection = document.querySelector(".active-section");
    createJobBoxElement(hiredJobsColFiltered, activeJobSection);

    //render active jobs to active job section main
    const mainContent = document.querySelector(".main-content");
    createJobBoxMainElement(
      hiredJobsColFiltered,
      mainContent,
      "Your active jobs",
      "primary-button",
      "Start the shift"
    );

    if (hiredJobsColFiltered.length > 0) {
      const job = hiredJobsColFiltered[0];

      const content = document.querySelector(`#job-${job.id}`);
      content.classList.add("show");
    }
  }

  async loadappliedJobSection() {
    const getAppliedJobsCol = await getJobsAppliedByUser(this.profileId);

    //extract jobPostingId from getAppliedJobsCol
    const getAppliedJobsIdArray = getAppliedJobsCol.map(
      (job) => job.jobPostingId
    );

    //get job details from jobPostings collection and push job details into array
    const appliedJobsDetailArray = [];

    for (const jobId of getAppliedJobsIdArray) {
      const appliedJobsDetail = await getJobDetail(jobId);
      appliedJobsDetailArray.push(appliedJobsDetail);
    }

    //flatten array
    const appliedJobsColByUser = appliedJobsDetailArray.flat();

    //filter out applied jobs that are expired
    const appliedJobsColByUserFiltered = appliedJobsColByUser.filter((job) => {
      return job.time.to.toDate() > Timestamp.now().toDate();
    });

    //render applied jobs to aside
    const appliedJobSection = document.querySelector(".applied-section");
    createJobBoxElement(appliedJobsColByUserFiltered, appliedJobSection);

    //render applied jobs to active job section main
    const mainContent = document.querySelector(".main-content");
    createJobBoxMainElementApplied(
      appliedJobsColByUserFiltered,
      mainContent,
      "Your applied jobs",
      "primary-button",
      "Cancel application",
      this.profileId,
    );


    const jobMainButton = document.querySelector(".job-main-button");
    jobMainButton.addEventListener("click", async (e) => {
      deleteApplicationRecord(this.profileId, e.target.dataset.jobid);
    });


    //hide button
    // const button = appliedJobSectionMain.querySelectorAll("button");
    // button.forEach((btn) => {
    //   btn.classList.add("hide");
    // });
  }

  async backToMain() {
    pubsub.subscribe("mainHeaderBackBtnClicked", this.backToMainBtnListener);
  }

  backToMainBtnListener() {
    const mainContent = document.querySelector(".main-content");
    mainContent.classList.remove("show");
    const mainBox = document.querySelector(".main-content div.show");
    mainBox?.classList.remove("show");
    console.log("back to main");
    pubsub.publish("mainHeaderHideBackBtn");
  }

  async mounted() {
    document.querySelector("body").classList.add("my-jobs-body");
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;

    this.loadactiveJobSection();
    this.loadappliedJobSection();
    this.backToMain();
  }

  close() {
    document.querySelector("body").classList.remove("my-jobs-body");
    pubsub.unsubscribe("mainHeaderBackBtnClicked", this.backToMainBtnListener);
    pubsub.publish("mainHeaderHideBackBtn");
  }
}

export default MyJobs;
