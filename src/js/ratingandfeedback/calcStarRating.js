import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";


const calcStarRating = async (id) => {
  const db = getFirestore();
  const ratingCol = collection(db, "ratingAndFeedback");
  const q = query(ratingCol, where("feedbackTo", "==", id));

  try {
    const response = await getDocs(q);
    const data = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (data.length === 0) {
      return 0;
    } else {
      const ratingArray = data.map((rating) => rating.rating);
      const averageRating = ratingArray.reduce((a, b) => a + b, 0) / ratingArray.length;
      const rating = averageRating.toFixed(0);
      return rating;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};


export default calcStarRating;