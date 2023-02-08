import Page from "../../classes/Page";
import "./verification.scss";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { pageTransition } from "../../router";

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
    const auth = getAuth();

    //grab elements
    const btnResend = document.querySelector("#resendemail");

    const userEmail = document.querySelector("#useremail");
    userEmail.innerHTML = `<em>${this.currentUser.email}</em>.`;

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
