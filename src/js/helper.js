import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

//Used to display images
// convert file to a base64 url
export const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};

export const uploadFile = (
  storage,
  file,
  folderName = "shifts",
  callbacks = {}
) => {
  const fileRef = ref(storage, `${folderName}/${uuidv4()}`);

  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      if (callbacks.progress) {
        callbacks.progress(progress);
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      if (callbacks.error) {
        callbacks.error(error);
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);

        if (callbacks.getUrl) {
          callbacks.getUrl(downloadURL);
        }
      });
    }
  );
};
