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

    // Autocomplete Options
    // this.acOptions = {
    //   types: ['geocode']
    // }


    // SEARCH AUTOCOMPLETE
    this.autocomplete = new google.maps.places.Autocomplete(this.searchContainer);
    // console.log('auto', this.autocomplete);
    this.autocomplete.bindTo('bounds', this.map);


    // MARKER
    this.markerOptions = {
      position: this.sf
    }

    this.infoWindow = new google.maps.InfoWindow();
    this.marker = new google.maps.Marker({
      map: this.map
    });
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
      console.log('query', this.request.query);
      console.log('request', this.request);

      if (!place.geometry) {
        return;
      }


      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }


      this.marker.setPosition(place.geometry.location);
      this.infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
      this.infoWindow.open(this.map, this.marker);


      google.maps.event.addListener(this.marker,'click', (e) => {
        this.infoWindow.open(this.map, this.marker);
      });
    });



    // TEXT SEARCH
    this.service = new google.maps.places.PlacesService(this.map);
    // this.service.textSearch(this.request, this.callback.bind(this));




    // INFO WINDOW
    // this.infoWindowOptions = {
    //   content: 'Moscone Is Here!'
    // };

    // this.infoWindow = new google.maps.InfoWindow(this.infoWindowOptions);

    // google.maps.event.addListener(this.marker,'click', (e) => {

    //   this.infoWindow.open(this.map, this.marker);
    // });


    // this.renderMap();


    // this.infowindow = new google.maps.InfoWindow();

    // this.defaultBounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(-33.8902, 151.1759),
    //   new google.maps.LatLng(-33.8474, 151.2631));

    this.activateSearch();
  }


  activateSearch() {
    this.searchContainer.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        let query = event.target.value;
        // console.log('value', event.target.value);
        this.request.query = query;

        // this.clearMarkers();

        // this.map = new google.maps.Map(this.mapContainer, this.mapOptions);
        this.service.textSearch(this.request, this.callback.bind(this));
      }
    });
  }


  clearMarkers() {
    setMapOnAll(null);
  }


  renderMap() {
    // Render map
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.pyrmont,
      zoom: 15
    });
  }




  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
        this.renderPlace(results[i]);
      }
    }
    console.log('results', results);
  }

  renderPlaceContainer() {
    this.$dataContainer.append(`<ul class="place-container"></ul>`);
    this.$placeContainer = $('.place-container');
  }


  renderPlace(place) {
    let name = place.name;
    let rating = place.rating;
    let address = place.formatted_address;

    let block = `
      <li>
        <h3 class="result-title">${name}</h3>
        <div class="result-rating">${rating}</div>
        <p class="result-address">${address}</p>
      </li>
    `

    this.$placeContainer.append(block);
  }


  createMarker(place) {
    const that = this;

    const placeLocation = place.geometry.location;
    const marker = new google.maps.Marker({
      map: this.map,
      position: placeLocation
    });
    // console.log(marker);

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindow.setContent(place.name);
      this.infoWindow.open(map, marker);
    });
  }
}

new App();