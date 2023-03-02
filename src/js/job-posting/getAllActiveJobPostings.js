import {
  getFirestore,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const getAllActiveJobPostings = async () => {
  const db = getFirestore();
  const col = collection(db, "jobPostings");
  const q = query(
    col,
    where("time.from", ">", Timestamp.now()),
    orderBy("time.from", "desc")
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

export default getAllActiveJobPostings;
