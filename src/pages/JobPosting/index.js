import Page from "../../classes/Page";
import "./job-posting.scss";

class JobPosting extends Page {
  constructor() {
    super("Job Posting");
  }

  async load() {
    return `
      <div class="job-posting-page">
        <h2> Hello Job Posting </h2>

        <form action="#" id="jobPostingForm">
          <div class="form-group">
            <label for="postingBanner">Upload Image</label>
            <input required type="file" id="postingBanner">
            <!-- <img src="" alt="test" id="imgTest"> -->
            <div id="imgTest"></div>
          </div>
          
          <div class="form-group">
            <label for="companyName">
              Company Name
            </label>
        
            <input required type="text" id="companyName">
          </div>
        
          <div class="form-group">
            <label for="positionTitle">Position Title</label>
            <input required type="text" id="positionTitle">
          </div>
        
          <div class="form-group">
            <label for="shiftDate">Shift Date</label>
            <input required type="date" id="shiftDate">
          </div>
        
          <div class="form-group">
            <label for="fromTime">
              Time:
            </label>
            <input required type="text" id="fromTime">
            <span>to</span>
            <input required type="text" id="toTime">
          </div>
        
          <div class="form-group">
            <label for="wage">Wage ($)</label>
            <input required type="number" id="wage">
          </div>
        
          <div class="form-group">
            <label for="positionAvailable">Position Available</label>
            <input required type="number" id="positionAvailable">
          </div>
        
          <div class="form-group">
            <label for="description">
              Description
            </label>
        
            <textarea required id="description"></textarea>
          </div>
        
          <div class="form-group">
            <label for="additionalInfo">
              Additional Information
            </label>
        
            <textarea required id="additionalInfo"></textarea>
          </div>
        
          <div class="form-group">
            <label for="location">
              Location
            </label>
        
            <input required type="text" id="location">
          </div>
        
          <div class="form-group">
            <label for="address">Address</label>
            <input required type="text" id="address">
          </div>
        
          <button type="submit">Submit</button>
        </form>
      </div>
    `;
  }

  async mounted() {}
}

export default JobPosting;