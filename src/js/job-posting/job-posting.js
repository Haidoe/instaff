import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initialize } from "../../firebase.js";
import { readURL } from "../helper.js";
import {
  doc,
  setDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// import {
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

// serverTimestamp
// Timestamp.fromDate(new Date("December 10, 1815"))

const { firestore } = initialize();

let image;

postingBanner.addEventListener("change", async (e) => {
  image = e.target.files[0];
  const url = await readURL(image);
  imgTest.src = url;
});

jobPostingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const positionTitle = document.getElementById("positionTitle");
  const shiftDate = document.getElementById("shiftDate");
  const fromTime = document.getElementById("fromTime");
  const toTime = document.getElementById("toTime");
  const wage = document.getElementById("wage");

  const positionAvailable = document.getElementById("positionAvailable");
  const paymentType = document.getElementById("paymentType");
  const description = document.getElementById("description");
  const additionalInfo = document.getElementById("additionalInfo");
  const companyName = document.getElementById("companyName");
  const location = document.getElementById("location");

  const jobPosting = {
    positionTitle: positionTitle.value,
    shiftDate: shiftDate.value,
    fromTime: fromTime.value,
    toTime: toTime.value,
    wage: wage.value,
    positionAvailable: positionAvailable.value,
    paymentType: paymentType.value,
    description: description.value,
    additionalInfo: additionalInfo.value,
    companyName: companyName.value,
    location: location.value,
  };

  const jobPostingCol = collection(firestore, "jobPostings");

  const docRef = await addDoc(jobPostingCol, jobPosting);

  console.log("Document written with ID: ", docRef.id);
});
