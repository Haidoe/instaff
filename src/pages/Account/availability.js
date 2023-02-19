import { async } from "@firebase/util";
import EmployeePage from "../../classes/EmployeePage";
import {
  getProfile,
  getTypeOfWorkByUserId,
  updatetypeOfWork,
  setTypeOfWorkInfo,
  getAvailiabilityByUserId,
  updateAvailiability,
  setAvailiability,
} from "../../js/account-setting/account";

class Availiability extends EmployeePage {
  constructor() {
    super("Availiability");
  }

  async load() {
    let results = await getTypeOfWorkByUserId(this.currentUser.uid);
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
        <div class="availiability-page">
                  <h2 id="displayName">When are you availiable to work?</h2>
                  <form action="#" id="availiabilityForm">`;

    console.log(results);

    checkList.forEach((item) => {
      let findItem = undefined;

      if (results.length > 0) {
        if (results[0].positionTitle !== undefined) {
          findItem = results[0].positionTitle.find(
            (e) => e.toLowerCase() == item.toLowerCase()
          );
        }
      }

      htmlString += `
                  <div class="form-group">
                    <input type="checkbox" id="${item.toLowerCase()}" name="availiability" value="${item}" ${
        findItem != undefined ? "checked" : ""
      } />
                    <label for="${item.toLowerCase()}">${item}</label>
                  </div>
            `;
    });

    htmlString += `
                <div class="button-container">
                <button type="submit" id="submitBtn">Save</button>
              </div>
          </form>
          </div > `;

    return htmlString;
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    const form = document.querySelector("#availiabilityForm");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    console.log("Hello");

    let form = document.querySelector("#availiabilityForm");
    let checkBoxes = form.querySelectorAll('input[type="checkbox"]');

    const availiability = {
      userId: this.profileId,
      days: [],
    };

    checkBoxes.forEach((item) => {
      if (item.checked) {
        availiability.days.push(item.value); //stored the objects to result array
      }
    });

    let results = await getAvailiabilityByUserId(availiability.userId);
    console.log(results);
    if (results.length > 0) {
      await updateAvailiability(results[0].id, availiability);
    } else {
      await setAvailiability(availiability);
    }
  }
}

export default Availiability;
