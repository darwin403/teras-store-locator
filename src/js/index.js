/**********************
 * DEFAULT PROPERTIES *
 **********************/
// var BRAND = "Teras";
// var BRAND_BASE = "Teras_";
// var CENTER_INITIAL = {
//   lat: 39.8283,
//   lng: -98.5795,
// };
// var RADIUS = 50;
// var LIMIT = 25;
// var SEARCH_TIME = 3;
// var ICON_COLOR = "#3d86b1";
// var MARKER_ICON = "images/marker_teras.png";

/*******************
 * LOCAL VARIABLES *
 *******************/
var myMap = null;
var upcSelect = [];
var address = null;

/*****************
 * CSS SELECTORS *
 *****************/
const elements = {
  searchMain: document.getElementById("search-main"),
  addressMain: document.getElementById("address-main"),
  addressSidebar: document.getElementById("address-sidebar"),
  sidebarCol: document.getElementById("col-sidebar"),
  mapCol: document.getElementById("col-map"),
  map: document.getElementById("map"),
  products: document.getElementById("products"),
  productResults: document.getElementById("product-results"),
  storesResults: document.getElementById("stores-results"),
  stores: document.getElementById("stores"),
  store: document.getElementById("store"),
  storeResult: document.getElementById("store-result"),
  storeName: document.getElementById("store-name"),
  storeDetails: document.getElementById("store-details"),
  storeProducts: document.getElementById("store-products"),
  storeProductsAvailability: document.getElementById(
    "store-products-availability"
  ),
  modalCol: document.getElementById("col-modal"),
};

/****************************
 * CUSTOM GOOGLE MAPS CLASS *
 ****************************/
class MyMap {
  constructor() {
    this.markers = [];
    this.center = CENTER_INITIAL;
    this.geocoder = new google.maps.Geocoder();
    this.bounds = new google.maps.LatLngBounds();
    this.storeInfoPopup = new InfoBubble({
      borderRadius: 0,
      arrowSize: 10,
      borderWidth: 1,
      borderColor: ICON_COLOR,
      disableAnimation: true,
      hideCloseButton: true,
      minWidth: 280,
      maxWidth: 280,
      minHeight: "100%",
    });
    this.mapStyles = new google.maps.StyledMapType([
      {
        featureType: "all",
        elementType: "geometry.fill",
        stylers: [
          {
            weight: "2.00",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#9c9c9c",
          },
        ],
      },
      {
        featureType: "all",
        elementType: "labels.text",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [
          {
            color: "#f2f2f2",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            saturation: -100,
          },
          {
            lightness: 45,
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            color: ICON_COLOR,
          },
          {
            saturation: "-38",
          },
          {
            lightness: "75",
          },
          {
            gamma: "1.00",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#7b7b7b",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [
          {
            visibility: "simplified",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            color: "#46bcec",
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: ICON_COLOR,
          },
          {
            saturation: "-25",
          },
          {
            lightness: "75",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#070707",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
    ]);
    this.icon = new google.maps.MarkerImage(
      MARKER_ICON,
      new google.maps.Size(36, 36),
      new google.maps.Point(0, 0),
      new google.maps.Point(18, 36)
    );

    this.gmap = new google.maps.Map(elements.map, {
      center: this.center,
      zoom: 4,
      mapTypeId: "roadmap",
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "cooperative",
      draggable: false,
    });

    this.gmap.mapTypes.set("styled_map", this.mapStyles);
    this.gmap.setMapTypeId("styled_map");

    google.maps.event.addListener(this.storeInfoPopup, "closeclick", () => {
      this.storeInfoPopup.close();
      this.fitMap();

      show.stores();
    });

    hide.map.loading();
  }

  addressToCoordinates(address, callback) {
    this.geocoder.geocode(
      {
        address: address,
        componentRestrictions: {},
      },
      (results, status) => {
        if (status !== "OK") {
          error.stores("Address provided is invalid!");
          return;
        }

        this.setCenter({
          lat: results[0]["geometry"]["location"].lat(),
          lng: results[0]["geometry"]["location"].lng(),
        });

        callback(this.center);
      }
    );
  }

  setCenter(center) {
    this.center = { lat: center.lat, lng: center.lng };
    this.gmap.setCenter(this.center);
  }

  addMarker(store) {
    const marker = new google.maps.Marker({
      map: this.gmap,
      position: {
        lat: parseFloat(store["lat"]),
        lng: parseFloat(store["lng"]),
      },
      icon: this.icon,
    });

    google.maps.event.addListener(marker, "click", () => {
      this.gmap.setCenter(marker.getPosition());
      // this.gmap.setZoom(12);

      this.storeInfoPopup.setContent(format.store.popup(store));
      this.storeInfoPopup.open(this.gmap, marker);

      set.store(store);
    });

    this.markers.push({ id: store["id"], marker: marker });
  }

  clickMarker(id) {
    for (var i = 0; i < this.markers.length; i++) {
      if (parseInt(this.markers[i]["id"]) !== parseInt(id)) continue;

      google.maps.event.trigger(this.markers[i].marker, "click");
    }
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].marker.setMap(null);
    }
    this.markers = [];
  }

  clearStorePopup() {
    google.maps.event.trigger(this.storeInfoPopup, "closeclick");
  }

  clearBounds() {
    this.bounds = new google.maps.LatLngBounds();
  }

  clearMap() {
    this.clearBounds();
    this.clearMarkers();
    this.clearStorePopup();
  }

  fitMap() {
    this.gmap.fitBounds(this.bounds);
  }

  resetMap() {
    this.clearMap();

    this.gmap.setCenter(CENTER_INITIAL);
    this.gmap.setZoom(4);
  }
}

/********************
 * SEARCH STORES BY *
 ********************/
const searchStores = {
  _reset: function () {
    $(elements.storesResults).data("scrollTop", 0);
  },
  _options: {
    lat: null,
    lng: null,
    radius: RADIUS,
    resultslimit: LIMIT,
    upcSelect: null,
    searchtimeinmonths: SEARCH_TIME,
    brand: BRAND,
    setdbaseBrand: BRAND_BASE,
  },
  gps: function () {
    this._reset();

    if (!navigator.geolocation) {
      error.stores("Location services are not available on your browser");
      return;
    }

    // Get coordinates from Browser API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("gps:", position);

        // Update state center
        myMap.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        fetch.stores(
          Object.assign(this._options, {
            lat: myMap.center.lat,
            lng: myMap.center.lng,
          }),
          set.stores
        );
      },
      function (err) {
        if (err.PERMISSION_DENIED) {
          error.stores(
            "Permission denied to retrieve your location! Please allow location services in your browser for this website."
          );
          return;
        }

        error.stores("Unable to retrieve your location! Please try again.");
      }
    );
  },
  address: function () {
    this._reset();

    // Get coordinates from Google's Geocoder
    myMap.addressToCoordinates(address, (coordinates) => {
      fetch.stores(
        Object.assign(this._options, {
          lat: coordinates.lat,
          lng: coordinates.lng,
        }),
        set.stores
      );
    });
  },
  products: function () {
    this._reset();

    fetch.stores(
      Object.assign(this._options, {
        lat: myMap.center.lat,
        lng: myMap.center.lng,
        upcSelect: upcSelect.join(","),
      }),
      set.stores
    );
  },
};

/*******************************************
 * FORMAT JSON OBJECTS TO APPROPRIATE HTML *
 *******************************************/
const format = {
  products: {
    product: function (product) {
      return `
      <div class="col-lg-4" data-upc="${product["upc"]}" onClick="handle.upc.toggle(this);">
          <div class="d-flex flex-column align-items-center py-4 pointer">
              <img src="https://shelfsmartdata.com/app/slt/images/${BRAND}/${product["upc"]}.png" />
              <h6 class="mb-1 text-center w-75">${product["description"]}</h6>
              <i class="fas fa-check" style="color:${ICON_COLOR};display:none"></i>
          </div>
      </div>
    `;
    },
  },
  store: {
    product: function (product) {
      return `
            <div class="col-lg-4">
                <div class="d-flex flex-column align-items-center py-4">
                    <img src="https://shelfsmartdata.com/app/slt/images/${BRAND}/${product["upc"]}.png" />
                    <h6 class="mb-1 text-center w-75">${product["name"]}</h6>
                </div>
            </div>
            `;
    },
    details: function (store) {
      const address = `${store["address"]},${store["city"]}, ${store["state"]}, ${store["zipcode"]}`;
      var html = "";

      if (address.trim()) {
        html += `
        <p class="d-flex align-items-center">
          <i class="fas fa-car mx-2"></i>
          <a class="flex-grow-1" href="https://maps.google.com/maps?saddr=${myMap.center["lat"]},${myMap.center["lng"]}&daddr=${store["lat"]},${store["lng"]}" target="new">${address}</a>
        </p>
        `;
      }

      if (store["phone"]) {
        html += `
        <p class="d-flex align-items-center">
          <i class="fas fa-phone-alt mx-2"></i>
          <a class="flex-grow-1" href="tel:${store["phone"]}">${store["phone"]}</a>
        </p>
        `;
      }

      return html;
    },
    availability: function (store) {
      return `${store["products"].length} Products available at this store<br/> Please contact the store to confirm availability`;
    },
    popup: function (store) {
      const address = `${store["address"]},${store["city"]}, ${store["state"]}, ${store["zipcode"]}`;
      const distance = parseFloat(store["distance"]).toFixed(2);

      const html_phone = store["phone"]
        ? `<p class="my-1"><i class="fas fa-phone-alt"></i> ${store["phone"]}</p>`
        : "";

      // TODO: ES6 support required
      const html = `
        <div class="d-flex flex-column">
          <button type="button" class="btn btn-link" style="align-self: flex-end;" onclick="handle.popup.close();">
            <i class="fas fa-arrow-left mr-1"></i> Back to results
          </button>
          <div class="p-4">
            <h5>${store["name"]}</h5>
            <div>${address}</div>
            <div class="details my-3">
              <p class="my-1"><i class="fas fa-car"></i> ${distance} miles</p>
              ${html_phone}
            </div>
            <a class="btn btn-outline-primary btn-block my-1" href="https://maps.google.com/maps?saddr=${myMap.center["lat"]},${myMap.center["lng"]}&daddr=${store["lat"]},${store["lng"]}" target="new"><i class="fas fa-car"></i> DIRECTIONS</a>
          </div>
        </div>
          `;

      return html;
    },
  },
  stores: {
    store: function (store) {
      const address = `${store["address"]},${store["city"]}, ${store["state"]}, ${store["zipcode"]}`;
      const distance = parseFloat(store["distance"]).toFixed(2);

      // TODO: ES6 support required
      const html = `
      <div class="list-group-item list-group-item-action" >
          <div class="d-flex w-100 justify-content-between align-items-center pointer"  onClick="handle.marker.click(${store["id"]});">
            <div class="flex-grow-1">
                <h5 class="mb-1">${store["name"]}</h5>
                <p class="my-1">${address}</p>
                <small>${distance} miles</small>
            </div>
            <div class="d-flex">
              <a href="https://maps.google.com/maps?saddr=${myMap.center["lat"]},${myMap.center["lng"]}&daddr=${store["lat"]},${store["lng"]}" target="new"><i class="fas fa-car mr-2"></i></a>
              <a href="javascript:void(0);" onclick="handle.marker.click(${store["id"]});"><i class="fas fa-info-circle ml-2"></i></a>
            </div>
          </div>
          
      </div>`;

      return html;
    },
  },
};

/****************************
 * SET JSON RESPONSE TO DOM *
 ****************************/
const set = {
  products: function (products, hidden = true) {
    console.log("products:", products);
    const html = products
      .map((product) => format.products.product(product))
      .join("");

    $(elements.productResults).html(html);

    if (!hidden) {
      showProducts();
    }
  },
  stores: function (stores, message) {
    console.log("stores:", stores, "message:", message);

    // Remove existing markers
    myMap.clearMap();

    stores.forEach(function (store) {
      // Add marker
      myMap.addMarker(store);

      // Extend bound
      myMap.bounds.extend({
        lat: parseFloat(store.lat),
        lng: parseFloat(store.lng),
      });
    });

    if (stores.length !== 0) {
      myMap.fitMap();
    }

    // Message
    const html_message = message
      ? `<li class="list-group-item">${message}</li>`
      : "";

    // Stores to HTML
    const html_stores = stores
      .map((store) => format.stores.store(store))
      .join("");

    $(elements.storesResults).html(html_message + html_stores);

    show.stores();
  },
  store: function (store) {
    console.log("store:", store);

    const products = store.products
      .map((product) => format.store.product(product))
      .join("");
    const details = format.store.details(store);
    const availability = format.store.availability(store);

    // Style
    $(elements.storeName).html(store.name);
    $(elements.storeDetails).html(details);
    $(elements.storeProductsAvailability).html(availability);
    $(elements.storeProducts).html(products);

    show.store();
  },
};

/**********************************
 * PERFORM API REQUESTS WITH AJAX *
 **********************************/
const fetch = {
  _loading: function () {
    show.map.loading();
    show.sidebar.loading();
  },
  _done: function () {
    hide.map.loading();
    hide.sidebar.loading();
  },
  products: function (options, callback) {
    this._loading();

    $.get(
      "https://shelfsmartdata.com/app/slt/sandbox2/include/products.php",
      options,
      (result, status) => {
        this._done();
        if (status !== "success") return;

        const products = result || [];

        callback(products);
      }
    );
  },
  stores: function (options, callback) {
    this._loading();

    $.get(
      "https://shelfsmartdata.com/app/slt/sandbox2/include/stores.php",
      options,
      (result, status) => {
        this._done();

        if (status !== "success") return;

        const stores =
          result["storedata"] ||
          result["storedata2"] ||
          result["storedata3"] ||
          result["storedata4"] ||
          result["storedata5"] ||
          [];

        if (stores.length === 0) {
          if (
            "storedata" in result ||
            "storedata3" in result ||
            "storedata4" in result
          ) {
            error.stores("No search results returned!");
          }

          if ("storedata2" in result) {
            error.stores(
              `Oh no! It seems there are no retail locations in your area that carry ${BRAND}`
            );
          }

          if ("storedata5" in result) {
            error.stores(
              "We can't find any stores with any of the items you are searching for. Please try searching your area without selecting items to find stores that can order the product for you."
            );
          }
          return;
        }

        const message =
          "storedata4" in result
            ? "We can't find any stores that have all the items you selected, but the stores below do carry one or more of what you are looking for."
            : null;
        callback(stores, message);
      }
    );
  },
};

/*****************
 * SHOW ELEMENTS *
 *****************/
const show = {
  _reset: function () {
    $(elements.products).hide();
    $(elements.stores).hide();
    $(elements.store).hide();
  },
  products: function () {
    this._reset();
    $(elements.products).show();
  },
  stores: function () {
    this._reset();
    $(elements.stores).show();

    // Update scroll position
    $(elements.storesResults).scrollTop(
      parseInt($(elements.storesResults).data("scrollTop"))
    );
  },
  store: function () {
    this._reset();
    $(elements.store).show();
  },
  sidebar: {
    loading: function () {
      $(elements.sidebarCol).find(".loading").show();
    },
  },
  map: {
    loading: function () {
      $(elements.mapCol).find(".loading").show();
    },
  },
};

/*****************
 * HIDE ELEMENTS *
 *****************/
const hide = {
  sidebar: {
    loading: function () {
      $(elements.sidebarCol).find(".loading").hide();
    },
  },
  map: {
    loading: function () {
      $(elements.mapCol).find(".loading").hide();
    },
  },
};

/*********************
 * HANDLE DOM EVENTS *
 *********************/
const handle = {
  upc: {
    clear: function () {
      upcSelect = [];
      $(elements.productResults).find(".fa-check").hide();
    },
    toggle: function (element) {
      const upc = $(element).data("upc");
      const index = upcSelect.indexOf(upc);

      if (index !== -1) {
        upcSelect.splice(index, 1);
        $(element).find(".fa-check").hide();
      } else {
        upcSelect.push(upc);
        $(element).find(".fa-check").show();
      }
    },
  },
  popup: {
    close: function () {
      myMap.clearStorePopup();
      show.stores();
    },
  },
  marker: {
    click: function (id) {
      myMap.clickMarker(id);
    },
  },
  address: {
    change: function (type) {
      if (type === "main") {
        address = $(elements.addressMain).val();
        $(elements.addressSidebar).val(address);
      }
      if (type === "sidebar") {
        address = $(elements.addressSidebar).val();
        $(elements.addressMain).val(address);
      }
    },
  },
};

/***************
 * SHOW ERRORS *
 ***************/
const error = {
  stores: function (message) {
    $(elements.storesResults).html(
      `<li class="list-group-item"><b>${message}</b></li>`
    );
    show.stores();
  },
};

/*********
 * START *
 *********/

// Initialize map instances
myMap = new MyMap();

// Fetch products
fetch.products({ brand: BRAND }, set.products);

// Watch for sidebar updates
$(elements.storesResults).bind("DOMSubtreeModified", function () {
  if ($(this).html().trim()) {
    $(elements.sidebarCol).show();
    $(elements.searchMain).hide();
  } else {
    $(elements.sidebarCol).hide();
  }
});

// Show online stores if exists
if (HAS_STORES) {
  $(elements.modalCol).show();
}

// Scroll listeners
$(elements.storesResults).scroll(function (a, b, c) {
  $(elements.storesResults).data(
    "scrollTop",
    $(elements.storesResults).scrollTop()
  );
});
/*******
 * END *
 *******/
