import {
  getFirestore,
  query,
  where,
  getCountFromServer,
  Timestamp,
  collection,
} from "firebase/firestore";

export const getTotalActiveJobPostingByUser = async (id) => {
  const db = getFirestore();
  const jobPostingCol = collection(db, "jobPostings");
  const JobPostingQuery = query(
    jobPostingCol,
    where("userId", "==", id),
    where("time.from", ">", Timestamp.now())
  );

  const result = await getCountFromServer(JobPostingQuery);

  return result.data().count;
};

export default getTotalActiveJobPostingByUser;
