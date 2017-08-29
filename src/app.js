// Import scss file for webpack to compile
import './scss/style.scss';
import $ from 'jquery';


class App {
  constructor() {
    this.sf = new google.maps.LatLng(37.7831, -122.4039);
    // REGISTER ELEMENTS
    this.$dataContainer = $('.data-container');
    this.sideContainer = document.getElementById('search-container');
    this.searchContainer = document.getElementById('search-ac');
    this.mapContainer = document. getElementById('map');
    this.markers = [];
    this.$placeContainer;

    this.renderPlaceContainer();

    // MAP OPTIONS
    this.mapOptions = {
      center: this.sf,
      zoom: 12,
    }

    // CREATE GOOGLE MAP
    this.map = new google.maps.Map(this.mapContainer, this.mapOptions);

    // SEARCH AUTOCOMPLETE
    this.autocomplete = new google.maps.places.Autocomplete(this.searchContainer);
    this.autocomplete.bindTo('bounds', this.map);


    // MARKER
    this.markerOptions = {
      position: this.sf
    }

    this.infoWindow = new google.maps.InfoWindow();
    // this.marker.setMap(this.map);


    this.request = {
      location: this.sf,
      radius: '500',
      query: null
    };

    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      this.infoWindow.close();
      const place = this.autocomplete.getPlace();

      this.request.query = place.name;
      // console.log('query', this.request.query);
      // console.log('request', this.request);

      if (!place.geometry) {
        return;
      }


      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
    });


    // TEXT SEARCH
    this.service = new google.maps.places.PlacesService(this.map);

    this.activateSearch();
  }


  // ACTIVATE SEARCH
  activateSearch() {
    this.searchContainer.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        let query = event.target.value;
        // console.log('value', event.target.value);
        this.request.query = query;

        // this.map = new google.maps.Map(this.mapContainer, this.mapOptions);
        this.service.textSearch(this.request, this.callback.bind(this));
      }
    });
  }


  // CLEAR MARKERS FROM MARKERS ARRAY
  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
  }


  // ADD MARKERS TO MARKERS ARRAY
  addMarker(place) {
    let location = place.geometry.location;
    let name = place.name;

    let marker = new google.maps.Marker({
      position: location,
      map: this.map
    });

    this.markers.push(marker);

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent(name);
      this.infoWindow.open(this.map, marker);
    });

  }


  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // remove all markers from array
      this.clearMarkers();

      this.$placeContainer.empty();

      for (var i = 0; i < results.length; i++) {
        this.addMarker(results[i]);
        // this.createMarker(results[i]);
        this.renderPlace(results[i]);
      }
    }
  }


  renderPlaceContainer() {
    this.$dataContainer.append(`<div class="place-container"><ul class="place-list"></ul></div>`);
    this.$placeContainer = $('.place-list');
  }


  // RENDER PLACES INTO PLACE CONTAINER
  renderPlace(place) {
    let name = place.name;
    let rating = place.rating;
    let address = place.formatted_address;

    let block = `
      <li>
        <h3 class="result-title">${name}</h3>
        <div class="result-rating">${rating} Stars</div>
        <p class="result-address">${address}</p>
      </li>
    `;

    this.$placeContainer.append(block);
  }


  // createMarker(place) {
  //   const placeLocation = place.geometry.location;
  //   const marker = new google.maps.Marker({
  //     map: this.map,
  //     position: placeLocation
  //   });

  //   this.markers.push(marker);

  //   marker.setPosition(place.geometry.location);

  //   google.maps.event.addListener(marker, 'click', () => {
  //     this.infoWindow.setContent(place.name);
  //     this.infoWindow.open(map, marker);
  //   });
  // }
}

new App();