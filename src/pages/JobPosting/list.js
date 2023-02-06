import Page from "../../classes/Page";
import { getAllJobPostings } from "../../js/job-posting/job-posting";

class PostingList extends Page {
  constructor() {
    super("Job Postings");
  }

  async load() {
    return `
      <div class="job-posting-list-page">
        <h2> Job Posting List </h2>

        <ul id="jobPostings">
          Loading...
        </ul>
      </div>
    `;
  }

  async mounted() {
    const ulList = document.querySelector("#jobPostings");

    const postings = await getAllJobPostings();

    if (!postings.length) {
      ulList.innerHTML = `
        <div> 
          No Job Posting. 
          <a href="/job-posting" data-link>
            Add now by clicking me.
          </a>
        </div>
      `;
      return;
    }

    ulList.innerHTML = "";
    postings.forEach((item) => {
      ulList.innerHTML += `
        <div>
          <a href="/job-posting/${item.id}">
            ${item.positionTitle} | ${item.companyName} | ${item.address}
          </a>
        </div>
      `;
    });
  }
}

export default PostingList;
