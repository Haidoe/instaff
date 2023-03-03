import { getFirestore, collection, addDoc } from "firebase/firestore";

const addApplicant = async (applicant) => {
  const db = getFirestore();
  const applicantCol = collection(db, "applicants");

  try {
    const applicantRef = await addDoc(applicantCol, applicant);
    return applicantRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default addApplicant;
