import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

// Profile =======================
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
// Type Of Work ==================

export const getTypeOfWorkByUserId = async (userId) => {
  const db = getFirestore();
  const typeOfWorkCol = collection(db, "typeOfWorks");
  const filteredtypeOfWorkCol = query(
    typeOfWorkCol,
    where("userId", "==", userId)
  );
  const typeOfWorkDocs = await getDocs(filteredtypeOfWorkCol);

  const result = typeOfWorkDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};

export const updatetypeOfWork = async (id, typeOfWork) => {
  const db = getFirestore();
  const postingDoc = doc(db, `typeOfWorks/${id}`);

  try {
    await setDoc(postingDoc, typeOfWork, { merge: true });
    return true;
  } catch (error) {
    console.log("Error updating job posting document: ", error);
    return false;
  }
};

export const setTypeOfWorkInfo = async (initialTypeOfWorkInfo) => {
  const db = getFirestore();
  console.log("saving......");

  const typeOfWork = {
    ...initialTypeOfWorkInfo,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const typeOfWorkCol = collection(db, "typeOfWorks");
    const docRef = await addDoc(typeOfWorkCol, typeOfWork);

    return docRef.id;
  } catch (error) {
    console.log("Error adding job posting document: ", error);
    return null;
  }
};

// Availiability =================

export const getAvailiabilityByUserId = async (userId) => {
  const db = getFirestore();
  const availiabilityCol = collection(db, "availiability");
  const filteredtypeOfWorkCol = query(
    availiabilityCol,
    where("userId", "==", userId)
  );
  const availiabilityDocs = await getDocs(filteredAvailiabilityCol);

  const result = availiabilityDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};
export const updateAvailiability = async (id, availiability) => {
  const db = getFirestore();
  const postingDoc = doc(db, `availiability/${id}`);

  try {
    await setDoc(postingDoc, availiability, { merge: true });
    return true;
  } catch (error) {
    console.log("Error updating availiability document: ", error);
    return false;
  }
};

export const setAvailiability = async (initialAvailiabilityInfo) => {
  const db = getFirestore();
  console.log("saving......");

  const availiability = {
    ...initialAvailiabilityInfo,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const availiabilityCol = collection(db, "availiability");
    const docRef = await addDoc(availiabilityCol, availiability);

    return docRef.id;
  } catch (error) {
    console.log("Error adding availiability document: ", error);
    return null;
  }
};
