import Modal from "../index";
import "./rating-feedback.scss";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

// import star-rating
import StarRating from "../../../components/star-rating";
import { getJobPostingDetail } from "../../../js/job-posting/job-posting";

class RatingFeedback extends Modal {
  constructor(textContent) {
    super(textContent);
    this.hideMeta();
    this.wrapper = document.querySelector("body");

    //add class to modal
    this.modal.classList.add("rating-feedback-modal");
    this.modal.classList.add("default");

    //add modalContent to modal container
    this.modalContent.classList.add("modal-content");
    this.modalContent.textContent = "";
    this.initContent();
    this.modalContainer.appendChild(this.modalContent);
  }

  initContent() {
    this.modalContentHeader = document.createElement("div");
    this.modalContentHeader.classList.add("modal-content-header");
    this.modalContent.appendChild(this.modalContentHeader);

    this.modalContentBody = document.createElement("div");
    this.modalContentBody.classList.add("modal-content-body");
    this.modalContent.appendChild(this.modalContentBody);

    this.initHeaderSection();
    this.initBodySection();
  }

  initHeaderSection() {
    this.initHeaderContent();
  }

  async initHeaderContent() {
    //TODO: change this staticId to the id of the job posting
    const staticId = "0zq8KTLbceTZIA0SVGgY";
    const jobPostingData = await getJobPostingDetail(staticId);
    
    const userImage = document.createElement("img");
    userImage.classList.add("modal-content-user-image");
    userImage.src = jobPostingData.bannerImageUrl;
    userImage.alt = "user image";
    this.modalContentHeader.appendChild(userImage);

    const userName = document.createElement("p");
    userName.classList.add("modal-content-user-name");
    userName.textContent = jobPostingData.companyName;
    this.modalContentHeader.appendChild(userName);

    this.initRatingAndCommentNumSection();
  }
  
  async initRatingAndCommentNumSection() {

    //TODO: change this staticId to the id of the job posting
    const staticId = "BDRqwdDOy4Y3loAr30mGYkRAVrO2";

    // get ratingAndFeedback from database
    const db = getFirestore();
    const ratingAndFeedbackRef = collection(db, "ratingAndFeedback");

    const q = query(ratingAndFeedbackRef, where("feedbackMessage", "!=", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      doc.id, " => ", doc.data();
    });
    
    const getAllFeedback = [];
    querySnapshot.forEach((doc) => {
      getAllFeedback.push(doc.data());
    });
    

    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars-container");
    this.modalContentHeader.appendChild(starsContainer);

    // get rating from database
    const ratingQuery = query(ratingAndFeedbackRef, where("rating", "!=", false));
    const ratingQuerySnapshot = await getDocs(ratingQuery);
    ratingQuerySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      doc.id, " => ", doc.data();
    });
    
    const getAllRating = [];
    ratingQuerySnapshot.forEach((doc) => {
      getAllRating.push(doc.data());
    });

    // sum all rating
    let sumRating = 0;
    for (let i = 0; i < getAllRating.length; i++) {
      sumRating += getAllRating[i].rating;
    }

    // calculate average rating
    const averageRating = (sumRating / getAllRating.length).toFixed(0);
    const stars = new StarRating( `${averageRating}`);
    stars.suffix = `${averageRating}` + "/" + 5;
    starsContainer.appendChild(stars.toElement());


    const commentSectionTitle = document.createElement("p");
    commentSectionTitle.classList.add("comment-title");
    

    //we will get the number feedback from the database
    const commentTotalNum = getAllFeedback.length;
    if (commentTotalNum < 1) {
      commentSectionTitle.textContent = "No comment yet";
    } else if (commentTotalNum === 1) {
      commentSectionTitle.innerHTML = `${commentTotalNum} comment`;
    } else {
      commentSectionTitle.innerHTML = `${commentTotalNum} comments`;
    }
    this.modalContentHeader.appendChild(commentSectionTitle);
  }

   initBodySection() {
    this.initFeedbackSection();
  }
 
  async initFeedbackSection() {

    const staticId = "BDRqwdDOy4Y3loAr30mGYkRAVrO2";

    // get ratingAndFeedback from database
    const db = getFirestore();
    const ratingAndFeedbackRef = collection(db, "ratingAndFeedback");

    const q = query(ratingAndFeedbackRef, where("feedbackMessage",  "!=", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      doc.id, " => ", doc.data();
    });
    
    const getAllFeedback = [];
    querySnapshot.forEach((doc) => {
      getAllFeedback.push(doc.data());
    });


    this.feedbackContainer = document.createElement("div");
    this.feedbackContainer.classList.add("feedback-container");
    this.modalContentBody.appendChild(this.feedbackContainer);

    //output all feedback
    getAllFeedback.forEach((feedback) => {

      const feedbackItem = document.createElement("div");
      feedbackItem.classList.add("feedback-item");
      this.feedbackContainer.appendChild(feedbackItem);

      const feedbackUserImage = document.createElement("img");
      feedbackUserImage.classList.add("feedback-user-image");

      // check if isAnomymous
      if (feedback.isAnonymousValue === true) {
        feedbackUserImage.src = "../../../static/images/anonymous.svg";
      } else {
        feedbackUserImage.src = feedback.feedbackFromProfileImageUrl;
      };
      feedbackUserImage.alt = "user image";
      feedbackItem.appendChild(feedbackUserImage);

      const feedbackUserCommentNameDate = document.createElement("div");
      feedbackUserCommentNameDate.classList.add("feedback-user-comment-name-date");
      feedbackItem.appendChild(feedbackUserCommentNameDate);

      const feedbackUserComment = document.createElement("p");
      feedbackUserComment.classList.add("feedback-user-comment");
      feedbackUserComment.textContent = feedback.feedbackMessage;
      feedbackUserCommentNameDate.appendChild(feedbackUserComment);
      
      const feedbackUserNameDate = document.createElement("div");
      feedbackUserNameDate.classList.add("feedback-user-name-date");
      feedbackUserCommentNameDate.appendChild(feedbackUserNameDate);

      const feedbackUserName = document.createElement("p");
      feedbackUserName.classList.add("feedback-user-name");

      // check if isAnonymousValue
      if (feedback.isAnonymousValue === true) {
        feedbackUserName.textContent = "Anonymous";
      } else {
        feedbackUserName.textContent = feedback.feedbackFromDisplayName;
      };
      feedbackUserNameDate.appendChild(feedbackUserName);

      const feedbackDate = document.createElement("p");
      feedbackDate.classList.add("feedback-date");
      feedbackDate.textContent = feedback.createdDateTime?.toDate().toDateString();

      feedbackUserNameDate.appendChild(feedbackDate);

    });

  }


}


export default RatingFeedback;
