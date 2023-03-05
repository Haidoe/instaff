import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  increment,
} from "firebase/firestore";

const addApplicant = async (applicant) => {
  const db = getFirestore();
  const applicantCol = collection(db, "applicants");
  const jobPostingDoc = doc(db, "jobPostings", applicant.jobPostingId);

  try {
    setDoc(jobPostingDoc, { numOfCandidates: increment(1) }, { merge: true });
    const applicantRef = await addDoc(applicantCol, applicant);
    return applicantRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default addApplicant;
