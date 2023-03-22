
import calcStarRating from "../../../js/ratingandfeedback/calcStarRating";
import StarRating from "../../../components/star-rating/index";
import startTheShift from "../../../js/applicants/startTheShift";
import { async } from "@firebase/util";


const createJobBoxMainElement = async (arr, div, text, btnType, btnText) =>  {

  arr.forEach(async (job) => {
    const jobBoxMain = document.createElement("div");
    jobBoxMain.classList.add("job-box-main");
    jobBoxMain.id = `job-${job.id}`;
    div.appendChild(jobBoxMain);

    const jobMainHeader = document.createElement("div");
    jobMainHeader.classList.add("job-main-header");
    jobBoxMain.appendChild(jobMainHeader);

    const jobMainHeaderColLeft = document.createElement("div");
    jobMainHeaderColLeft.classList.add("job-main-header-col-left");
    jobMainHeader.appendChild(jobMainHeaderColLeft);

    const jobMainPageTitle = document.createElement("h2");
    jobMainPageTitle.classList.add("job-main-page-title");
    jobMainPageTitle.textContent = text;
    jobMainHeaderColLeft.appendChild(jobMainPageTitle);

    const jobMainImg = document.createElement("img");
    jobMainImg.classList.add("job-main-img");
    jobMainImg.src = job.bannerImageUrl;
    jobMainHeaderColLeft.appendChild(jobMainImg);

    const jobMainTitle = document.createElement("h3");
    jobMainTitle.classList.add("job-main-title");
    jobMainTitle.textContent = job.companyName
    jobMainHeaderColLeft.appendChild(jobMainTitle);

    const jobMainRating = document.createElement("div");
    const averageRating = await calcStarRating(job.id);
    jobMainRating.classList.add("job-main-rating");
    jobMainHeader.appendChild(jobMainRating);
    const stars = new StarRating( `${averageRating}`);
    stars.suffix = `${averageRating}` + "/" + 5;
    jobMainRating.appendChild(stars.toElement());
    jobMainHeaderColLeft.appendChild(jobMainRating);

    const jobMainHeaderColRight = document.createElement("div");
    jobMainHeaderColRight.classList.add("job-main-header-col-right");
    jobMainHeader.appendChild(jobMainHeaderColRight);

    const jobMainButton = document.createElement("button");
    jobMainButton.classList.add(btnType);
    jobMainButton.textContent = btnText;
    jobMainHeaderColRight.appendChild(jobMainButton);

    const jobMainBody = document.createElement("div");
    jobMainBody.classList.add("job-main-body");
    jobBoxMain.appendChild(jobMainBody);

    const contentGroup1 = document.createElement("div");
    contentGroup1.classList.add("content-group");
    jobMainBody.appendChild(contentGroup1);

    const groupjobTopicTitle = document.createElement("p");
    groupjobTopicTitle.classList.add("topic-title");
    groupjobTopicTitle.textContent = "Position";
    contentGroup1.appendChild(groupjobTopicTitle);

    const groupjobContentTitle = document.createElement("p");
    groupjobContentTitle.classList.add("content-title");
    groupjobContentTitle.textContent = job.positionTitle;
    contentGroup1.appendChild(groupjobContentTitle);

    const contentGroup2 = document.createElement("div");
    contentGroup2.classList.add("content-group");
    jobMainBody.appendChild(contentGroup2);

     const groupjobTopicAddress = document.createElement("p");
    groupjobTopicAddress.classList.add("topic-title");
    groupjobTopicAddress.textContent = "Address";
    contentGroup2.appendChild(groupjobTopicAddress);

    const groupjobContentAddress = document.createElement("p");
    groupjobContentAddress.classList.add("content-title");
    groupjobContentAddress.textContent = job.address;
    contentGroup2.appendChild(groupjobContentAddress);

    const contentGroup3 = document.createElement("div");
    contentGroup3.classList.add("content-group");
    jobMainBody.appendChild(contentGroup3);

    const groupjobTopicContact = document.createElement("p");
    groupjobTopicContact.classList.add("topic-title");
    groupjobTopicContact.textContent = "Contact";
    contentGroup3.appendChild(groupjobTopicContact);

    const groupjobContentContact = document.createElement("p");
    groupjobContentContact.classList.add("content-title");
    groupjobContentContact.textContent = job.contactNumber;
    contentGroup3.appendChild(groupjobContentContact);

    const contentGroup4 = document.createElement("div");
    contentGroup4.classList.add("content-group");
    jobMainBody.appendChild(contentGroup4);

    const groupjobTopicDescription = document.createElement("p");
    groupjobTopicDescription.classList.add("topic-title");
    groupjobTopicDescription.textContent = "Description";
    contentGroup4.appendChild(groupjobTopicDescription);

    const groupjobContentDescription = document.createElement("p");
    groupjobContentDescription.classList.add("content-title");
    groupjobContentDescription.textContent = job.description;
    contentGroup4.appendChild(groupjobContentDescription);

    const contentGroup5 = document.createElement("div");
    contentGroup5.classList.add("content-group");
    jobMainBody.appendChild(contentGroup5);

    const groupjobTopicSchedule = document.createElement("p");
    groupjobTopicSchedule.classList.add("topic-title");
    groupjobTopicSchedule.textContent = "Schedule";
    contentGroup5.appendChild(groupjobTopicSchedule);

    //format time "Feb 21, 2018, 5:00 PM - 8:00 PM"
    const startTime = job.time.from.toDate()
    const endTime = job.time.to.toDate()

    const dateOptions = {
      weekday: 'long', // Add this line to include the day of the week
      // year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    const timeOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    const startDateString = startTime.toLocaleString('en-US', dateOptions);
    const startTimeString = startTime.toLocaleString('en-US', timeOptions);
    const endDateString = endTime.toLocaleString('en-US', dateOptions);
    const endTimeString = endTime.toLocaleString('en-US', timeOptions);

    const formattedDateTime = `${startDateString}, ${startTimeString} - ${endDateString}, ${endTimeString}`;

    //end of format time

    const groupjobContentSchedule = document.createElement("p");
    groupjobContentSchedule.classList.add("content-title");
    groupjobContentSchedule.textContent = formattedDateTime;
    contentGroup5.appendChild(groupjobContentSchedule);

    const contentGroup6 = document.createElement("div");
    contentGroup6.classList.add("content-group");
    jobMainBody.appendChild(contentGroup6);

    const groupjobTopicWage = document.createElement("p");
    groupjobTopicWage.classList.add("topic-title");
    groupjobTopicWage.textContent = "Hourly Wage";
    contentGroup6.appendChild(groupjobTopicWage);

    const groupjobContentWage = document.createElement("p");
    groupjobContentWage.classList.add("content-title");
    groupjobContentWage.textContent = "$" + job.wageRate + "/hr";;
    contentGroup6.appendChild(groupjobContentWage);

    const contentGroup7 = document.createElement("div");
    contentGroup7.classList.add("content-group");
    jobMainBody.appendChild(contentGroup7);

    const groupjobTopicPayment = document.createElement("p");
    groupjobTopicPayment.classList.add("topic-title");
    groupjobTopicPayment.textContent = "Payment";
    contentGroup7.appendChild(groupjobTopicPayment);

    const groupjobContentPayment = document.createElement("p");
    groupjobContentPayment.classList.add("content-title");
    groupjobContentPayment.textContent = "Cash Only";
    contentGroup7.appendChild(groupjobContentPayment);
  });

};

export default createJobBoxMainElement;

