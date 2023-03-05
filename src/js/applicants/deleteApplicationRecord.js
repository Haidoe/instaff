import {
  getFirestore,
  doc,
  deleteDoc,
  setDoc,
  increment,
} from "firebase/firestore";

const deleteApplicationRecord = async (id, jobPostingId) => {
  const db = getFirestore();
  const applicantCol = doc(db, "applicants", id);
  const jobPostingDoc = doc(db, "jobPostings", jobPostingId);

  try {
    setDoc(jobPostingDoc, { numOfCandidates: increment(-1) }, { merge: true });
    await deleteDoc(applicantCol);
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default deleteApplicationRecord;
