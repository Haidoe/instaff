import { serverTimestamp, collection, addDoc, getFirestore } from "firebase/firestore";


export const addRatingAndFeedback = async (ratingandfeedback) => {

  const db = getFirestore();
  try {
      const ratingAndFeedbackRef = await addDoc(collection(db, "ratingAndFeedback"), {
      ...ratingandfeedback,
      created: serverTimestamp(),
      updated: serverTimestamp(),
      deleted: null
      });
    
    return ratingAndFeedbackRef.id;
  } catch (error) {
    console.log(error);
    return null;
  }
  
}