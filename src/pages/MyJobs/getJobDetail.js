import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  documentId
} from "firebase/firestore";

const getJobDetail = async (jobId) => {
  const db = getFirestore();
  const jobsCol = collection(db, "jobPostings");
  const q = query(
    jobsCol,
    where(documentId(), "==", jobId),);
  
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
    
export default getJobDetail;