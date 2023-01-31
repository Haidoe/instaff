// Import the functions you need from the SDKs you need
import { initialize } from "../../firebase.js";
// import { config } from "./config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const { auth } = initialize();

const txtEmail = document.querySelector("#txtEmail");
const txtPassword = document.querySelector("#txtPassword");
const btnSignUp = document.querySelector("#btnSignUp");

btnSignUp.addEventListener("click", (e) => {
  let email = txtEmail.value;
  let password = txtPassword.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      alert("user signed up successfully");
      sendEmailVerification(auth.currentUser).then(() => {
        // Email verification sent!
        // ...
      });
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // ..
    });
});
