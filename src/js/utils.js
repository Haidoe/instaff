// Used in the router.js
//Transforming the path url to array
export const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

//Extracting the slug -- returns an object --- used in
export const getParams = (match) => {
  if (!match) return false;

  const values = match.result.slice(1);
  const keys = Array.from(match.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

//Used to display images
// convert file to a base64 url
export const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
};

//Date
export const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

//Extract Time from Date
export const extractTime = (date) => {
  const convertToDate = date.toDate();
  let hour = `${convertToDate.getHours()}`;
  let minute = `${convertToDate.getMinutes()}`;

  if (hour.length < 2) hour = "0" + hour;

  if (minute.length < 2) minute = "0" + minute;

  return [hour, minute].join(":");
};
