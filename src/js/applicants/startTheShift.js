import { getFirestore, setDoc, doc } from "firebase/firestore";

const startTheShift = async (applicantId) => {
  const db = getFirestore();
  const applicantDoc = doc(db, "applicants", applicantId);

  try {
    const result = await setDoc(
      applicantDoc,
      { status: "started shift" },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default startTheShift;
