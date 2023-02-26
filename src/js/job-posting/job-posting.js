import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
  getCountFromServer,
  orderBy,
} from "firebase/firestore";

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

// TODO - Delete this soon and migrate it to applicants
export const getActiveTotalApplicantsByUser = async (id) => {
  const db = getFirestore();

  const applicantsCol = collection(db, "applicants");

  const applicantQuery = query(
    applicantsCol,
    where("employerId", "==", id),
    where("status", "==", "pending")
  );

  const result = await getCountFromServer(applicantQuery);
  return result.data().count;
};

// TODO - Delete this soon and migrate it to applicants
export const getActiveTotalEmployeeToPayByUser = async (id) => {
  const db = getFirestore();

  const applicantsCol = collection(db, "applicants");

  const applicantQuery = query(
    applicantsCol,
    where("employerId", "==", id),
    where("status", "==", "completed")
  );

  const result = await getCountFromServer(applicantQuery);
  return result.data().count;
};
