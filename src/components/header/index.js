import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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

    this.h1 = document.createElement("h1");

    this.h1Anchor = document.createElement("a");
    this.h1Anchor.href = "/";

    this.hiddenLogoText = document.createElement("span");
    this.hiddenLogoText.textContent = "Instaff";
    this.hiddenLogoText.className = "visually-hidden";

    this.logoImg = document.createElement("img");
    this.logoImg.src = "/static/instaff-logo-v2.svg";
    this.logoImg.alt = "Instaff Logo";
    this.logoImg.setAttribute("data-link", "");

    this.ul = document.createElement("ul");
    this.nav = document.createElement("nav");

    this.dynamicNavList = {
      employee: [
        {
          text: "Search",
          href: "/search",
        },
        {
          text: "My Jobs",
          href: "/my-jobs",
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
      ],
    };
    const loggedInNavs = [
      {
        text: "Inbox",
        href: "/inbox",
      },
      {
        text: "Account",
        href: "/account",
      },
    ];

    this.auth = getAuth();
    onAuthStateChanged(this.auth, async (user) => {
      let navItemList = null;

      if (user) {
        const userDetails = await getUserDetails(user.uid);

        navItemList = [
          ...this.dynamicNavList[userDetails.typeOfUser],
          ...loggedInNavs,
          {
            text: "Sign out",
            href: "/sign-out",
          },
        ];

        this.loadNavs(navItemList);
      } else {
        navItemList = [
          {
            text: "Sign In",
            href: "/sign-in",
          },
          {
            text: "Sign Up",
            href: "/sign-up",
          },
        ];

        this.loadNavs(navItemList);
      }
    });

    this.h1Anchor.appendChild(this.hiddenLogoText);
    this.h1Anchor.appendChild(this.logoImg);
    this.h1.appendChild(this.h1Anchor);
    this.nav.appendChild(this.ul);
    this.header.appendChild(this.h1);
    this.header.appendChild(this.nav);
  }

  loadNavs(navList) {
    while (this.ul.firstChild) {
      this.ul.removeChild(this.ul.firstChild);
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
          pageTransition("/");
        });
      } else {
        itemAnchor.setAttribute("data-link", "");
      }

      li.appendChild(itemAnchor);
      this.ul.appendChild(li);
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
