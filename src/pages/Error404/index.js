import Page from "../../classes/Page";
import Template from "./error404.html";
import pubsub from "../../classes/PubSub";
import "./error404.scss";

class Error404Page extends Page {
  constructor() {
    super("Page not Found");
  }

  load() {
    return Template;
  }

  mounted() {
    document.querySelector("body").classList.add("error404-body");
    pubsub.publish("hideMainHeader");
  }

  close() {
    document.querySelector("body").classList.remove("error404-body");
    pubsub.publish("showMainHeader");
  }
}

export default Error404Page;
