import Page from "../../classes/Page";
import "./verification.scss";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";

class Verification extends Page {
  constructor() {
    super("Verification");
  }

  async load() {
    // Html here
    // always wrap the whole markup
    return `
    <div class="verifyemail">
      <h1>Please verify your email</h1>
      <div class="group">icon here</div>
      <div class="group">
        <p>You're almost there! We sent an email to <span id="useremail"></span></p>
        <p>Just click on the link in that email to complete your sign up.</p>
      </div>
      <div class="group">
        <p>Still can't find the email?</p>
      </div>

      
      <button type="button" id="resendemail">Resend Email</button>

      <div class="group">
        <p id="output"></p>
      </div>
    </div>
    `;
  }

  async mounted() {
    //Js script here
    //Call declare Firebase function first
    const auth = getAuth();

    //grab elements
    const btnResend = document.querySelector("#resendemail");

    onAuthStateChanged(auth, (user) => {
      const userEmail = document.querySelector("#useremail");

      if (!user.emailVerified) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user.emailVerified);
        userEmail.innerHTML = `<em>${user.email}</em>.`;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    btnResend.addEventListener("click", (e) => {
      sendEmailVerification(auth.currentUser).then(() => {
        const output = document.querySelector("#output");

        // Email verification sent!
        output.innerHTML = `<em>Email Verification sent! Check your mail box.</em>`;
        // ...
      });
    });
  }
}
export default Verification;
