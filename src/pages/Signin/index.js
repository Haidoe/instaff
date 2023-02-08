import Page from "../../classes/Page";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { pageTransition } from "../../router";

class Login extends Page {
  constructor() {
    super("Sign In");
  }

  async load() {
    return `
     <div class="sign-in">
        <form>
          <div class="container">
            <h1>Sign In</h1>
            <p>Please fill in this form to sign-in.</p>

            <div class="group">
              <label for="email"><b>Email</b></label>
              <input type="text" placeholder="Enter Email" name="email" id="email" required>
            </div>

            <div class="group">
              <label><b>Password</b></label>
              <input type="password" placeholder="Password" name="psw" id="psw" required>
            </div>

            <div class="group">
              <p>Forgot password? <a href="">Reset password.</a></p>
            </div>
    
            <button type="button" id="submitData" name="submitData" class="signinbtn">Sign In</button>


          </div>
        </form>
      </div>
    `;
  }

  async preload() {
    const user = await this.getCurrentUser();

    if (user) {
      pageTransition("/");
      return false;
    }

    return true;
  }

  async mounted() {
    const auth = getAuth();
    const db = getFirestore();

    submitData.addEventListener("click", (e) => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("psw").value;

      // log in user
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;

          if (user.emailVerified) {
            pageTransition("/");
            console.log("email is verified: sign in successfully");
          } else {
            console.log("email is not verified.");
            pageTransition("/verification");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    });
  }
}

export default Login;
