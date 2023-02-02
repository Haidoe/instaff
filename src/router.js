import { getParams, pathToRegex } from "./js/utils";
import Home from "./pages/Home";
import PageNotFound from "./pages/page404";
import SignIn from "./pages/Login";
import Test from "./pages/Posting";
import Register from "./pages/SignUp/sample";

//Will hold the class instance of the active page
let activePage = null;

//Entry point
const mainApp = document.querySelector("#app");

const parser = new DOMParser();

//List of pages
const routes = [
  {
    path: "/",
    page: Home,
  },
  {
    path: "/sign-in",
    page: SignIn,
  },
  {
    path: "/test/:id",
    page: Test,
  },
  {
    path: "/lop",
    page: Register,
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

  activePage = activeRoute
    ? new activeRoute.page(getParams(activeRoute))
    : new PageNotFound();

  const pageContent = await activePage.load();
  const parsedPageElement = parser.parseFromString(pageContent, "text/html");

  console.log(parsedPageElement);
  mainApp.innerHTML = "";
  mainApp.appendChild(parsedPageElement.body);
  activePage.mounted();
};

export const pageTransition = (url) => {
  history.pushState(null, null, url);
  router();
};
