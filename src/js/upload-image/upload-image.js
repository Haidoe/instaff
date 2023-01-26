import { initialize } from "../../firebase.js";
import { readURL, uploadFile } from "../helper.js";
const { storage } = initialize();
let image;

fileInput.addEventListener("change", async (e) => {
  image = e.target.files[0];
  const url = await readURL(image);
  imgDisplay.src = url;
});

//This is to track the progress percentage of the uploaded file
const progressCallback = (progress) => {
  console.log("HEYY!!", progress);
};

formUpload.addEventListener("submit", (e) => {
  e.preventDefault();

  if (image == null) return;

  console.log(image);

  uploadFile(storage, image, "jobPostingBanner", {
    progress: progressCallback,
  });
});
