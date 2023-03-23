import Page from "../../classes/Page";
import pubsub from "../../classes/PubSub";
import template from "./offline.html";
import "./offline.scss";

class OfflinePage extends Page {
  constructor() {
    super("You are offline");
  }

  load() {
    return template;
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
