import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// Add a job posting
export const setJobPosting = async (initialJobPosting) => {
  const db = getFirestore();

  const jobPosting = {
    ...initialJobPosting,
    status: "draft",
    paymentType: "Cash",
    province: "British Columbia",
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const jobPostingCol = collection(db, "jobPostings");
    const docRef = await addDoc(jobPostingCol, jobPosting);

    return docRef.id;
  } catch (error) {
    console.log("Error adding job posting document: ", error);
    return null;
  }
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
    return {
      ...postingSnap.data(),
      id: postingSnap.id,
    };
  } else {
    return null;
  }
};

export const publishJobPosting = async (id) => {
  const db = getFirestore();
  const postingDoc = doc(db, `jobPostings/${id}`);

  const jobPosting = {
    status: "published",
    updated: serverTimestamp(),
  };

  try {
    await updateDoc(postingDoc, jobPosting);
    return true;
  } catch (error) {
    console.log("Error updating job posting document: ", error);
    return null;
  }
};
