import { getFirestore, setDoc, doc } from "firebase/firestore";

const cancelHiredApplicant = async (applicantId) => {
  const db = getFirestore();
  const applicantDoc = doc(db, "applicants", applicantId);

  try {
    const result = await setDoc(
      applicantDoc,
      { status: "pending" },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default cancelHiredApplicant;
