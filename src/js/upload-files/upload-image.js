import { v4 as uuidv4 } from "uuid";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file, folderName = "jobPostings") => {
  const storage = getStorage();
  const fileRef = ref(storage, `${folderName}/${uuidv4()}`);

  //Do the upload and wait
  await uploadBytes(fileRef, file);

  //After the upload, you can now get the url
  const url = await getDownloadURL(fileRef);

  return url;
};
