import { getFirestore, setDoc, doc } from "firebase/firestore";

const hireApplicant = async (applicantId) => {
  const db = getFirestore();
  const applicantDoc = doc(db, "applicants", applicantId);

  try {
    const result = await setDoc(
      applicantDoc,
      { status: "hired" },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default hireApplicant;
