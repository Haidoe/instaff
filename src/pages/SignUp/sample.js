import Page from "../../classes/Page";
import "./signup.scss";

class Register extends Page {
  constructor() {
    super("Register");
  }

  async load() {
    return `
      <div class="register-page">
        <h2> Register Page </h2>

        <div class="random">
          <img src="/static/images/sample.jpg" />
        </div>
        
        <div id="regiterDiv"></div>
      </div>
    `;
  }

  async mounted() {
    const regiterDiv = document.querySelector("#regiterDiv");

    regiterDiv.innerHTML = "Hello World@@@@@";
  }
}

export default Register;
