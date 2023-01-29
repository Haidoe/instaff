import { initialize } from "./firebase.js";
import header from "./components/header";

const { firebaseApp } = initialize();

console.log("Instaff Updates");

const body = document.querySelector("body");

body.appendChild(header);

const imgEl = document.createElement("img");
imgEl.src = "/static/logo.svg";

body.appendChild(imgEl);
