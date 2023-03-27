
import pubsub from "../../../classes/PubSub";
const createJobBoxElement = (arr, div) => {

  arr.forEach((job) => {

    const anchor = document.createElement("a");
    anchor.href = "javascript:void(0)";
    div.appendChild(anchor);

    anchor.addEventListener("click", () => {
      pubsub.publish("mainHeaderShowBackBtn");
      const previousShowBox = document.querySelector(".main-content div.show");
      previousShowBox?.classList.remove("show");
      const mainContent = document.querySelector(".main-content");
      const mainBox = document.querySelector(`#job-${job.id}`);
      mainContent.classList.add("show");
      mainBox.classList.add("show");
      console.log("Finished!")

    });

    const jobBox = document.createElement("div");
    jobBox.classList.add("job-box");
    jobBox.id = job.id;
    jobBox.dataset.id = job.id;
    anchor.appendChild(jobBox);

    const jobImg = document.createElement("img");
    jobImg.classList.add("job-img");
    jobImg.src = job.bannerImageUrl;
    jobBox.appendChild(jobImg);

    const jobsDetail = document.createElement("div");
    jobsDetail.classList.add("jobs-detail");
    jobBox.appendChild(jobsDetail);

    const jobTitle = document.createElement("h4");
    jobTitle.classList.add("job-title");
    jobTitle.textContent = job.positionTitle;
    jobsDetail.appendChild(jobTitle);

    const jobWage = document.createElement("p");
    jobWage.classList.add("job-wage");
    jobWage.textContent = "$" + job.wageRate + "/hr";
    jobsDetail.appendChild(jobWage);

    const jobCompany = document.createElement("p");
    jobCompany.classList.add("job-company");
    jobCompany.textContent = job.companyName;
    jobsDetail.appendChild(jobCompany);

    const jobCity = document.createElement("p");
    jobCity.classList.add("job-city");
    jobCity.textContent = job.city + ", " + job.province;
    jobsDetail.appendChild(jobCity);
  });

};

export default createJobBoxElement;