import { getAuth, signOut } from "firebase/auth";
import { pageTransition } from "../router";
import GlobalState from "./GlobalState";
class Page {
  #user = null;

  constructor(title) {
    this.title = title;
    this.isClosed = false;
    this.setDocumentTitle();
  }

  setDocumentTitle() {
    if (this.title === "Home") {
      document.title = "Instaff | Hire Instantly!";
    } else {
      document.title = `${this.title} | Instaff | Hire Instantly!`;
    }
  }

  get currentUser() {
    return this.#user;
  }

  set currentUser(user) {
    this.#user = user;
    GlobalState.user = user;
  }

  async signOutUser() {
    const auth = getAuth();
    const result = await signOut(auth);
    pageTransition("/");
  }

  getCurrentUser() {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        resolve(user);
      }, reject);
    });
  }

  //Must always return true
  //You may return false or undefined if you desire redirection
  async preload() {
    return true;
  }

  async load() {
    return "";
  }

  async mounted() {}

  close() {
    console.log(`${this.title} Page Closed`);
  }

  async fallback() {}
}

export default Page;
