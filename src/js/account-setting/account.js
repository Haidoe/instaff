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
export const setProfileInfo = async (data) => {
  const db = getFirestore();

  const profile = {
    ...data,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };
  const docRef = doc(db, "users", profile.id);

  updateDoc(docRef, profile)
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

// Availability =================

export const getAvailabilityByUserId = async (userId) => {
  const db = getFirestore();
  const availabilityCol = collection(db, "availability");
  const filteredAvailabilityCol = query(
    availabilityCol,
    where("userId", "==", userId)
  );
  const availabilityDocs = await getDocs(filteredAvailabilityCol);

  const result = availabilityDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};
export const updateAvailability = async (id, initialAvailability) => {
  const db = getFirestore();
  const postingDoc = doc(db, `availability/${id}`);
  const availability = {
    ...initialAvailability,
    updated: serverTimestamp(),
  };

  try {
    await setDoc(postingDoc, availability, { merge: true });
    return true;
  } catch (error) {
    console.log("Error updating availability document: ", error);
    return false;
  }
};

export const setAvailability = async (initialAvailabilityInfo) => {
  const db = getFirestore();
  console.log("saving......");

  const availability = {
    ...initialAvailabilityInfo,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const availabilityCol = collection(db, "availability");
    const docRef = await addDoc(availabilityCol, availability);

    return docRef.id;
  } catch (error) {
    console.log("Error adding availability document: ", error);
    return null;
  }
};

// Length of Shift ===============
export const getLengthOfShiftByUserId = async (userId) => {
  const db = getFirestore();
  const lengthOfShiftCol = collection(db, "lengthOfShift");
  const filteredlengthOfShiftCol = query(
    lengthOfShiftCol,
    where("userId", "==", userId)
  );
  const lengthOfShiftDocs = await getDocs(filteredlengthOfShiftCol);

  const result = lengthOfShiftDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};
export const updatelengthOfShift = async (id, initiallengthOfShift) => {
  const db = getFirestore();
  const postingDoc = doc(db, `lengthOfShift/${id}`);
  const lengthOfShift = {
    ...initiallengthOfShift,
    updated: serverTimestamp(),
  };

  try {
    await setDoc(postingDoc, lengthOfShift, { merge: true });
    return true;
  } catch (error) {
    console.log("Error updating lengthOfShift document: ", error);
    return false;
  }
};

export const setLengthOfShift = async (initialLengthOfShiftInfo) => {
  const db = getFirestore();
  console.log("saving......");

  const lengthOfShift = {
    ...initialLengthOfShiftInfo,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const lengthOfShiftCol = collection(db, "lengthOfShift");
    const docRef = await addDoc(lengthOfShiftCol, lengthOfShift);

    return docRef.id;
  } catch (error) {
    console.log("Error adding lengthOfShift document: ", error);
    return null;
  }
};
