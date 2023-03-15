import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";


const getJobsAppliedByUser = async (id) => {
  
  const db = getFirestore();
  const applicantsCol = collection(db, "applicants");
  const q = query(
    applicantsCol,
    where("userId", "==", id),
    where("status", "==", "pending"),
  );

  try {
    const response = await getDocs(q);

    const data = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;

  } catch (error) {
    console.log(error);
    return [];
  }
};



export default getJobsAppliedByUser;