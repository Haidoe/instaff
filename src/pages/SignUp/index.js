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
      <div class="sign-up">
      <form action="#" id="signUpForm">
      <div class="container">
      <h1>Sign Up</h1>
      <p>Please fill in this form to create an account.</p>
      <hr>
    
      <div class="group">
        <label for="displayname"><b>Name</b></label>
        <input type="text" placeholder="Enter Display Name" name="displayname" id="displayname" required>
      </div>

      <div class="group">
        <label for="email"><b>Email</b></label>
        <input type="text" placeholder="Enter Email" name="email" id="email" required>
      </div>

      <div class="group">
        <label for="psw"><b>Password</b></label>
        <input type="password" name="psw" id="psw" required>
      </div>

      <div class="group">
        <label for="typeOfUser"><b>Purpose</b></label>
        <select name="typeOfUser" id="typeOfUser">
          <option value="employee">I want to find a job.</option>
          <option value="employer">I want to hire staffs.</option>
        </select>
      </div>


      <hr>
      <p>By creating an account you agree to our <a href="#" id="termsandprivacy">Terms & Privacy</a>.</p>

      <button type="submit" id="submitData" name="submitData" class="registerbtn">Register</button>
      </div>
      <div class="group">
        <p id="output"></p>
      </div>

      <div class="container signin">
      <p>Already have an account? <a href="/sign-in">Sign in</a>.</p>
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
