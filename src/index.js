import { initialize } from "./firebase.js";
import { router, pageTransition } from "./router";
import MainHeader from "./components/header";
import "./css/normalize.css";
import "./css/global.scss";
import Notifications from "./components/notification";
import registerServiceWorker from "./service-worker-registration.js";
import globalState from "./classes/GlobalState.js";

//Initialize Firebase App
const firebaseApp = initialize();

//This is For Router
document.body.addEventListener("click", (e) => {
  //Avoid redirecting to the same page
  if (e.target.href && e.target.href === window.location.href) {
    e.preventDefault();
    return;
  }

  //This is to avoid the logo image redirection
  if (e.target.matches("[alt='Instaff Logo']")) {
    e.preventDefault();
    if (window.location.pathname === "/") return;
  }

  //This is for the sign out button
  if (e.target.matches("[data-signout]")) {
    e.preventDefault();
  } else if (e.target.matches("[data-link]")) {
    e.preventDefault();
    pageTransition(e.target.href || "/");
  }
});

window.addEventListener("popstate", router);

router();

const mainHeader = new MainHeader();
mainHeader.wrapper = document.querySelector("body");
mainHeader.render();

//This is for the notification
const notification = new Notifications();

window.addEventListener("offline", () => {
  pageTransition("/offline");
});

window.addEventListener("online", () => {
  setTimeout(() => {
    if (globalState.user?.details.typeOfUser === "employer") {
      pageTransition("/dashboard");
    } else {
      pageTransition("/");
    }
  }, 1000);
});

registerServiceWorker();

console.log(process.env.NODE_ENV);
