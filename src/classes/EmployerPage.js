import { pageTransition } from "../router";
import AuthenticatedPage from "./AuthenticatedPage";

class EmployerPage extends AuthenticatedPage {
  constructor(title) {
    super(title);
  }

  async preload() {
    const result = await super.preload();

    if (!result) return false;

    if (this.currentUser.type === "employer") {
      return true;
    }

    pageTransition("/unauthorized");
    return false;
  }
}

export default EmployerPage;
