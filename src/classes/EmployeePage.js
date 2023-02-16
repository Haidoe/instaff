import { pageTransition } from "../router";
import AuthenticatedPage from "./AuthenticatedPage";

class EmployeePage extends AuthenticatedPage {
  constructor(title) {
    super(title);
  }

  async preload() {
    const result = await super.preload();

    if (!result) return false;

    if (this.currentUser.details.typeOfUser !== "employer") {
      return true;
    }

    pageTransition("/unauthorized");
    return false;
  }
}

export default EmployeePage;
