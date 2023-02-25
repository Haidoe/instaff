import Page from "../../classes/Page";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "./signin.scss";
import { pageTransition } from "../../router";
import pubsub from "../../classes/PubSub";

class Login extends Page {
  constructor() {
    super("Sign In");
  }

  async load() {
    return `
     <div class="sign-in-page">
      <div class="inner-wrapper gradient-bg">
          <div class="left-col">
          </div>
          <div class="right-col">
            <img src="./static/instaff-logo-light-full-text.svg" alt="instaff logo" class="logo">
            <form action="#" id="signInForm" class= "signup-signin-form">
              <div class="container center-form">
              <h1>Log In</h1>

                    <div class="group input-group-2cols">
                      <label for="email">Email address</label>
                      <input type="text" placeholder="Enter Email" name="email" id="email" required>
                    </div>

                    <div class="group input-group-2cols">
                        <label for="psw">Password</label>
                        <div class="password-container">
                        <input type="password" name="psw" id="psw" required>
                        <img src="./static/icons/eye.svg" alt="eye" class="eye">
                        </div>
                    </div>
            
                    <button type="submit" id="submitData" name="submitData" class="button-white">Log In</button>

                    <div class="group">
                      <p>Forgot password? <a href="">Reset password.</a></p>
                    </div>

                    <div class="group">
                      <p>Don't have an account? <span class="create-account">Create one.</a></p>
                    </div>

              </div>
            </form>
          </div>
        </div>
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
    document.querySelector("body").classList.add("home-body");
    pubsub.publish("hideMainHeader");
    const auth = getAuth();
    const db = getFirestore();
    const form = document.getElementById("signInForm");
    
    

    form.addEventListener("submit", async (e) => {

      e.preventDefault();
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
          return;
          } else {
            console.log("email is not verified.");
            pageTransition("/verification");
        }
      })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        }
      );
      return false;
    });

    const createAccount = document.querySelector(".create-account");
    createAccount.addEventListener("click", () => {
      pageTransition("/sign-up");
    });

    const eye = document.querySelector(".eye");
    eye.addEventListener("click", () => {
      const password = document.getElementById("psw");
      if (password.type === "password") {
        password.type = "text";
        eye.src = "./static/icons/eye-slash.svg";
      } else {
        password.type = "password";
        eye.src = "./static/icons/eye.svg";
      }
    }
    );
        
  }

  close() {
    document.querySelector("body").classList.remove("home-body");
    pubsub.publish("hideMainHeader");
  }
}

export default Login;
