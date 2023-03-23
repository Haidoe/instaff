import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

clientsClaim();

self.skipWaiting();

// Additional code goes here.
precacheAndRoute(self.__WB_MANIFEST);
