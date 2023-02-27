import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const addJobPosting = async (data) => {
  const db = getFirestore();

  const jobPosting = {
    ...data,
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

export default addJobPosting;
