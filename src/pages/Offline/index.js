import Page from "../../classes/Page";
import Template from "./offline.html";
import pubsub from "../../classes/PubSub";
import "./offline.scss";

class OfflinePage extends Page {
  constructor() {
    super("You are offline");
  }

  load() {
    return Template;

    return `
    <div class="offline-page">
      <section>
        <header>
          <h2>
            <img src="/static/instaff-logo-light-full-text.svg" id="mobile-instaff-logo" alt="Instaff Logo">

            <img src="/static/dark-instaff-logo.svg" id="desktop-instaff-logo" alt="Dark Instaff Logo">

            <span class="visually-hidden">
              Offline
            </span>
          </h2>
        </header>

        <div class="main-content">
          <img src="/static/illustrator/access-denied.svg" alt="Access Denied illustrator">

          You are currently offline.
        </div>

        <p>
          Looks like you’re not connected to a network. Check your settings and try again.
        </p>
      </section>
    </div>
    `;
  }

  mounted() {
    document.querySelector("body").classList.add("offline-body");

    pubsub.publish("hideMainHeader");
  }

  close() {
    document.querySelector("body").classList.remove("offline-body");
    pubsub.publish("showMainHeader");
  }
}

export default OfflinePage;
