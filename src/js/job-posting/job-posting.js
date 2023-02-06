import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
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

// TODO
// Must add filter, for date and status?
export const getAllJobPostings = async () => {
  const db = getFirestore();
  const jobPostingCol = collection(db, "jobPostings");
  const jobPostingDocs = await getDocs(jobPostingCol);

  const result = jobPostingDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};

export const getJobPostingDetail = async (id) => {
  const db = getFirestore();
  const postingDoc = doc(db, `jobPostings/${id}`);
  const postingSnap = await getDoc(postingDoc);

  if (postingSnap.exists()) {
    return postingSnap.data();
  } else {
    return null;
  }
};
