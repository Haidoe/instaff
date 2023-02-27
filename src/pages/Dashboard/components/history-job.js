const historyJob = (obj) => {
  const anchorWarpper = document.createElement("a");
  anchorWarpper.href = "javascript:void(0)";

  const article = document.createElement("article");

  const img = document.createElement("img");
  img.src = obj.bannerImageUrl;
  img.alt = "Job Posting Banner Image";

  article.appendChild(img);

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("h4");
  title.textContent = obj.positionTitle;
  content.appendChild(title);

  const wage = document.createElement("p");
  wage.textContent = `$${obj.wageRate} / hr`;
  content.appendChild(wage);

  const address = document.createElement("p");
  address.textContent = obj.address;
  content.appendChild(address);

  const cityProvince = document.createElement("p");
  cityProvince.textContent = `${obj.city}, ${obj.province}`;
  content.appendChild(cityProvince);

  article.appendChild(content);
  anchorWarpper.appendChild(article);
  return anchorWarpper;
};

export default historyJob;
