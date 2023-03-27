import globalState from "./classes/GlobalState";
import OfflinePage from "./pages/Offline";
import { getParams, pathToRegex } from "./js/utils";

//Will hold the class instance of the active page
let activePage = null;

//Entry point
const mainApp = document.querySelector("#app");

const parser = new DOMParser();

//List of pages
const routes = [
  {
    path: "/",
    page: () => import(/* webpackChunkName: "Home"  */ `./pages/Home`),
  },

  {
    path: "/offline",
    page: () => import(/* webpackChunkName: "Offline" */ `./pages/Offline`),
  },

  {
    path: "/sign-in",
    page: () => import(/* webpackChunkName: "Signin" */ `./pages/Signin`),
  },

  {
    path: "/sign-up",
    page: () => import(/* webpackChunkName: "Signup" */ `./pages/SignUp`),
  },

  {
    path: "/verification",
    page: () =>
      import(
        /* webpackChunkName: "EmailVerification" */ `./pages/Verification`
      ),
  },

  {
    path: "/my-jobs",
    page: () =>
      import(/* webpackChunkName: "NotificationPage" */ `./pages/MyJobs`),
  },

  {
    path: "/notification",
    page: () =>
      import(/* webpackChunkName: "NotificationPage" */ `./pages/Notification`),
  },

  {
    path: "/post",
    page: () =>
      import(/* webpackChunkName: "JobPost" */ `./pages/JobPostingV2`),
  },

  {
    path: "/account",
    page: () => import(/* webpackChunkName: "AccountPage" */ `./pages/Account`),
  },

  {
    path: "/account-employee",
    page: () =>
      import(
        /* webpackChunkName: "AccountEmployee" */ `./pages/Account-Employee`
      ),
  },

  {
    path: "/account/preferences",
    page: () =>
      import(
        /* webpackChunkName: "AccountPreference" */ `./pages/Account/preferences`
      ),
  },

  {
    path: "/account/typeOfWork",
    page: () =>
      import(
        /* webpackChunkName: "AccountTypeOfWork" */ `./pages/Account/typeOfWork`
      ),
  },

  {
    path: "/account/availability",
    page: () =>
      import(
        /* webpackChunkName: "AccountAvailability" */ `./pages/Account/availability`
      ),
  },

  {
    path: "/account/lengthOfShift",
    page: () =>
      import(
        /* webpackChunkName: "AccountShift" */ `./pages/Account/lengthOfShift`
      ),
  },

  {
    path: "/account/setting",
    page: () =>
      import(/* webpackChunkName: "Profile" */ `./pages/Account/setting`),
  },

  {
    path: "/account-employer",
    page: () =>
      import(
        /* webpackChunkName: "ProfileEmployer" */ `./pages/Account-Employer`
      ),
  },

  {
    path: "/rating-and-feedback",
    page: () =>
      import(
        /* webpackChunkName: "RatingAndFeedback" */ `./pages/RatingAndFeedback`
      ),
  },

  {
    path: "/dashboard",
    page: () => import(/* webpackChunkName: "Dashboard" */ `./pages/Dashboard`),
  },
];

export const router = async () => {
  if (globalState.preventPopState) {
    globalState.preventPopState = false;
    return;
  }

  //This is where you unsubscribe things from the previous active page
  if (activePage) {
    activePage.close();
  }

  //Adding a result property and it will create an object if path matches the current location
  //Will will have a result property with null if didn't met
  const transformedRoutes = routes.map((route) => ({
    ...route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  //This is to get the active route
  let activeRoute = transformedRoutes.find((route) => route.result !== null);

  if (activeRoute?.path === "/offline") {
    activePage = new OfflinePage(getParams(activeRoute));
  } else {
    const lazyLoaded = await (activeRoute
      ? activeRoute.page()
      : import(/* webpackChunkName: "404" */ `./pages/Error404`));

    const Page = lazyLoaded.default;

    activePage = new Page(getParams(activeRoute));
  }

  const willLoad = await activePage.preload();

  if (willLoad) {
    //Converting the String to DomElements
    const pageContent = await activePage.load();
    const parsedPageElement = parser.parseFromString(pageContent, "text/html");

    //Removing the content of the mainApp
    while (mainApp.firstChild) mainApp.removeChild(mainApp.firstChild);

    //Inserting the Page
    for (const child of parsedPageElement.body.childNodes) {
      mainApp.appendChild(child);
    }

    //Execute mounted
    activePage.mounted();
  }
};

export const pageTransition = (url) => {
  history.pushState(null, null, url);
  router();
};
