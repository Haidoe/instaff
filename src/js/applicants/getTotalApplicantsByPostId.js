import {
  getFirestore,
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";

const getTotalApplicantsByPostId = async (id) => {
  const db = getFirestore();
  const applicantsCol = collection(db, "applicants");
  const applicantsQuery = query(applicantsCol, where("jobPostingId", "==", id));
  const result = await getCountFromServer(applicantsQuery);
  return result.data().count;
};

export default getTotalApplicantsByPostId;
