import { Workbox } from "workbox-window";

const registerServiceWorker = () => {
  if (process.env.NODE_ENV !== "production") return;

  if ("serviceWorker" in navigator) {
    const wb = new Workbox("instaff-service-worker.js");

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        console.log("New content is available; please refresh.");
      } else {
        console.log("Content is cached for offline use.");
      }
    });

    console.log("Registering service worker");
    wb.register();
  }
};

export default registerServiceWorker;
