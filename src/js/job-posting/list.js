import { initialize } from "../../firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const { firestore } = initialize();

const jobPostingCol = collection(firestore, "jobPostings");

const jobPostingQuery = await query(
  jobPostingCol,
  where("positionTitle", "!=", "xCleaner")
);

const jobPostingDocs = await getDocs(jobPostingQuery);

// const result = jobPostingDocs.map((doc) => doc.data());

jobPostingDocs.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});

console.log(jobPostingDocs);

const result = jobPostingDocs.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

const ulList = document.querySelector("#jobPostings");

result.forEach((item) => {
  ulList.innerHTML += `<div>
    <a href="job-posting.html?id=${item.id}">
      ${item.positionTitle} | ${item.location} 
    </a>
  </div>`;
});
