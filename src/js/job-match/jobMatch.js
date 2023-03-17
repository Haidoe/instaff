import {
  collection,
  getFirestore,
  Timestamp,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import moment from "moment";
import {
  getTypeOfWorkByUserId,
  getAvailabilityByUserId,
  getLengthOfShiftByUserId,
} from "../account-setting/account";
export const getActiveJobListingByFilter = async (user) => {
  const db = getFirestore();

  const jobCol = collection(db, "jobPostings");
  console.log(Timestamp.now());
  console.log("user", user);
  const typeOfWork = (await getTypeOfWorkByUserId(user.uid))[0].positionTitle;
  const lengthOfShift = (await getLengthOfShiftByUserId(user.uid))[0].time.map(
    (time) => ({
      from: changeToMins(time.from),
      to: changeToMins(time.to),
    })
  );
  const availability = (await getAvailabilityByUserId(user.uid))[0].days;

  console.log("availability", availability);
  console.log("lengthOfShift", lengthOfShift);
  console.log("typeOfWork", typeOfWork);
  const q = query(
    jobCol,
    where("time.from", ">", Timestamp.now()),
    orderBy("time.from", "desc")
  );

  try {
    const response = await getDocs(q);

    let mappedResponse = response.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .map((map) => ({
        ...map,
        distance: calcCrow(map.coordinates, user.details.coordinates),
        from: changeToMins(moment.unix(map.time.from).format("HH:MM")),
        to: changeToMins(moment.unix(map.time.to).format("HH:MM")),
      }))
      .map((job) => ({
        ...job,
        shift: lengthOfShift
          .filter((time) => job.from <= time.from)
          .filter((time) => job.to >= time.to)
          .map((time) => ({
            from: changeToHHMM(time.from),
            to: changeToHHMM(time.to),
          })),
      }))
      .filter((job) => typeOfWork.indexOf(job.positionTitle) >= 0) // check if position in the list
      .filter((job) => {
        return (
          availability.indexOf(
            moment.unix(job.shiftDate.seconds).format("dddd")
          ) >= 0
        );
      }) // check if shiftdate is in the days of week
      // .filter((job) => job.shift.length > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    console.log("mappedResponse", mappedResponse);
    return mappedResponse;
  } catch (error) {
    console.log("Error getting notifications: ", error);
    return null;
  }
};

// This function takes in latitude and longitude of two locations
// and returns the distance between them as the crow flies (in meters)
function calcCrow(coords1, coords2) {
  // var R = 6.371; // km
  var R = 6371000;
  var dLat = _toRad(coords2.lat - coords1.lat);
  var dLon = _toRad(coords2.lng - coords1.lng);
  var lat1 = _toRad(coords1.lat);
  var lat2 = _toRad(coords2.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

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
