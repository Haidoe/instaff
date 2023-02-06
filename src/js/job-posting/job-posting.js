import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

// Add a job posting
export const setJobPosting = async (initialJobPosting) => {
  const db = getFirestore();

  const jobPosting = {
    ...initialJobPosting,
    paymentType: "Cash",
    province: "British Columbia",
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  const jobPostingCol = collection(db, "jobPostings");
  const docRef = await addDoc(jobPostingCol, jobPosting);
  console.log("Document written with ID: ", docRef.id);
};
