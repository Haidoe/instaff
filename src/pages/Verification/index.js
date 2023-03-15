import Page from "../../classes/Page";
import "./verification.scss";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { pageTransition } from "../../router";
import pubsub from "../../classes/PubSub";

class Verification extends Page {
  constructor() {
    super("Verification");
  }

  async load() {
    // Html here
    // always wrap the whole markup
    return `
    <div class="verification-page">
      <div class="inner-wrapper gradient-bg">
        <div class="left-col">
        </div>
        <div class="right-col">
          <div class="container">
            <h1>Please verify your email</h1>
            <img src="./static/images/verify-letter.svg" alt="envelope picture" class="envelope">
            <div class="group">
              <p>You're almost there! We sent an email to <span id="useremail"></span></p>
              <p>Click the link in email to complete your sign up.</p>
            </div>
            <div class="group">
              <p>Still can't find the email?</p>
            </div>
            
            <button type="button" id="resendemail" class="button-white">Resend Email</button>
            <div class="group">
              <p id="output"></p>
            </div>
            <div class="group">
              <a href= "#" class="signout">Maybe later</a>
            </div>

          </div>
        </div>
      </div>
    </div>
    `;
  }

  async preload() {
    const user = await this.getCurrentUser();

    if (user) {
      if (user.emailVerified) {
        pageTransition("/");
        return false;
      }

      this.currentUser = user;
      return true;
    } else {
      pageTransition("/sign-in");
      return false;
    }
  }

  async mounted() {
    document.querySelector("body").classList.add("verification-body");
    pubsub.publish("hideMainHeader");
    const auth = getAuth();

    //grab elements
    const btnResend = document.querySelector("#resendemail");

    const userEmail = document.querySelector("#useremail");
    userEmail.innerHTML = `<em>${this.currentUser.email}</em>.`;

    btnResend.addEventListener("click", (e) => {
      sendEmailVerification(auth.currentUser).then(() => {
        const output = document.querySelector("#output");

        //loadind
        btnResend.innerHTML = `<div>Sending...</div>`;


        // Email verification sent!
        output.innerHTML = `<em>Email Verification sent! Check your mail box.</em>`;
        // ...

        btnResend.innerHTML = `<div>Resend Email</div>`;

      });
    });

    const signOut = document.querySelector(".signout");
    signOut.addEventListener("click", (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        // Sign-out successful.
        pageTransition("/sign-in");
      }).catch((error) => {
        // An error happened.
      });
    });
  }

  close() {
    document.querySelector("body").classList.remove("verification-body");
    pubsub.publish("showMainHeader");
  }
}
export default Verification;
