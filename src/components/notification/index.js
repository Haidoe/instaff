import {
  getFirestore,
  collection,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./notification.scss";
//Status of the notification
const NOTIFICATION_STATUS = {
  HIRED: "You have been hired at",
  HIRED_CANCEL: "have decided not to move forward hiring you.",
  APPLY: "applied for your job posting at",
  APPLY_CANCEL: "have decided to cancel applying for your job posting at",
};

class Notification {
  constructor(data, wrapper) {
    this.wrapper = wrapper;
    this.data = data;
    this.init();
  }

  init() {
    this.notification = document.createElement("div");
    this.notification.classList.add("notification");

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("notification__thumbnail");
    const img = document.createElement("img");
    img.src = this.data.imageUrl;
    imgContainer.appendChild(img);
    this.notification.appendChild(imgContainer);

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("notification__message");
    const anchor = document.createElement("a");
    anchor.href = "#";
    messageContainer.appendChild(anchor);
    this.notification.appendChild(messageContainer);

    const message = document.createElement("p");

    if (this.data.type === "HIRED") {
      message.textContent = `${NOTIFICATION_STATUS.HIRED} ${this.data.jobPostingCompanyName}`;
    } else if (this.data.type === "HIRED_CANCEL") {
      message.textContent = `${this.data.jobPostingCompanyName} ${NOTIFICATION_STATUS.HIRED_CANCEL}`;
    } else if (this.data.type === "APPLY") {
      message.textContent = `${this.data.source} ${NOTIFICATION_STATUS.APPLY} ${this.data.jobPostingCompanyName}`;
    } else if (this.data.type === "APPLY_CANCEL") {
      message.textContent = `${this.data.source} ${NOTIFICATION_STATUS.APPLY_CANCEL} ${this.data.jobPostingCompanyName}`;
    }

    anchor.appendChild(message);

    const closeContainer = document.createElement("div");
    closeContainer.classList.add("notification__close");
    this.notification.appendChild(closeContainer);

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = `
      <i class="fas fa-times"></i>
      <span class="visually-hidden">Close Notification</span>
    `;
    closeContainer.appendChild(closeBtn);

    closeBtn.addEventListener("click", () => {
      this.remove();
    });

    this.wrapper.appendChild(this.notification);
  }

  remove() {
    this.notification.remove();
  }
}

class NotificationsComponent {
  constructor() {
    this.wrapper = document.body;
    this.isLoaded = false;
    //Audio
    this.audio = new Audio("/static/bgm/instaff-notification.wav");
    //Notif Listener
    this.unsubscribe = null;
    this.initElements();
    this.handleAuth();
  }

  initElements() {
    this.container = document.createElement("div");
    this.container.classList.add("notifications");
    this.wrapper.appendChild(this.container);
  }

  handleAuth() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.isLoaded = false;
        this.listen();
      } else {
        this.unsubscribe && this.unsubscribe();
      }
    });
  }

  listen() {
    const db = getFirestore();
    const col = collection(db, "notifications");
    const q = query(col, where("userId", "==", this.user.uid));

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      if (this.isLoaded) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            this.push(data);
          }
        });
      } else {
        this.isLoaded = true;
      }
    });
  }

  push(data) {
    const notif = new Notification(data, this.container);
    this.audio.play();

    setTimeout(() => {
      notif.remove();
    }, 10000);
  }
}

export default NotificationsComponent;
