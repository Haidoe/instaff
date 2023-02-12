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
    path: "/job-posting",
    page: () =>
      import(/* webpackChunkName: "JobPosting" */ `./pages/JobPosting`),
  },
  {
    path: "/job-posting/:id",
    page: () =>
      import(
        /* webpackChunkName: "JobPostingDetail" */ `./pages/JobPosting/detail`
      ),
  },
  {
    path: "/job-postings",
    page: () =>
      import(
        /* webpackChunkName: "JobPostingList" */ `./pages/JobPosting/list`
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
    path: "/profile",
    page: () => import(/* webpackChunkName: "Profile" */ `./pages/Profile`),
  },
];

export const router = async () => {
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

  const lazyLoaded = await (activeRoute
    ? activeRoute.page()
    : import(/* webpackChunkName: "404" */ `./pages/page404`));

  const Page = lazyLoaded.default;

  activePage = new Page(getParams(activeRoute));

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
