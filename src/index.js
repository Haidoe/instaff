import { initialize } from "./firebase.js";
import { router, pageTransition } from "./router";
import MainHeader from "./components/header";
import "./css/normalize.css";
import "./css/global.scss";

//Initialize Firebase App
const firebaseApp = initialize();

//Disabling the service worker in the development
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
