import { getDoc, doc, getFirestore } from "firebase/firestore";

export const getUserDetails = async (id) => {
  const db = getFirestore();
  const userRef = doc(db, "users", id);
    
  try {
    const userSnap = await getDoc(userRef);
    return userSnap.data();
  } catch (error) {
    console.log(error);
    return false
  }
};