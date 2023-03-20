import template from "./JobMatch.html";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import {
  getProfile,
  getTypeOfWorkByUserId,
  getAvailabilityByUserId,
  getLengthOfShiftByUserId,
} from "../../js/account-setting/account";
//import { getActiveJobListingByFilter } from "../../js/job-match/jobMatch";
import getJobsAppliedByUser from "../../js/applicants/getJobsAppliedByUser";
import getAllActiveJobPostings from "../../js/job-posting/getAllActiveJobPostings";
import getSuggestJobs from "../../js/job-match";
class JobMatch extends AuthenticatedPage {
  constructor() {
    super("Job Match");
  }

  async load() {
    return template;
  }

  async init() {
    //const suggestJobs = await getActiveJobListingByFilter(this.currentUser);
    const suggestJobs = await getSuggestJobs(this.currentUser.uid);
    // ****** Show Suggested Jobs ****
    const list = document.getElementById("list"); // get a handle to list element
    list.innerHTML = "";
    for (let job of suggestJobs) {
      const li = document.createElement("li");
      
      li.innerText = `${job.positionTitle} | ${job.wageRate}/hour | ${job.address} | ${job.city}, ${job.province}`;
      list.appendChild(li);
    }
  }

  // async getSuggestJobs() {
  //   // ***** Get User Profile ****
  //   const userProfile = await getProfile(this.currentUser.uid);
  //   // ***** Get Type of Work *****
  //   const typeOfWork = await getTypeOfWorkByUserId(this.currentUser.uid);
  //   if (typeOfWork.length > 0) {
  //     typeOfWork = typeOfWork[0].positionTitle;
  //   }
  //   // ***** Get Length of Shift *****
  //   const lengthOfShift = await getLengthOfShiftByUserId(this.currentUser.uid);
  //   if (lengthOfShift.length > 0) {
  //     lengthOfShift = lengthOfShift[0].time.map((time) => ({
  //       from: changeToMins(time.from),
  //       to: changeToMins(time.to),
  //     }));
  //   }
  //   // ***** Get Availability *****
  //   const availability = await getAvailabilityByUserId(this.currentUser.uid);
  //   if (availability.length > 0) {
  //     availability = availability[0].days;
  //   }
  //   // ***** Get Applied Jobs *****
  //   const appliedJobs = await getJobsAppliedByUser(this.currentUser.uid);
  //   console.log("applicants applied job", appliedJobs);
  //   // ***** Get All Active Jobs *****
  //   const activeJobListing = await getAllActiveJobPostings();

  //   // ***** Get Filtered Jobs *****
  //   if (appliedJobs.length > 0) {
  //     activeJobListing = activeJobListing.filter(
  //       (job) => appliedJobs.indexOf(job.userId) >= 0
  //     );
  //   }

  //   if (
  //     userProfile.coordinates != undefined &&
  //     userProfile.coordinates.length > 0
  //   ) {
  //     activeJobListing = activeJobListing.map((map) => ({
  //       ...map,
  //       distance: calcCrow(map.coordinates, user.details.coordinates),
  //       from: changeToMins(moment.unix(map.time.from).format("HH:MM")),
  //       to: changeToMins(moment.unix(map.time.to).format("HH:MM")),
  //     }));
  //   }

  //   return (await activeJobListing).slice(0, 2);
  // }

  async mounted() {
    console.log(this.currentUser.uid);
    this.init();
  }
}

export default JobMatch;
