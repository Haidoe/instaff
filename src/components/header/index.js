import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import globalState from "../../classes/GlobalState";
import pubsub from "../../classes/PubSub";
import { getUserDetails } from "../../js/users";
import { pageTransition } from "../../router";
import "./main-header.scss";
/**
 * @class MainHeader
 * @description Creates the main header for the website
 * @param {HTMLElement} wrapper - The wrapper element for the header
 */
class MainHeader {
  constructor() {
    this.wrapper = null;

    this.header = document.createElement("header");
    this.header.className = "main-header";

    this.headerContainer = document.createElement("div");
    this.headerContainer.className = "main-header-container";
    this.header.appendChild(this.headerContainer);

    this.headingWrapper = document.createElement("div");
    this.headingWrapper.className = "heading-wrapper";

    this.backBtn = document.createElement("button");
    this.backBtn.className = "icon back-icon hidden";
    this.backBtn.setAttribute("aria-label", "Back Button");

    this.backBtn.addEventListener("click", () => {
      pubsub.publish("mainHeaderBackBtnClicked", null);
    });

    pubsub.subscribe("mainHeaderShowBackBtn", () => {
      this.backBtn.classList.remove("hidden");
    });

    pubsub.subscribe("mainHeaderHideBackBtn", () => {
      this.backBtn.classList.add("hidden");
    });

    this.headingWrapper.appendChild(this.backBtn);

    this.hamburger = document.createElement("button");
    this.hamburger.setAttribute("aria-label", "Menu");
    this.hamburger.className = "hamburger ";
    // hamburger--collapse
    const spanBar = document.createElement("span");
    spanBar.className = "bar";
    const vshText = document.createElement("i");
    vshText.className = "visually-hidden";
    vshText.textContent = "Menu";
    this.hamburger.appendChild(spanBar);
    this.hamburger.appendChild(vshText);

    this.h1 = document.createElement("h1");
    this.h1Anchor = document.createElement("a");
    this.h1Anchor.href = "/";
    this.h1Anchor.setAttribute("data-link", "");

    this.hiddenLogoText = document.createElement("span");
    this.hiddenLogoText.textContent = "Instaff";
    this.hiddenLogoText.className = "visually-hidden";

    this.logoImg = document.createElement("img");
    this.logoImg.src = "/static/logo/instaff-no-space.svg";
    this.logoImg.alt = "Instaff Logo";
    this.logoImg.setAttribute("data-link", "");

    this.navWrapper = document.createElement("div");
    this.navWrapper.className = "nav-wrapper";
    this.nav = document.createElement("nav");
    this.navUl = document.createElement("ul");
    this.actionUl = document.createElement("ul");

    this.hamburger.addEventListener("click", () => {
      this.hamburger.classList.toggle("open");
      this.nav.classList.toggle("nav--open");
    });

    this.dynamicNavList = {
      employee: [
        {
          text: "Search",
          href: "/",
        },
        {
          text: "My Jobs",
          href: "/my-jobs",
        },
        {
          text: "Account",
          href: "/account-employee",
        },
      ],

      employer: [
        {
          text: "Dashboard",
          href: "/dashboard",
        },
        {
          text: "Post",
          href: "/post",
        },
        {
          text: "Account",
          href: "/account-employer",
        },
      ],
    };

    const loggedInNavs = [
      {
        text: "Notification",
        href: "/notification",
      },
    ];

    this.auth = getAuth();

    onAuthStateChanged(this.auth, async (user) => {
      let navItemList = [];
      let actionItemList = [];

      if (user) {
        const userDetails = await getUserDetails(user.uid);

        navItemList = [
          ...this.dynamicNavList[userDetails.typeOfUser],
          ...loggedInNavs,
        ];

        actionItemList = [
          {
            text: "Sign out",
            href: "/sign-out",
          },
        ];

        this.loadNavs(this.navUl, navItemList);
        this.loadNavs(this.actionUl, actionItemList);
      } else {
        actionItemList = [
          {
            text: "Sign In",
            href: "/sign-in",
          },
          {
            text: "Sign Up",
            href: "/sign-up",
          },
        ];

        this.loadNavs(this.navUl, navItemList);
        this.loadNavs(this.actionUl, actionItemList);
      }

      if (this.navUl.hasChildNodes()) {
        this.nav.appendChild(this.navUl);
      }

      this.nav.appendChild(this.actionUl);
    });

    this.h1Anchor.appendChild(this.hiddenLogoText);
    this.h1Anchor.appendChild(this.logoImg);
    this.h1.appendChild(this.h1Anchor);
    this.headingWrapper.appendChild(this.h1);
    this.headingWrapper.appendChild(this.hamburger);
    this.headerContainer.appendChild(this.headingWrapper);
    this.navWrapper.appendChild(this.nav);
    this.headerContainer.appendChild(this.navWrapper);

    this.logoImg.addEventListener("click", (e) => {
      e.preventDefault();

      //Making sure that no one can stop the popstate event redirecting to the home page
      globalState.preventPopState = false;

      this.hamburger.classList.remove("open");
      this.nav.classList.remove("nav--open");

      const prevActiveMenu = document.querySelector(".active-menu-item");

      if (prevActiveMenu) {
        if (prevActiveMenu.getAttribute("href") === "/") return;
        prevActiveMenu.classList.remove("active-menu-item");
      }
    });

    pubsub.subscribe("showMainHeader", () => {
      this.header.classList.remove("main-header-hidden");
    });

    pubsub.subscribe("hideMainHeader", () => {
      this.header.classList.add("main-header-hidden");
    });
  }

  loadNavs(ul, navList) {
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    for (const item of navList) {
      const li = document.createElement("li");
      const itemAnchor = document.createElement("a");
      itemAnchor.textContent = item.text;
      itemAnchor.href = item.href;

      if (item.href === "/sign-out") {
        itemAnchor.setAttribute("data-signout", "");
        itemAnchor.addEventListener("click", () => {
          signOut(this.auth);
          pageTransition("/sign-in");
        });
      } else {
        itemAnchor.setAttribute("data-link", "");
      }

      itemAnchor.addEventListener("click", () => {
        //Making sure that no one can stop the popstate event
        globalState.preventPopState = false;

        this.hamburger.classList.remove("open");
        this.nav.classList.remove("nav--open");
        const prevActiveMenu = document.querySelector(".active-menu-item");

        if (prevActiveMenu) {
          prevActiveMenu.classList.remove("active-menu-item");
        }

        itemAnchor.classList.add("active-menu-item");
      });

      li.appendChild(itemAnchor);

      ul.appendChild(li);
    }
  }

  render() {
    if (this.wrapper) {
      this.wrapper.insertBefore(this.header, this.wrapper.firstChild);
    } else {
      console.error("No wrapper element found");
    }
  }
}

export default MainHeader;
