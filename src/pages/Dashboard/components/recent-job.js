import { formatDate } from "../../../js/utils";

const recentJobs = (obj) => {
  const anchorWrapper = document.createElement("a");
  anchorWrapper.href = "javascript:void(0)";

  const article = document.createElement("article");

  const details = document.createElement("div");
  details.className = "details";

  const img = document.createElement("img");
  img.src = obj.bannerImageUrl;

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("h4");
  title.textContent = obj.positionTitle;

  const wage = document.createElement("p");
  wage.textContent = `$${obj.wageRate} / hr`;

  const postedDate = document.createElement("p");
  // const parsedDate = this.data.shiftDate.toDate().toDateString();
  console.log(obj);
  postedDate.textContent = `Posted Date: ${obj.created
    .toDate()
    .toDateString()} `;

  content.appendChild(title);
  content.appendChild(wage);
  content.appendChild(postedDate);

  details.appendChild(img);
  details.appendChild(content);

  const meta = document.createElement("div");
  meta.className = "article-meta";

  const applicants = document.createElement("p");
  applicants.innerHTML = `Applied Candidates: <span>${obj.totalApplicants}</span>`;

  const positions = document.createElement("p");
  positions.innerHTML = `Positions Available: <span>${obj.totalPositionAvailableLeft}</span> / <span>${obj.positionAvailable}</span>`;

  meta.appendChild(applicants);
  meta.appendChild(positions);

  article.appendChild(details);
  article.appendChild(meta);

  anchorWrapper.appendChild(article);

  return anchorWrapper;
};

export default recentJobs;
