import AuthenticatedPage from "../../classes/AuthenticatedPage";
import "./ratingandfeedback.scss";


import { getUserDetails } from "../../js/users";
import { getJobPostingDetail } from "../../js/job-posting/job-posting";
import { addRatingAndFeedback } from "../../js/ratingandfeedback";

class RatingAndFeedback extends AuthenticatedPage {
  constructor() {
    super("RatingAndFeedback");
  }

  async load() {
    return `
       <div class="rating-page">
        <div class="title-container">
          <h1>Thank you!</h1>
          <h2>Your shift had ended.</h2>
        </div>

        <div class="job-container">
        <img class="user-image" src="">
          <div class="job-info">
            <h3><span class = "company-name"></span></h3>
            <p>Position: <span class = "position-title"></span></p>
          </div>
        </div>

        <div class="rating-container">
          <h3>Rate your experience</h3>
          <div class="stars_rating">
            <span><i class="fa-solid fa-star star" data-rating="1"></i></span>
            <span><i class="fa-solid fa-star star" data-rating="2"></i></span>
            <span><i class="fa-solid fa-star star" data-rating="3"></i></span>
            <span><i class="fa-solid fa-star star" data-rating="4"></i></span>
            <span><i class="fa-solid fa-star star" data-rating="5"></i></span>
          </div>

          <span class="rating-value"></span>

          <div class="feedback-container">
            <div class="feedback-title">
              <h3>Please provide your feedback</h3>
            </div>

            <textarea name="feedback" id="feedback" cols="30" rows="10" placeholder="Tell us how we can improve"></textarea>
          </div>

          <div class="isanonymous"><input type="checkbox" name="isanonymous" id="isanonymous">
            <label for="isanonymous">Submit as anonymous</label>
          </div>

          <button class="submit">Submit feedback</button>
        </div>
      </div>
    `;
  }

  async mounted() {
    const stars = document.querySelectorAll(".star");
    const ratingValue = document.querySelector(".rating-value");
    const feedback = document.querySelector("#feedback");
    const isAnonymous = document.querySelector("#isanonymous");
    const btnSubmit = document.querySelector(".submit");
    let rating = 0;

    /*------- stars event listener -------*/
    stars.forEach((star) => {
      star.addEventListener("click", (event) => {
        rating = parseFloat(event.target.getAttribute("data-rating"));
        const maxRating = 5;

        stars.forEach((star) => {
          star.classList.remove("selected");
          if (
            parseFloat(star.getAttribute("data-rating")) <= rating &&
            parseFloat(star.getAttribute("data-rating")) <= maxRating
          ) {
            star.classList.add("selected");
          }
        });

        //output rating value
        ratingValue.textContent = `${rating}/5`;
      });
    });
    /*------- stars event listener -------*/

    //get "users" collection from
    const userData = await getUserDetails(this.currentUser.uid);


    //create job posting id static
    const staticId = "qx34OUbaBrLnz1UWSsPP";

    const jobPostingsData = await getJobPostingDetail(staticId);

    //populate job posting data
    const populateCompany = document.querySelector(".company-name");
    populateCompany.innerHTML = jobPostingsData.companyName;
    const populatePosition = document.querySelector(".position-title");
    populatePosition.innerHTML = jobPostingsData.positionTitle;

    //populate user image
    const populateUserImage = document.querySelector(".user-image");
    populateUserImage.src = userData.imageURL;
    //collection
    const jobPostingId = staticId;
    const positionTitle = jobPostingsData.positionTitle;
    const companyName = jobPostingsData.companyName;
    const feedbackFrom = this.currentUser.uid;
    const feedbackFromProfileImageUrl = userData.imageURL;
    const feedbackTo = jobPostingsData.userId;
    const feedbackToProfileImageUrl = jobPostingsData.bannerImageUrl;

    //submit button event listener
    btnSubmit.addEventListener("click", async (event) => {
      event.preventDefault();

      const ratingAndFeedback = {
        typeOfUser: userData.typeOfUser,
        jobPostingId: jobPostingId,
        positionTitle: positionTitle,
        companyName: companyName,
        rating: rating,
        feedbackFrom: feedbackFrom,
        feedbackFromProfileImageUrl: feedbackFromProfileImageUrl,
        feedbackTo: feedbackTo,
        feedbackToProfileImageUrl: feedbackToProfileImageUrl,
        feedbackMessage: feedback.value,
        isAnonymousValue: isAnonymous.checked,
      };

      const response = await addRatingAndFeedback(ratingAndFeedback);
      console.log(response);
    });
  }
}
export default RatingAndFeedback;
