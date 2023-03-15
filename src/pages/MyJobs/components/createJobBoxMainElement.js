
import calcStarRating from "../../../js/ratingandfeedback/calcStarRating";
import StarRating from "../../../components/star-rating/index";
import { async } from "@firebase/util";


const createJobBoxMainElement = async (arr, div, text) =>  {

  arr.forEach(async (job) => {
    const jobBoxMain = document.createElement("div");
    jobBoxMain.classList.add("job-box-main");
    jobBoxMain.id = `job-${job.id}`;
    div.appendChild(jobBoxMain);

    const jobMainHeader = document.createElement("div");
    jobMainHeader.classList.add("job-main-header");
    jobBoxMain.appendChild(jobMainHeader);

    const jobMainPageTitle = document.createElement("h2");
    jobMainPageTitle.classList.add("job-main-page-title");
    jobMainPageTitle.textContent = text;
    jobMainHeader.appendChild(jobMainPageTitle);

    const jobMainImg = document.createElement("img");
    jobMainImg.classList.add("job-main-img");
    jobMainImg.src = job.bannerImageUrl;
    jobMainHeader.appendChild(jobMainImg);

    const jobMainTitle = document.createElement("h3");
    jobMainTitle.classList.add("job-main-title");
    jobMainTitle.textContent = job.positionTitle;
    jobMainHeader.appendChild(jobMainTitle);

    const jobMainRating = document.createElement("div");
    const averageRating = await calcStarRating(job.id);
    jobMainRating.classList.add("job-main-rating");
    jobMainHeader.appendChild(jobMainRating);
    const stars = new StarRating( `${averageRating}`);
    stars.suffix = `${averageRating}` + "/" + 5;
    jobMainRating.appendChild(stars.toElement());
    jobMainHeader.appendChild(jobMainRating);


    const jobMainButton = document.createElement("button");
    jobMainButton.classList.add("primary-button");
    jobMainButton.textContent = "Start the shift";
    jobMainHeader.appendChild(jobMainButton);

    const jobMainBody = document.createElement("div");
    jobMainBody.classList.add("job-main-body");
    jobBoxMain.appendChild(jobMainBody);

    const contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    jobMainBody.appendChild(contentGroup);

    const groupjobTopicTitle = document.createElement("p");
    groupjobTopicTitle.classList.add("topic-title");
    groupjobTopicTitle.textContent = "Position";
    contentGroup.appendChild(groupjobTopicTitle);

    const groupjobContentTitle = document.createElement("p");
    groupjobContentTitle.classList.add("content-title");
    groupjobContentTitle.textContent = job.positionTitle;
    contentGroup.appendChild(groupjobContentTitle);

    const groupjobTopicAddress = document.createElement("p");
    groupjobTopicAddress.classList.add("topic-title");
    groupjobTopicAddress.textContent = "Address";
    contentGroup.appendChild(groupjobTopicAddress);

    const groupjobContentAddress = document.createElement("p");
    groupjobContentAddress.classList.add("content-title");
    groupjobContentAddress.textContent = job.address;
    contentGroup.appendChild(groupjobContentAddress);

    const groupjobTopicContact = document.createElement("p");
    groupjobTopicContact.classList.add("topic-title");
    groupjobTopicContact.textContent = "Contact";
    contentGroup.appendChild(groupjobTopicContact);

    const groupjobContentContact = document.createElement("p");
    groupjobContentContact.classList.add("content-title");
    groupjobContentContact.textContent = job.contactNumber;
    contentGroup.appendChild(groupjobContentContact);

    const groupjobTopicDescription = document.createElement("p");
    groupjobTopicDescription.classList.add("topic-title");
    groupjobTopicDescription.textContent = "Description";
    contentGroup.appendChild(groupjobTopicDescription);

    const groupjobContentDescription = document.createElement("p");
    groupjobContentDescription.classList.add("content-title");
    groupjobContentDescription.textContent = job.description;
    contentGroup.appendChild(groupjobContentDescription);

    const groupjobTopicSchedule = document.createElement("p");
    groupjobTopicSchedule.classList.add("topic-title");
    groupjobTopicSchedule.textContent = "Schedule";
    contentGroup.appendChild(groupjobTopicSchedule);

    const groupjobContentSchedule = document.createElement("p");
    groupjobContentSchedule.classList.add("content-title");
    groupjobContentSchedule.textContent = job.time.from.toDate().toDateString() + " - " + job.time.to.toDate().toDateString();
    contentGroup.appendChild(groupjobContentSchedule);

    const groupjobTopicWage = document.createElement("p");
    groupjobTopicWage.classList.add("topic-title");
    groupjobTopicWage.textContent = "Hourly Wage";
    contentGroup.appendChild(groupjobTopicWage);

    const groupjobContentWage = document.createElement("p");
    groupjobContentWage.classList.add("content-title");
    groupjobContentWage.textContent = "$" + job.wageRate + "/hr";;
    contentGroup.appendChild(groupjobContentWage);

    const groupjobTopicPayment = document.createElement("p");
    groupjobTopicPayment.classList.add("topic-title");
    groupjobTopicPayment.textContent = "Payment";
    contentGroup.appendChild(groupjobTopicPayment);

    const groupjobContentPayment = document.createElement("p");
    groupjobContentPayment.classList.add("content-title");
    groupjobContentPayment.textContent = "Cash Only";
    contentGroup.appendChild(groupjobContentPayment);
  });

};

export default createJobBoxMainElement;

