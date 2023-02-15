import { getAuth, signOut } from "firebase/auth";
import { pageTransition } from "../router";

class Page {
  #user = null;

  constructor(title) {
    this.title = title;
    this.setDocumentTitle();
  }

  setDocumentTitle() {
    document.title = `${this.title} | Instaff`;
  }

  get currentUser() {
    return this.#user;
  }

  set currentUser(user) {
    this.#user = user;
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
}

export default Page;
