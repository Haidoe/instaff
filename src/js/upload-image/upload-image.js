// import { v4 as uuidv4 } from "https://jspm.dev/uuid";
// import { initialize } from "../../firebase.js";
// import {
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

// const { storage } = initialize();

// let image;

// fileInput.addEventListener("change", (e) => {
//   image = e.target.files[0];
// });

// formUpload.addEventListener("submit", (e) => {
//   e.preventDefault();

//   if (image == null) return;

//   console.log(image);

//   const imageRef = ref(storage, `shifts/${image.name + uuidv4()}`);

//   const uploadTask = uploadBytesResumable(imageRef, image);

//   uploadTask.on(
//     "state_changed",
//     (snapshot) => {
//       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log("Upload is " + progress + "% done");
//     },
//     (error) => {
//       // Handle unsuccessful uploads
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         console.log("File available at", downloadURL);
//       });
//     }
//   );
// });
