import {
  getFirestore,
  onSnapshot,
  query,
  where,
  collection,
  Timestamp,
} from "firebase/firestore";

class RealTimeActiveJobPostings {
  constructor() {
    this.listener = null;
  }

  subscribe(cb) {
    const db = getFirestore();
    const col = collection(db, "jobPostings");
    const q = query(col, where("time.from", ">", Timestamp.now()));

    this.listener = onSnapshot(q, (snapshot) => {
      const postings = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const posting = {
            id: change.doc.id,
            ...change.doc.data(),
          };

          postings.push(posting);
        }
      });

      cb && cb(postings);
    });
  }

  unsubscribe() {
    this.listener && this.listener();
  }
}

export default RealTimeActiveJobPostings;
