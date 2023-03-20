import {
  getDocs,
  query,
  where,
  collection,
  getFirestore,
} from "firebase/firestore";

const getFeedbackRatingByUser = async (userId = "") => {
  const db = getFirestore();
  const q = query(
    collection(db, "ratingAndFeedback"),
    where("feedbackTo", "==", userId)
  );
  const querySnapshot = await getDocs(q);

  const ratingAndFeedback = querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
    };
  });

  const rating = ratingAndFeedback.reduce((acc, curr) => {
    return acc + (curr.rating ?? 0);
  }, 0);

  return {
    feedbacks: ratingAndFeedback,
    total: ratingAndFeedback.length,
    rating: rating ? rating / ratingAndFeedback.length : 0,
  };
};

export default getFeedbackRatingByUser;
