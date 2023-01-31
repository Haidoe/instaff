// Import the functions you need from the SDKs you need
import { initialize } from "../../firebase.js";
// import { config } from "./config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const { auth } = initialize();

const txtEmail = document.querySelector("#txtEmail");
const txtPassword = document.querySelector("#txtPassword");
const btnSignIn = document.querySelector("#btnSignIn");

btnSignIn.addEventListener("click", (e) => {
  let email = txtEmail.value;
  let password = txtPassword.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      alert("user signed in successfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      alert(errorMessage);
    });
});
