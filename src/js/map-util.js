//Convert address to coordinates using TomTom API
export const convertAddressToCoordinates = async (address) => {
  const api = `https://api.tomtom.com/search/2/search/${address}.json?key=${process.env.INSTAFF_MAP_KEY}`;
  try {
    const response = await fetch(api);
    const data = await response.json();

    if (data.results.length) {
      // console.log(data.results);
      return data.results[0].position;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

//Convert my coordinates to address using TomTOm API
export const convertCoordinatesToAddress = async (lat, lng) => {
  const api = `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${process.env.INSTAFF_MAP_KEY}`;

  const response = await fetch(api);

  const data = await response.json();

  if (data.addresses.length) {
    return data.addresses[0].address;
  }
};
