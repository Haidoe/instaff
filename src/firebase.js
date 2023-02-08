import { initializeApp } from "firebase/app";

import { config } from "./config.js";

export function initialize() {
  const firebaseApp = initializeApp(config.firebase);

  return {
    firebaseApp,
  };
}
