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

        <div id="temp"></div>
      </div>
    `;
  }

  async mounted() {
    // TODO - Remove this in the future
    // This is just temporary
    const temp = document.querySelector("#temp");
    temp.innerHTML = "";

    const user = await this.getCurrentUser();
    if (user) {
      const button = document.createElement("button");
      button.textContent = "Sign out";
      button.onclick = this.signOutUser;
      temp.appendChild(button);
    }
  }
}

export default Home;
