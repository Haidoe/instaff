import { v4 as uuidv4 } from "uuid";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const uploadFile = (file, folderName = "shifts", callbacks = {}) => {
  const storage = getStorage();
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
