self.addEventListener("fetch", function (event) {
  console.log(`Fetching ${event.request.url}`);
});
