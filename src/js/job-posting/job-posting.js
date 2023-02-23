import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
  getCountFromServer,
} from "firebase/firestore";

// Add a job posting
export const setJobPosting = async (initialJobPosting) => {
  const db = getFirestore();

  const jobPosting = {
    ...initialJobPosting,
    status: "draft",
    paymentType: "Cash",
    province: "British Columbia",
    created: serverTimestamp(),
    updated: serverTimestamp(),
    deleted: null,
  };

  try {
    const jobPostingCol = collection(db, "jobPostings");
    const docRef = await addDoc(jobPostingCol, jobPosting);

    return docRef.id;
  } catch (error) {
    console.log("Error adding job posting document: ", error);
    return null;
  }
};

export const updateJobPosting = async (id, jobPosting) => {
  const db = getFirestore();
  const postingDoc = doc(db, `jobPostings/${id}`);

  try {
    await setDoc(postingDoc, jobPosting, { merge: true });
    return true;
  } catch (error) {
    console.log("Error updating job posting document: ", error);
    return false;
  }
};

// TODO
// Must add filter, for date and status?
export const getAllJobPostings = async () => {
  const db = getFirestore();
  const jobPostingCol = collection(db, "jobPostings");
  const filteredJobPostingCol = query(
    jobPostingCol,
    where("status", "==", "published")
  );
  const jobPostingDocs = await getDocs(filteredJobPostingCol);

  const result = jobPostingDocs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return result;
};

export const getJobPostingDetail = async (id) => {
  const db = getFirestore();
  const postingDoc = doc(db, `jobPostings/${id}`);
  const postingSnap = await getDoc(postingDoc);

  if (postingSnap.exists()) {
    return {
      ...postingSnap.data(),
      id: postingSnap.id,
    };
  } else {
    return null;
  }
};

export const publishJobPosting = async (id) => {
  const db = getFirestore();
  const postingDoc = doc(db, `jobPostings/${id}`);

  const jobPosting = {
    status: "published",
    updated: serverTimestamp(),
  };

  try {
    await updateDoc(postingDoc, jobPosting);
    return true;
  } catch (error) {
    console.log("Error updating job posting document: ", error);
    return null;
  }
};

export const getActiveTotalJobPostingsByUser = async (id) => {
  const db = getFirestore();
  const jobPostingCol = collection(db, "jobPostings");
  const JobPostingQuery = query(
    jobPostingCol,
    where("userId", "==", id),
    where("status", "==", "published"),
    where("time.from", ">", Timestamp.now())
  );

  const result = await getCountFromServer(JobPostingQuery);

  return result.data().count;
};

export const getAllActiveJobPostingsByUser = async (id) => {
  const db = getFirestore();

  const jobPostingCol = collection(db, "jobPostings");

  const JobPostingQuery = query(
    jobPostingCol,
    where("userId", "==", id),
    where("status", "==", "published"),
    where("time.from", ">", Timestamp.now())
  );

  const jobPostingDocs = await getDocs(JobPostingQuery);

  const result = jobPostingDocs.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return result;
};

// TODO - Get first the active job postings, then get the applicants
export const getActiveTotalApplicantsByUser = async (id) => {
  const db = getFirestore();

  const applicantsCol = collection(db, "applicants");

  const applicantQuery = query(
    applicantsCol,
    where("employerId", "==", id),
    where("status", "==", "pending")
  );

  const result = await getCountFromServer(applicantQuery);
  return result.data().count;
};

// TODO - Get first the active job postings, then get the applicants that have status completed
export const getActiveTotalEmployeeToPayByUser = async (id) => {
  const db = getFirestore();

  const applicantsCol = collection(db, "applicants");

  const applicantQuery = query(
    applicantsCol,
    where("employerId", "==", id),
    where("status", "==", "completed")
  );

  const result = await getCountFromServer(applicantQuery);
  return result.data().count;
};
