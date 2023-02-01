import { initialize } from "./firebase.js";
import { router, pageTransition } from "./router";
import "./css/normalize.css";
import "./css/global.scss";

//Initialize Firebase App
const firebaseApp = initialize();

console.log("ENV", process.env.INSTAFF_MODE);

if (process.env.INSTAFF_MODE !== "development") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

//This is For Router
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    pageTransition(e.target.href);
  }
});

window.addEventListener("popstate", router);

router();
