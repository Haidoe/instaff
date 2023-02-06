import Pages from "../classes/Page";
import "./home.scss";
class Home extends Pages {
  constructor() {
    super("Home");
  }

  async load() {
    return `
      <div class="home-page">
        <h2> Home Page</h2>

        <ul>
          <li>
            <a href="/job-posting" data-link>
              Post a Job
            </a>
          </li>

          <li>
            <a href="/job-postings" data-link>
              List of Job Posting
            </a>
          </li>
        </ul>
      </div>
    `;
  }
}

export default Home;
