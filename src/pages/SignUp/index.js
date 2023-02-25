import Page from "../../classes/Page";
import "./signup.scss";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

class SignUp extends Page {
  constructor() {
    super("SignUp");
  }

  async load() {
    return `
      <div class="sign-up gradient-bg">
      <img src="./static/instaff-logo-white.svg" alt="instaff logo" class="logo">
      <form action="#" id="signUpForm" class= "center-form">
      <div class="container center-form">
      <h1>Create an account </h1>
 
    
      <div class="group ">
        <label for="displayname">Name</label>
        <input type="text" placeholder="Enter Display Name" name="displayname" id="displayname" required>
      </div>

      <div class="group">
        <label for="email">Email</label>
        <input type="text" placeholder="Enter Email" name="email" id="email" required>
      </div>

      <div class="group">
        <label for="psw">Password</label>
        <input type="password" name="psw" id="psw" required>
      </div>

      <div class="group">
        <label for="typeOfUser">Purpose</label>
        <select name="typeOfUser" id="typeOfUser">
          <option value="employee">I want to find a job.</option>
          <option value="employer">I want to hire staffs.</option>
        </select>
      </div>

      <button type="submit" id="submitData" name="submitData" class="button-white lock-bottom">Register</button>
      </div>
      <div class="group">
        <p id="output"></p>
      </div>

  </form>
</div>
    `;
  }

  
  
  async mounted() {
    const auth = getAuth();
    const db = getFirestore();
    const submitBtn = document.querySelector("#submitData");
    const form = document.querySelector("#signUpForm");


    form.addEventListener("submit", (e) => {
      let email = document.querySelector("#email").value;
      let password = document.querySelector("#psw").value;
      let typeOfUser = document.querySelector("#typeOfUser").value;
      let displayName = document.querySelector("#displayname").value;

      //display "loading" on submit button when clicked
      e.preventDefault();
      submitBtn.innerHTML = `<div>Loading...</div>`;
    

      createUserWithEmailAndPassword(auth, email, password)
        
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          // ...
          console.log(user);
        
          sendEmailVerification(auth.currentUser).then(() => {
            output.innerHTML = `<div>Welcome to Instaff.</div>
            <div>We're happy you signed up.</div>
            <div>start exploring the app, please confirm your email address.</div>`;

            console.log("Email sent");
            submitBtn.innerHTML = `<div>Sign in</div>`;
          });
          
          
          //calling the collection
          const userCol = doc(db, "users", user.uid);

          setDoc(userCol, {
            typeOfUser: typeOfUser,
            displayName: displayName,
          });
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          alert(errorMessage);
        });
    });
  }
}

export default SignUp;
