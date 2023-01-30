import Pages from "../classes/Page";

class NotFound extends Pages {
  constructor() {
    super("Page not Found");
  }

  load() {
    return `
      <h2> Page not Found </h2>
      <div>
        <a href="/" data-link>Go Back to Home Page </a>
      </div>
    `;
  }
}

export default NotFound;
