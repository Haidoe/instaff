import Pages from "../../classes/Page";
import Template from "./home.html";
import "./home.scss";
class Home extends Pages {
  constructor() {
    super("Home");
  }

  async load() {
    return Template;
  }

  handleSearch() {}

  async mounted() {
    document.querySelector("body").classList.add("home-body");

    //DATA INIT
    const defaultCenter = {
      lat: 49.23512376137244,
      lng: -123.03851521512506,
    };
    const defaultZoom = 15;

    var map = tt.map({
      key: "Tjiz7MbN6HeICEOR1UsO5JGJGW1xF3fN",
      container: "home-page",
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: defaultZoom,
      // dragPan: !isMobileOrTablet()
    });

    map.addControl(new tt.NavigationControl());

    let markersOnTheMap = {};
    let pointIDinsideView = [];

    var eventListenersAdded = false;

    function getRandomNumberInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function generateRandomPoints(
      amount,
      range_lot_from,
      range_lot_to,
      range_lat_from,
      range_lat_to
    ) {
      let result = [];
      let numberOfPoints = 1;
      let type_value = "normal";

      let wage_temp = 0;
      let random_photo_seed = 0;
      let jobs = ["Dishwasher", "Cashier", "Dasher", "Tutor"];
      let jobs_index_temp = 0;

      while (numberOfPoints < amount) {
        type_value = numberOfPoints % 10 == 0 ? "matched" : "normal";
        wage_temp = Math.floor(getRandomNumberInRange(10, 20));
        random_photo_seed = Math.floor(getRandomNumberInRange(1, 10));
        jobs_index_temp = Math.floor(getRandomNumberInRange(0, 3));

        result.push({
          coordinates: [
            getRandomNumberInRange(range_lot_from, range_lot_to),
            getRandomNumberInRange(range_lat_from, range_lat_to),
          ],
          properties: {
            id: numberOfPoints,
            type: type_value,
            name: "Point_" + String(numberOfPoints),
            address: "Napolitana Express Vancouver, BC",
            job_title: jobs[jobs_index_temp],
            wage: `$${wage_temp}.00/hr`,
            img: `https://picsum.photos/200/300?random=${random_photo_seed}`,
          },
        });
        numberOfPoints = numberOfPoints + 1;
      }
      return result;
    }

    function clickArticle(index) {
      const pop_divs = document.getElementsByClassName("div_page");
      // console.log(pop_divs)
      if (pop_divs.length > 0) {
        pop_divs[0].remove();
      }
      let popDiv = document.createElement("div");
      popDiv.className = "div_page";

      map.easeTo({
        center: points1[index].coordinates,
      });

      popDiv.innerHTML = `   
     <div class="popdiv">
        <p class="popdiv-id">${points1[index].properties.id}</p>
        <img src=${points1[index].properties.img}></img>
        <p>Name: ${points1[index].properties.name}</p>
        <p>Position: ${points1[index].properties.job_title}</p>
        <p>Address: <p>${points1[index].properties.address}</p>
        <p>Description: </p>
        <p>Hourly Wage: ${points1[index].properties.wage}</p>
     <div class="close_button"><img src="../static/images/close_icon.png" alt=""></div></div>`;
      document.body.appendChild(popDiv);

      const close_button = document.getElementsByClassName("close_button");

      close_button[0].addEventListener("click", function (e) {
        if (popDiv) {
          popDiv.remove();
        }
      });
    }

    function clickMarker() {
      // console.log(this.style)

      console.log(this.id);

      const selectMark = document.getElementById(this.id);

      console.log("Log clicked marker", selectMark);

      //TODO: Toggle it to be selected, doesn't work.
      selectMark.classList.add("selected");

      //Issue: cannot you ID for checking exist popdiv.
      const pop_divs = document.getElementsByClassName("div_page");
      console.log(pop_divs);
      if (pop_divs.length > 0) {
        pop_divs[0].remove();
      }

      console.log(this.id + "clicked");

      let job_temp_index = parseInt(this.id.slice(6) - 1);

      map.easeTo({
        center: points1[job_temp_index].coordinates,
      });

      let popDiv = document.createElement("div");
      popDiv.className = "div_page";

      popDiv.innerHTML = `   
     <div class="popdiv">
        <p class="popdiv-id">${points1[job_temp_index].properties.id}</p>
        <img src=${points1[job_temp_index].properties.img}></img>
        <p>Name: ${points1[job_temp_index].properties.name}</p>
        <p>Position:${points1[job_temp_index].properties.job_title}</p>
        <p>Address: <p>${points1[job_temp_index].properties.address}</p>
        <p>Description: </p>
        <p>Hourly Wage: ${points1[job_temp_index].properties.wage}</p>
     <div class="close_button"><img src="../static/images/close_icon.png" alt=""></div></div>`;
      document.body.appendChild(popDiv);

      const close_button = document.getElementsByClassName("close_button");

      close_button[0].addEventListener("click", function (e) {
        if (popDiv) {
          popDiv.remove();
        }
      });
    }

    function createMarker(position, popupText, marker_class, marker_id) {
      var markerElement = document.createElement("div");
      markerElement.className = "marker";

      var markerContentElement = document.createElement("div");
      markerContentElement.className = marker_class;
      markerElement.appendChild(markerContentElement);

      markerContentElement.id = `marker${marker_id}`;
      markerContentElement.addEventListener("click", clickMarker);

      var iconElement = document.createElement("div");
      iconElement.className = "marker-icon";

      if (marker_class == "marker-matched") {
        iconElement.style.backgroundImage =
          "url(http://127.0.0.1:5500/img/dollar.png)";
      }

      markerContentElement.appendChild(iconElement);

      let popupHTML = `
      <div class="popup">This is the window for ${popupText}. </div>      
      `;

      var popup = new tt.Popup({ offset: 30 }).setHTML(popupHTML);
      // add marker to map
      let newMarker = new tt.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat(position)
        .setPopup(popup)
        .addTo(map);

      return newMarker;
    }

    //INIT
    const totalPoints = 60;
    const range_lat_from = 49.2728363724651;
    const range_lat_to = 49.28685084859138;
    const range_lot_from = -123.121143;
    const range_lot_to = -123.065409519081;
    const maxZoom = 14;
    const clusterRadius = 50;

    let points1 = generateRandomPoints(
      10,
      range_lot_from,
      range_lot_to,
      range_lat_from,
      range_lat_to
    );

    console.log("points1");
    console.log(points1);

    var geoJson = {
      type: "FeatureCollection",
      features: points1.map(function (point) {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: point.coordinates,
          },
          properties: point.properties,
        };
      }),
    };

    console.log("geoJson1");
    console.log(geoJson);

    //Update all the markers once view is changed.
    function refreshMarkers() {
      const JobInfoList = document.getElementById("job-info-list");

      Object.keys(markersOnTheMap).forEach(function (id) {
        markersOnTheMap[id].remove();
        delete markersOnTheMap[id];
      });

      pointIDinsideView = [];
      JobInfoList.innerHTML = "";

      map.querySourceFeatures("point-source").forEach(function (feature) {
        if (feature.properties && !feature.properties.cluster) {
          //If the current markers shouldn't be clustered.
          var id = parseInt(feature.properties.id, 10);
          if (!markersOnTheMap[id]) {
            //If the current marker is not shown.

            // markersOnTheMap[id].point_id = feature.properties.id;
            pointIDinsideView.push(feature.properties.id);

            // console.log("The loaded marker's ID ="+feature.properties.id)

            //Here we could handle the markers accroading to their properties.
            if (feature.properties.type == "matched") {
              markersOnTheMap[id] = createMarker(
                feature.geometry.coordinates,
                feature.properties.name,
                "marker-matched",
                feature.properties.id
              );
            } else {
              markersOnTheMap[id] = createMarker(
                feature.geometry.coordinates,
                feature.properties.name,
                "marker-normal",
                feature.properties.id
              );
            }
          }
        }
      });

      // console.log("refreshing array done")
      // console.log(pointIDinsideView);
      let job_temp_index = 0;

      //Update the current Points list
      pointIDinsideView.forEach((point) => {
        job_temp_index = parseInt(point - 1);
        let job_temp = "<article>";
        job_temp += `<p class="job-article-id">${points1[job_temp_index].properties.id}</p>`;
        job_temp += `<img src=${points1[job_temp_index].properties.img}></img>`;
        job_temp += `<h3>${points1[job_temp_index].properties.name}</h3>`;
        job_temp += `<p>${points1[job_temp_index].properties.job_title}</p>`;
        job_temp += `<p>${points1[job_temp_index].properties.wage}</p>`;
        job_temp += `<p>${points1[job_temp_index].properties.address}</p>`;

        job_temp += "</article>";

        JobInfoList.innerHTML += job_temp;
      });

      //Add click listeners for each article
      document.querySelectorAll("article").forEach((item) => {
        item.addEventListener("click", (event) => {
          let index_temp = parseInt(item.firstChild.innerHTML - 1);
          // console.log(index_temp);
          clickArticle(index_temp);
          //handle click
        });
      });

      // console.log(points1);

      //Refresh the div as well.
    }

    map.on("load", function () {
      console.log("Map on");
      //
      map.addSource("point-source", {
        type: "geojson",
        data: geoJson,
        cluster: true,

        //At what zoom level should the markers clustered.
        clusterMaxZoom: maxZoom,
        clusterRadius: clusterRadius,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "point-source",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#425af5",
            10,
            "#425af5",
            20,
            "#425af5",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            5,
            25,
            10,
            30,
            15,
            40,
          ],
          "circle-stroke-width": 1,
          "circle-stroke-color": "white",
          "circle-stroke-opacity": 1,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "point-source",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 16,
        },
        paint: {
          "text-color": "white",
        },
      });

      map.on("data", function (e) {
        //If there's no data lodaed. Stop adding markers.
        if (
          e.sourceId !== "point-source" ||
          !map.getSource("point-source").loaded()
        ) {
          return;
        }

        refreshMarkers();

        if (!eventListenersAdded) {
          map.on("move", refreshMarkers);
          map.on("moveend", refreshMarkers);
          eventListenersAdded = true;
        }
      });

      map.on("click", "clusters", function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        var clusterId = features[0].properties.cluster_id;

        //If the cluster icon is clicked, zoom in.
        map
          .getSource("point-source")
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) {
              return;
            }

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom + 0.5,
            });
          });
      });

      const mainDiv = document.getElementById("home-page");
      const parentDiv = document.getElementById("home-page").parentNode;

      let infoDiv = document.createElement("div");
      infoDiv.classList.add("info-div");

      // infoDiv.className = "info-div";

      infoDiv.innerHTML = `   

      <div class="search-bar">
      <p>Search bar shows here</p>
      </div>

      <div class="info-list-title">
      <h2>Showing jobs in this area:</h2>
      </div>

        <section id="job-info-list"></section>
     <div class="info_close_button"><img src="img/close.png" alt=""></div>`;
      document.body.appendChild(infoDiv);

      const info_close_button =
        document.getElementsByClassName("info_close_button");

      info_close_button[0].addEventListener("click", function (e) {
        if (infoDiv) {
          infoDiv.remove();
        }
      });

      parentDiv.insertBefore(infoDiv, mainDiv);

      //Toggle curser status.
      map.on("mouseenter", "clusters", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", function () {
        map.getCanvas().style.cursor = "";
      });
    });

    //---------------------------Search -integration -begin
    var infoHint = new InfoHint("info", "bottom-center", 5000).addTo(
      document.getElementById("map")
    );
    var errorHint = new InfoHint("error", "bottom-center", 5000).addTo(
      document.getElementById("map")
    );
    var searchOptions = {
      key: "Tjiz7MbN6HeICEOR1UsO5JGJGW1xF3fN",
      language: "en-GB",
      limit: 5,
    };

    // Options for the autocomplete service
    var autocompleteOptions = {
      key: "Tjiz7MbN6HeICEOR1UsO5JGJGW1xF3fN",
      language: "en-GB",
    };

    var searchBoxOptions = {
      minNumberOfCharacters: 0,
      searchOptions: searchOptions,
      autocompleteOptions: autocompleteOptions,
      distanceFromPoint: [15.4, 53.0],
    };

    var ttSearchBox = new tt.plugins.SearchBox(tt.services, searchBoxOptions);
    document
      .querySelector(".search-bar")
      .appendChild(ttSearchBox.getSearchBoxHTML());

    var state = {
      previousOptions: {
        query: null,
        center: null,
      },
      callbackId: null,
      userLocation: null,
    };

    map.addControl(
      new tt.FullscreenControl({
        container: document.querySelector("home-page"),
      })
    );
    map.addControl(new tt.NavigationControl());
    new SidePanel(".tt-side-panel", map);

    var geolocateControl = new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: false,
      },
    });

    geolocateControl.on("geolocate", function (event) {
      var coordinates = event.coords;
      state.userLocation = [coordinates.longitude, coordinates.latitude];
      ttSearchBox.updateOptions(
        Object.assign({}, ttSearchBox.getOptions(), {
          distanceFromPoint: state.userLocation,
        })
      );
    });

    map.addControl(geolocateControl);

    var resultsManager = new ResultsManager();
    var searchMarkersManager = new SearchMarkersManager(map);

    map.on("load", handleMapEvent);
    map.on("moveend", handleMapEvent);

    ttSearchBox.on("tomtom.searchbox.resultscleared", handleResultsCleared);
    ttSearchBox.on("tomtom.searchbox.resultsfound", handleResultsFound);
    ttSearchBox.on("tomtom.searchbox.resultfocused", handleResultSelection);
    ttSearchBox.on("tomtom.searchbox.resultselected", handleResultSelection);

    function handleMapEvent() {
      // Update search options to provide geobiasing based on current map center
      var oldSearchOptions = ttSearchBox.getOptions().searchOptions;
      var oldautocompleteOptions = ttSearchBox.getOptions().autocompleteOptions;
      var newSearchOptions = Object.assign({}, oldSearchOptions, {
        center: map.getCenter(),
      });
      var newAutocompleteOptions = Object.assign({}, oldautocompleteOptions, {
        center: map.getCenter(),
      });
      ttSearchBox.updateOptions(
        Object.assign({}, searchBoxOptions, {
          placeholder: "Query e.g. Washington",
          searchOptions: newSearchOptions,
          autocompleteOptions: newAutocompleteOptions,
          distanceFromPoint: state.userLocation,
        })
      );
    }

    function handleResultsCleared() {
      searchMarkersManager.clear();
      resultsManager.clear();
    }

    function handleResultsFound(event) {
      // Display fuzzySearch results if request was triggered by pressing enter
      if (
        event.data.results &&
        event.data.results.fuzzySearch &&
        event.data.metadata.triggeredBy === "submit"
      ) {
        var results = event.data.results.fuzzySearch.results;

        if (results.length === 0) {
          handleNoResults();
        }
        searchMarkersManager.draw(results);
        resultsManager.success();
        fillResultsList(results);
        fitToViewport(results);
      }

      if (event.data.errors) {
        errorHint.setMessage("There was an error returned by the service.");
      }
    }

    function handleResultSelection(event) {
      if (isFuzzySearchResult(event)) {
        // Display selected result on the map
        var result = event.data.result;
        resultsManager.success();
        searchMarkersManager.draw([result]);
        fillResultsList([result]);
        searchMarkersManager.openPopup(result.id);
        fitToViewport(result);
        state.callbackId = null;
        infoHint.hide();
      } else if (stateChangedSinceLastCall(event)) {
        var currentCallbackId = Math.random().toString(36).substring(2, 9);
        state.callbackId = currentCallbackId;
        // Make fuzzySearch call with selected autocomplete result as filter
        handleFuzzyCallForSegment(event, currentCallbackId);
      }
    }

    function isFuzzySearchResult(event) {
      return !("matches" in event.data.result);
    }

    function stateChangedSinceLastCall(event) {
      return (
        Object.keys(searchMarkersManager.getMarkers()).length === 0 ||
        !(
          state.previousOptions.query === event.data.result.value &&
          state.previousOptions.center.toString() === map.getCenter().toString()
        )
      );
    }

    function getBounds(data) {
      var southWest;
      var northEast;
      if (data.viewport) {
        southWest = [
          data.viewport.topLeftPoint.lng,
          data.viewport.btmRightPoint.lat,
        ];
        northEast = [
          data.viewport.btmRightPoint.lng,
          data.viewport.topLeftPoint.lat,
        ];
      }
      return [southWest, northEast];
    }

    function fitToViewport(markerData) {
      if (!markerData || (markerData instanceof Array && !markerData.length)) {
        return;
      }
      var bounds = new tt.LngLatBounds();
      if (markerData instanceof Array) {
        markerData.forEach(function (marker) {
          bounds.extend(getBounds(marker));
        });
      } else {
        bounds.extend(getBounds(markerData));
      }
      map.fitBounds(bounds, { padding: 100, linear: true });
    }

    function handleFuzzyCallForSegment(event, currentCallbackId) {
      var query = ttSearchBox.getValue();
      var segmentType = event.data.result.type;

      var commonOptions = Object.assign({}, searchOptions, {
        query: query,
        limit: 15,
        center: map.getCenter(),
        typeahead: true,
        language: "en-GB",
      });

      var filter;
      if (segmentType === "category") {
        filter = { categorySet: event.data.result.id };
      }
      if (segmentType === "brand") {
        filter = { brandSet: event.data.result.value };
      }
      var options = Object.assign({}, commonOptions, filter);

      infoHint.setMessage("Loading results...");
      errorHint.hide();
      resultsManager.loading();
      tt.services
        .fuzzySearch(options)
        .then(function (response) {
          if (state.callbackId !== currentCallbackId) {
            return;
          }
          if (response.results.length === 0) {
            handleNoResults();
            return;
          }
          resultsManager.success();
          searchMarkersManager.draw(response.results);
          fillResultsList(response.results);
          map.once("moveend", function () {
            state.previousOptions = {
              query: query,
              center: map.getCenter(),
            };
          });
          fitToViewport(response.results);
        })
        .catch(function (error) {
          if (error.data && error.data.errorText) {
            errorHint.setMessage(error.data.errorText);
          }
          resultsManager.resultsNotFound();
        })
        .finally(function () {
          infoHint.hide();
        });
    }

    function handleNoResults() {
      resultsManager.clear();
      resultsManager.resultsNotFound();
      searchMarkersManager.clear();
      infoHint.setMessage(
        'No results for "' +
          ttSearchBox.getValue() +
          '" found nearby. Try changing the viewport.'
      );
    }

    function fillResultsList(results) {
      resultsManager.clear();
      var resultList = DomHelpers.createResultList();
      results.forEach(function (result) {
        var distance = state.userLocation
          ? SearchResultsParser.getResultDistance(result)
          : undefined;
        var addressLines = SearchResultsParser.getAddressLines(result);
        var searchResult = this.DomHelpers.createSearchResult(
          addressLines[0],
          addressLines[1],
          distance ? Formatters.formatAsMetricDistance(distance) : ""
        );
        var resultItem = DomHelpers.createResultItem();
        resultItem.appendChild(searchResult);
        resultItem.setAttribute("data-id", result.id);
        resultItem.onclick = function (event) {
          var id = event.currentTarget.getAttribute("data-id");
          searchMarkersManager.openPopup(id);
          searchMarkersManager.jumpToMarker(id);
        };
        resultList.appendChild(resultItem);
      });
      resultsManager.append(resultList);
    }
  }

  close() {
    document.querySelector("body").classList.remove("home-body");
  }
}

export default Home;
