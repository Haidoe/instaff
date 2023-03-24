const recentJobs = (obj) => {
  const anchorWrapper = document.createElement("a");
  anchorWrapper.href = "javascript:void(0)";

  anchorWrapper.addEventListener("click", (e) => {
    e.preventDefault();

    if (window.innerWidth < 768) {
      const url = new URL(window.location);
      url.hash = `jp-${obj.id}`;
      window.history.pushState({}, "", url);
    }
  });

  const article = document.createElement("article");
  article.id = `jp-${obj.id}`;

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
  applicants.className = "applied-candidates";
  applicants.innerHTML = `Applied Candidates: <span>${
    obj.numOfCandidates ?? 0
  }</span>`;

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
