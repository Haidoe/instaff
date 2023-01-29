import { initialize } from "./firebase.js";
import header from "./components/header";

const { firebaseApp } = initialize();

console.log("Haidren amalia");

const body = document.querySelector("body");

body.appendChild(header);

console.log("Hello World");
const imgEl = document.createElement("img");
imgEl.src = "/static/logo.svg";

body.appendChild(imgEl);
