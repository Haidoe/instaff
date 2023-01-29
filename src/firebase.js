import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { config } from "./config.js";

export function initialize() {
  const firebaseApp = initializeApp(config.firebase);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage();

  return {
    firebaseApp,
    auth,
    firestore,
    storage,
  };
}
