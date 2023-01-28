import { initialize } from "../../../firebase.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const { firestore } = initialize();

const postingDoc = doc(firestore, "jobPostings", params.id);
const postingResponse = await getDoc(postingDoc);

// console.log(params);

console.log(postingResponse.data());
