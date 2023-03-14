import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const addNotification = async (notification) => {
  const db = getFirestore();
  const notifCol = collection(db, "notifications");

  try {
    const notifDoc = await addDoc(notifCol, {
      ...notification,
      read: false,
      created: serverTimestamp(),
    });

    return notifDoc.id;
  } catch (e) {
    console.error("Error adding notification: ", e);
    return null;
  }
};

export const getNotificationPerUser = async (userId) => {
  const db = getFirestore();
  const notifCol = collection(db, "notifications");
  const q = query(
    notifCol,
    where("userId", "==", userId),
    orderBy("created", "desc")
  );

  try {
    const response = await getDocs(q);

    const mappedResponse = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return mappedResponse;
  } catch (error) {
    console.log("Error getting notifications: ", error);
    return null;
  }
};
