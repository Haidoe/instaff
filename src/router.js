import Home from "./pages/Home";
import PageNotFound from "./pages/page404";
import SignIn from "./pages/Login";
import Test from "./pages/Posting";

let activePage = null;
const mainApp = document.querySelector("#app");

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
];

//Transforming the path url to array
const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

//Get the Slug
const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const router = async () => {
  //This is where you unsubscribe things from the previous active page
  if (activePage) {
    activePage.close();
  }
  const transformedRoutes = routes.map((route) => ({
    ...route,
    result: location.pathname.match(pathToRegex(route.path)),
  }));

  let activeRoute = transformedRoutes.find((route) => route.result !== null);

  activePage = activeRoute
    ? new activeRoute.page(getParams(activeRoute))
    : new PageNotFound();

  mainApp.innerHTML = activePage.load();
};

const pageTransition = (url) => {
  history.pushState(null, null, url);
  router();
};

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    pageTransition(e.target.href);
  }
});

window.addEventListener("popstate", router);

router();
