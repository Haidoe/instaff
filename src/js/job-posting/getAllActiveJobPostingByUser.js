import {
  getFirestore,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const getAllActiveJobPostingByUser = async (id) => {
  const db = getFirestore();
  const col = collection(db, "jobPostings");
  const q = query(
    col,
    where("userId", "==", id),
    where("time.from", ">", Timestamp.now()),
    orderBy("time.from", "desc")
  );

  try {
    const response = await getDocs(q);

    const data = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //sort by created date
    const sortedData = data.sort((a, b) => {
      return b.created.seconds - a.created.seconds;
    });

    return sortedData;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getAllActiveJobPostingByUser;
