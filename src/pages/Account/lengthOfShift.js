import { async } from "@firebase/util";
import { getFirestore, getDoc, doc, collection } from "firebase/firestore";
import AuthenticatedPage from "../../classes/AuthenticatedPage";
import EmployeePage from "../../classes/EmployeePage";
import {
  getProfile,
  getLengthOfShiftByUserId,
  setLengthOfShift,
  updatelengthOfShift,
} from "../../js/account-setting/account";
import { extractTime } from "../../js/utils";
import "./account.scss";

class LengthOfShift extends EmployeePage {
  constructor() {
    super("Length of Shift");
  }

  async load() {
    const checkList = [];
    //checkList.length = 5;
    for (let i = 0; i < 5; i++) {
      // let hour = i == 0 ? 12 : i > 12 ? i - 12 : i;
      // let ampm = i > 12 ? "PM" : "AM";

      checkList.push({
        ctrlId: "checkbox_timeslot_" + i,
        // value: hour + ":00 " + ampm + " - " + hour + ":59 " + ampm,
        // text: hour + ":00 " + ampm,
      });
    }

    let results = await getLengthOfShiftByUserId(this.currentUser.uid);

    let htmlString = `
    <div class="account-page length-of-shift-page">
              <h2 id="displayName">Which shift are you interested in?</h2>         
              <form action="#" id="lengthOfShiftForm">             
              <div class="length-of-shift">
              <div class="form-group">
              <div></div>
                <div>
                  <label for="fromTime">Start Time</label>
                </div>
                <div>
                  <label for="toTime">End Time</label>                  
                </div>
              </div>
              `;

    checkList.forEach((item) => {
      let findItem = undefined;
      let idx = checkList.indexOf(item);

      if (results.length) {
        if (results[0].time != undefined && results[0].time.length > idx) {
          findItem = results[0].time[idx];
        }
      }

      htmlString += `
              <div class="form-group">
              <div>Shift ${idx + 1}</div>
                <div>
                <input type="time" id="fromTime_${idx}" value="${
        findItem != undefined ? findItem.from : ""
      }" >
                </div>
                <div>
                  <input type="time" id="toTime_${idx}" value="${
        findItem != undefined ? findItem.to : ""
      }" >
                </div>
              </div>
        `;
    });

    htmlString += `</div>
            <div class="button-container">
            <button type="submit" id="submitBtn">Save</button>
          </div>
      </form></div>
      </div > `;
    return htmlString;
  }

  async mounted() {
    this.profileId = this.currentUser.uid;
    const snap = await getProfile(this.profileId);
    const user = snap.data();
    this.data = user;
    const form = document.querySelector("#lengthOfShiftForm");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Saving...";
    let form = document.querySelector("#lengthOfShiftForm");
    let fromTimes = form.querySelectorAll('input[id^="fromTime_"]');

    const lengthOfShift = {
      userId: this.profileId,
      time: [],
    };

    fromTimes.forEach((item) => {
      if (item.value !== "") {
        let closestParent = item.closest("div .form-group");
        let toTime = closestParent.querySelector('input[id^="toTime_"]');

        let _from = item.value.trim();
        let _to = toTime.value.trim();

        lengthOfShift.time.push({ from: _from, to: _to });
      }
    });

    let results = await getLengthOfShiftByUserId(lengthOfShift.userId);
    try {
      if (results.length > 0) {
        await updatelengthOfShift(results[0].id, lengthOfShift);
      } else {
        await setLengthOfShift(lengthOfShift);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      submitBtn.innerHTML = "Save";
    }
  }
}

export default LengthOfShift;
