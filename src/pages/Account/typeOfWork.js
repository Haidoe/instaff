import { async } from "@firebase/util";
import { getFirestore, getDoc, doc, collection } from "firebase/firestore";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import EmployeePage from "../../classes/EmployeePage";
import {
  getProfile,
  getTypeOfWorkByUserId,
  updatetypeOfWork,
  setTypeOfWorkInfo,
} from "../../js/account-setting/account";
import "./account.scss";

class TypeOfWork extends EmployeePage {
  constructor() {
    super("Type Of Work");
  }

  async load() {
    let results = await getTypeOfWorkByUserId(this.currentUser.uid);
    console.log(results);
    const checkList = [
      "Barista",
      "Dishwasher",
      "EventServer",
      "Bartender",
      "CounterStaff",
      "EventSetup",
      "WarehouseAssociate",
      "Barback",
      "Busser",
      "Custodial",
    ];

    var htmlString = `
    <div class="account-page type-of-work-page">
              <h2 id="displayName">What type of work are you interested in?</h2>
              <form action="#" id="typeOfWorkForm"><div class="type-of-work">`;

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
                <input type="checkbox" class="logo" id="${item.toLowerCase()}" name="workType" value="${item}" ${
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
      </form></div>
      </div > `;

    return htmlString;
  }

  async init() {
    if (
      typeof this.data.imageURL !== "undefined" &&
      this.data.imageURL !== ""
    ) {
      profileImg.src = this.data.imageURL;
    }
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    const form = document.querySelector("#typeOfWorkForm");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";

    let form = document.querySelector("#typeOfWorkForm");
    let checkBoxes = form.querySelectorAll('input[type="checkbox"]');

    const typeOfWork = {
      userId: this.profileId,
      positionTitle: [],
    };

    checkBoxes.forEach((item) => {
      if (item.checked) {
        typeOfWork.positionTitle.push(item.value); //stored the objects to result array
      }
    });

    let results = await getTypeOfWorkByUserId(typeOfWork.userId);
    try {
      if (results.length > 0) {
        await updatetypeOfWork(results[0].id, typeOfWork);
      } else {
        await setTypeOfWorkInfo(typeOfWork);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtn.innerHTML = "Save";
    }
  }
}

export default TypeOfWork;
