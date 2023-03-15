import { getFirestore, setDoc, doc } from "firebase/firestore";

const rejectApplicant = async (applicantId) => {
  const db = getFirestore();
  const applicantDoc = doc(db, "applicants", applicantId);

  try {
    await setDoc(applicantDoc, { status: "rejected" }, { merge: true });

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default rejectApplicant;
