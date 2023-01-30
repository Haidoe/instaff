import { initialize } from "./firebase.js";
import header from "./components/header";
import "./router";
import "./css/normalize.css";
import "./css/global.scss";

const { firebaseApp } = initialize();

// For Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./static/service-worker.js")
    .then(function (reg) {
      console.log(`Service Worker Registered`);
    })
    .catch(function (error) {
      console.log(`Service Worker Registration Error (${error})`);
    });
}

console.log("Instaff Updates");

const body = document.querySelector("body");

body.appendChild(header);
