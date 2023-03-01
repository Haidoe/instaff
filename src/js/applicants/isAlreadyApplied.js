import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const isAlreadyApplied = async (jobPostingId, userId) => {
  const db = getFirestore();

  const applicantsCol = collection(db, "applicants");

  const applicantsQuery = query(
    applicantsCol,
    where("jobPostingId", "==", jobPostingId),
    where("userId", "==", userId)
  );

  try {
    const response = await getDocs(applicantsQuery);

    const applicants = response.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    if (applicants.length > 0) {
      return applicants[0].id;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default isAlreadyApplied;
