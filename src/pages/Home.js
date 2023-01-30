import Pages from "../classes/Page";

class Home extends Pages {
  constructor() {
    super("Home");
  }

  load() {
    return `
      <h2> Welcome to Home Page</h2>
      <ul>
        <li>
          <a href="/test/1asdas" data-link>
            Redirect I
          </a>
        </li>

        <li>
          <a href="/test/another" data-link>
          Redirect II
          </a>
        </li>

        <li>
          <a href="/test/another2" data-link>
            Redirect III
          </a>
        </li>
      </ul>
    `;
  }
}

export default Home;
