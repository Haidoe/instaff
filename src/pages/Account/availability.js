import { async } from "@firebase/util";
import EmployeePage from "../../classes/EmployeePage";
import {
  getProfile,
  getAvailabilityByUserId,
  updateAvailability,
  setAvailability,
} from "../../js/account-setting/account";
import "./account.scss";

class Availability extends EmployeePage {
  constructor() {
    super("Availability");
  }

  async load() {
    let results = await getAvailabilityByUserId(this.currentUser.uid);
    console.log(results);
    const checkList = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    var htmlString = `
        <div class="account-page availability-page">
                  <h2 id="displayName">When are you availiable to work?</h2>
                  <form action="#" id="availabilityForm"><div class="availability">`;

    console.log(results);

    checkList.forEach((item) => {
      let findItem = undefined;

      if (results.length > 0) {
        if (results[0].days !== undefined) {
          findItem = results[0].days.find(
            (e) => e.toLowerCase() == item.toLowerCase()
          );
        }
      }

      htmlString += `
                  <div class="form-group">
                    <input type="checkbox" id="${item.toLowerCase()}" name="availability" value="${item}" ${
        findItem != undefined ? "checked" : ""
      } />
                    <label for="${item.toLowerCase()}">${item}</label>
                  </div>
            `;
    });

    htmlString += `
                <div class="button-container">
                <button type="submit" id="submitBtn">Save</button>
              </div></div>
          </form>
          </div > `;

    return htmlString;
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    const form = document.querySelector("#availabilityForm");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";

    let form = document.querySelector("#availabilityForm");
    let checkBoxes = form.querySelectorAll('input[type="checkbox"]');

    const availability = {
      userId: this.profileId,
      days: [],
    };

    checkBoxes.forEach((item) => {
      if (item.checked) {
        availability.days.push(item.value); //stored the objects to result array
      }
    });

    let results = await getAvailabilityByUserId(availability.userId);

    try {
      if (results.length > 0) {
        await updateAvailability(results[0].id, availability);
      } else {
        await setAvailability(availability);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtn.innerHTML = "Save";
    }
  }
}

export default Availability;
