import { initialize } from "./firebase.js";
import header from "./components/header";
import "./router";
import "./css/normalize.css";
import "./css/global.scss";

const { firebaseApp } = initialize();

console.log("Instaff Updates");

const body = document.querySelector("body");

body.appendChild(header);
