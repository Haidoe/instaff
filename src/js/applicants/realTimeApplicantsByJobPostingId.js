import {
  getFirestore,
  onSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";

class RealTimeApplicants {
  constructor(id) {
    this.jobPostingId = id;
    this.listener = null;
  }

  subscribe(cb) {
    const db = getFirestore();
    const applicantsCol = collection(db, "applicants");
    const applicantsQuery = query(
      applicantsCol,
      where("jobPostingId", "==", this.jobPostingId)
    );

    this.listener = onSnapshot(applicantsQuery, (snapshot) => {
      const applicants = [];

      snapshot.forEach((doc) => {
        applicants.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      cb && cb(applicants);
    });
  }

  unsubscribe() {
    this.listener && this.listener();
  }
}

export default RealTimeApplicants;
