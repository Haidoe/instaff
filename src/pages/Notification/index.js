import moment from "moment";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import { getNotificationPerUser } from "../../js/notifications";
import Template from "./notif.html";
import "./notif.scss";

const NOTIFICATION_STATUS = {
  HIRED: "You have been hired at",
  HIRED_CANCEL: "have decided not to move forward hiring you.",
  APPLY: "applied for your job posting at",
  APPLY_CANCEL: "have decided to cancel applying for your job posting at",
};

class NotificationPage extends AuthenticatedPage {
  constructor() {
    super("Notification");

    this.urls = {
      employee: "/my-jobs",
      employer: "/dashboard",
    };
  }

  load() {
    return Template;
  }

  async loadNotifs() {
    const response = await getNotificationPerUser(this.currentUser.uid);

    const loading = document.querySelector(".loading");
    loading.classList.add("hidden");

    if (response.length === 0) {
      const noNotif = document.querySelector(".empty");
      noNotif.classList.remove("hidden");
    } else {
      response.forEach((notif) => {
        const notification = document.createElement("a");
        notification.href =
          this.urls[this.currentUser.details.typeOfUser] || "/";
        notification.setAttribute("data-link", "");
        notification.classList.add("notif");
        this.wrapper.appendChild(notification);

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("notif__thumbnail");
        const img = document.createElement("img");
        img.src = notif.imageUrl;
        imgContainer.appendChild(img);
        notification.appendChild(imgContainer);

        const messageContainer = document.createElement("div");
        messageContainer.classList.add("notif__message");
        notification.appendChild(messageContainer);

        const message = document.createElement("p");
        messageContainer.appendChild(message);

        const messageDate = document.createElement("p");
        messageDate.classList.add("notif__date");
        const notifDate = notif.created.toDate();
        messageDate.textContent = moment(notifDate).fromNow();
        messageContainer.appendChild(messageDate);

        if (notif.type === "HIRED") {
          message.textContent = `${NOTIFICATION_STATUS.HIRED} ${notif.jobPostingCompanyName}`;
        } else if (notif.type === "HIRED_CANCEL") {
          message.textContent = `${notif.jobPostingCompanyName} ${NOTIFICATION_STATUS.HIRED_CANCEL}`;
        } else if (notif.type === "APPLY") {
          message.textContent = `${notif.source} ${NOTIFICATION_STATUS.APPLY} ${notif.jobPostingCompanyName}`;
        } else if (notif.type === "APPLY_CANCEL") {
          message.textContent = `${notif.source} ${NOTIFICATION_STATUS.APPLY_CANCEL} ${notif.jobPostingCompanyName}`;
        }
      });
    }
  }

  mounted() {
    document.body.classList.add("notification-body");
    this.wrapper = document.querySelector(".notification-page");

    //Just to make sure Active Menu is set to Notification
    const menu = document.querySelector(".main-header a[href='/notification']");
    menu.classList.add("active-menu-item");

    this.loadNotifs();
  }

  close() {
    document.body.classList.remove("notification-body");
    const menu = document.querySelector(".main-header a[href='/dashboard']");
    menu?.classList.remove("active-menu-item");
  }
}

export default NotificationPage;
