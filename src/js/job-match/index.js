import {
  collection,
  getFirestore,
  Timestamp,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import {
  getProfile,
  getTypeOfWorkByUserId,
  getAvailabilityByUserId,
  getLengthOfShiftByUserId,
} from "../account-setting/account";
const getSuggestJobs = async (userId) => {
  const db = getFirestore();
  // ***** Get User Profile ****
  const snap = await getProfile(userId);
  const userProfile = snap.data();

  // ***** Get Type of Work *****
  let positionTitles = [];
  let typeOfWork = await getTypeOfWorkByUserId(userId);
  if (typeOfWork.length > 0) {
    positionTitles = typeOfWork[0].positionTitle.map((v) => v.toLowerCase());
  }
  // ***** Get Length of Shift *****
  let lengthOfShift = await getLengthOfShiftByUserId(userId);
  if (lengthOfShift.length > 0) {
    lengthOfShift = lengthOfShift[0].time.map((time) => ({
      from: changeToMins(time.from),
      to: changeToMins(time.to),
    }));
  }
  // ***** Get Availability *****
  let availability = await getAvailabilityByUserId(userId);
  if (availability.length > 0) {
    availability = availability[0].days;
  }
  // ***** Get Applied Jobs *****

  const applicantsCol = collection(db, "applicants");
  const qAppliedJob = query(
    applicantsCol,
    where("userId", "==", userId),
    where("status", "==", "pending")
  );
  const response = await getDocs(qAppliedJob);

  const appliedJobdata = response.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  // ****** Get Acitve Jobs *****
  const jobCol = collection(db, "jobPostings");
  const q = query(
    jobCol,
    where("time.from", ">", Timestamp.now()),
    orderBy("time.from", "desc")
  );
  try {
    const response = await getDocs(q);

    const data = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    let jobData = data;
    // ***** Get Applicant's Applied Job(s) *****
    let appliedJobIds = [];
    if (appliedJobdata.length > 0) {
      appliedJobIds = appliedJobdata.map((appliedJob) => {
        return appliedJob.jobPostingId;
      });
      // ***** Remove Applicant's Applied Job(s) From Suggested Jobs *****
      jobData = jobData.filter((f) => {
        return !appliedJobIds.includes(f.id);
      });
    }
    // ***** Check Applicant's Address Coordinates *****
    if (
      userProfile.coordinates != undefined &&
      userProfile.coordinates.length > 0
    ) {
      jobData = jobData.map((map) => ({
        ...map,
        distance: calcCrow(map.coordinates, user.details.coordinates),
        from: changeToMins(moment.unix(map.time.from).format("HH:MM")),
        to: changeToMins(moment.unix(map.time.to).format("HH:MM")),
      }));
    }
    // ***** Check Applicant's Preferences (Shift) *****
    jobData = jobData.map((job) => ({
      ...job,
      shift: lengthOfShift
        .filter((time) => job.from <= time.from)
        .filter((time) => job.to >= time.to)
        .map((time) => ({
          from: changeToHHMM(time.from),
          to: changeToHHMM(time.to),
        })),
    }));
    // ***** Check Applicant's Preferences (Job Position Title) *****
    if (positionTitles.length > 0) {
      jobData = jobData.filter((f) => {
        return positionTitles.includes(f.positionTitle.toLowerCase());
      });
    }
    // ***** Check Applicant's Preferences (Availability) *****
    if (availability.length > 0) {
      jobData = jobData.filter((f) => {
        return availability.includes(
          moment.unix(f.shiftDate.seconds).format("dddd")
        );
      });
    }
    // ***** If No Applicant's Preferences, Merge Active Jobs *****
    let jobIds = jobData.map((job) => {
      return job.id;
    });
    let filterData = data.filter((f) => {
      return !appliedJobIds.includes(f.id);
    });
    filterData = filterData.filter((f) => {
      return !jobIds.includes(f.id);
    });
    jobData = jobData.concat(filterData);

    jobData = jobData.sort((a, b) => a.distance - b.distance);

    return jobData;
  } catch (error) {
    console.log("Error getting suggested jobs: ", error);
    return null;
  }
};

// Converts numeric degrees to radians
function _toRad(Value) {
  return (Value * Math.PI) / 180;
}

function changeToMins(timeString) {
  const time = timeString.split(":");
  return time[0] * 60 + time[1] * 1;
}

function changeToHHMM(mins) {
  return (
    parseInt(mins / 60, 10) +
    ":" +
    (mins % 60 < 10 ? "0" + (mins % 60) : mins % 60)
  );
}

export default getSuggestJobs;
