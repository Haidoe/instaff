import { initialize } from "./firebase.js";
import header from "./components/header";
import { router, pageTransition } from "./router";
import "./css/normalize.css";
import "./css/global.scss";

//This is For Router
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    pageTransition(e.target.href);
  }
});

window.addEventListener("popstate", router);

router();

const { firebaseApp } = initialize();

// For Service Worker
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("./static/service-worker.js")
//     .then(function (reg) {
//       console.log(`Service Worker Registered`);
//     })
//     .catch(function (error) {
//       console.log(`Service Worker Registration Error (${error})`);
//     });
// }

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

console.log("Instaff Updates");

const body = document.querySelector("body");

body.appendChild(header);
