import template from "./JobMatch.html";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import {
  getProfile,
  getTypeOfWorkByUserId,
  getAvailabilityByUserId,
  getLengthOfShiftByUserId,
} from "../../js/account-setting/account";
import { getActiveJobListingByFilter } from "../../js/job-match/jobMatch";
class JobMatch extends AuthenticatedPage {
  constructor() {
    super("Job Match");
  }

  async load() {
    return template;
  }

  async init() {
    // const activeJobListing = await getAllActiveJobPostings();
    const typeOfWorkListing = await getTypeOfWorkByUserId(this.currentUser.uid);
    console.log(typeOfWorkListing);
    const suggestJobs = await getActiveJobListingByFilter(this.currentUser);
    console.log("suggestJobs", suggestJobs);
    const list = document.getElementById("list"); // get a handle to list element
    list.innerHTML = "";
    for (let job of suggestJobs) {
      const li = document.createElement("li");
      console.log(job.positionTitle);
      li.innerText = `${job.positionTitle} | ${job.wageRate}/hour | ${job.address} | ${job.city}, ${job.province}`;
      list.appendChild(li);
    }
  }

  async mounted() {
    console.log(this.currentUser.uid);
    // const snap = await get(this.currentUser.uid);
    // const user = snap.data();
    // this.data = user;

    this.init();
  }
}

export default JobMatch;
