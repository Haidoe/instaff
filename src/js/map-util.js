//Convert address to coordinates using TomTom API
export const convertAddressToCoordinates = async (address) => {
  const api = `https://api.tomtom.com/search/2/geocode/${address}.json?key=${process.env.TOMTOM_API_KEY}}`;
  const response = await fetch(api);
  const data = await response.json();

  console.log("REsp", data);

  // if (data.status === "OK") {
  //   return data.results[0].position;
  // } else {
  //   return null;
  // }
};

//Convert my coordinates to address using TomTOm API
export const convertCoordinatesToAddress = async (lat, lng) => {
  const api = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=`;

  const response = await fetch(api);

  const data = await response.json();

  if (data.status === "OK") {
    return data.addresses[0];
  } else {
    return null;
  }
};
