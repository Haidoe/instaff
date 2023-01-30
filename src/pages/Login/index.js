import Page from "../../classes/Page";
import "./login.scss";

class Login extends Page {
  constructor() {
    super("Sign In");
  }

  load() {
    return `
      <div class="login-page"> 
        <h2> Welcome to Login Page </h2>
      </div>
    `;
  }
}

export default Login;
