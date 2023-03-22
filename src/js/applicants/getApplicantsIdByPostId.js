import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const getApplicantsIdByPostId = async (jobId, userId) => {
  const db = getFirestore();
  const applicantsCol = collection(db, "applicants");
  const applicantsQuery = query(applicantsCol, where("jobPostingId", "==", jobId), where("userId", "==", userId));

  try {
    const response = await getDocs(applicantsQuery);

    const applicants = response.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return applicants;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getApplicantsIdByPostId;
