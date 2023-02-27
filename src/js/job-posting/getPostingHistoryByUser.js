import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

const getPostingHistoryByUser = async (userId) => {
  const db = getFirestore();
  const col = collection(db, "jobPostings");

  const q = query(
    col,
    where("userId", "==", userId),
    where("time.to", "<", Timestamp.now()),
    orderBy("time.to", "desc"),
    limit(3)
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

export default getPostingHistoryByUser;
