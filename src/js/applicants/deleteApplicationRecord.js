import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const deleteApplicationRecord = async (id) => {
  const db = getFirestore();
  const applicantCol = doc(db, "applicants", id);

  try {
    await deleteDoc(applicantCol);

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default deleteApplicationRecord;
