import Page from "./Page";
import { pageTransition } from "../router";
import { getUserDetails } from "../js/users";
class AuthenticatedPage extends Page {
  constructor(title) {
    super(title);
  }

  async preload() {
    const user = await this.getCurrentUser();

    if (user) {
      if (!user.emailVerified) pageTransition("/verification");

      this.currentUser = user;

      this.currentUser.details = await getUserDetails(user.uid);

      return true;
    } else {
      pageTransition("/sign-in");
      return false;
    }
  }
}

export default AuthenticatedPage;
