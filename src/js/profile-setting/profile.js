import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const setProfileInfo = async (initialProfileInfo) => {
  const db = getFirestore();
  console.log("saving......");
  const docRef = doc(db, "users", initialProfileInfo.id);

  updateDoc(docRef, initialProfileInfo)
    .then((ref) => console.log("Document written with ID "))
    .catch((error) => console.error(error));
};

export const getProfile = async (profileId) => {
  const db = getFirestore();
  const profileRef = doc(db, "users", profileId);
  const pofileSnap = await getDoc(profileRef);
  return pofileSnap;
};
