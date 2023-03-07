import "./star-rating.scss";

class StarRating {
  constructor(rating, readOnly = true) {
    this.rating = rating;

    this.isReadOnly = readOnly;

    this.handleStarClick = (index) => {
      this.rating = index;
      this.rerender();
    };

    this.suffix = null;
  }

  createStar(index) {
    const starCircle = document.createElement("div");
    starCircle.className = "star-circle";
    const star = document.createElement("div");
    star.className = "icon star-icon";
    star.setAttribute("data-index", index + 1);

    if (index < this.rating) {
      starCircle.classList.add("active");
    }

    starCircle.addEventListener("click", (e) => {
      if (e.target.dataset.index && !this.isReadOnly) {
        this.handleStarClick(e.target.dataset.index);
      }
    });

    starCircle.appendChild(star);
    return starCircle;
  }

  rerender() {
    this.wrapper.innerHTML = "";

    for (let i = 0; i < 5; i++) {
      this.wrapper.appendChild(this.createStar(i));
    }
  }

  toElement() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "star-rating-wrapper";

    if (this.isReadOnly) {
      this.wrapper.classList.add("read-only");
    }

    for (let i = 0; i < 5; i++) {
      this.wrapper.appendChild(this.createStar(i));
    }

    if (this.suffix) {
      const span = document.createElement("span");
      span.className = "star-suffix";
      span.textContent = this.suffix;
      this.wrapper.appendChild(span);
    }

    return this.wrapper;
  }
}

export default StarRating;
