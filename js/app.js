var map; 
var markers = [];
 
//Model 
    yelpPlaces =
    [ 
        {
            name: "Nature's Bounty Cafe & Catering",
            lat: 38.0159428, 
            long: -121.8128857,
            urlName: "",
            markerNum: 0
        },
        {
            name: "Rick's On Second",
            lat: 38.0167263,
            long: -121.8142826,
            urlName: "",
            markerNum: 1
        },
        {
            name: "Riverview Lodge Restaurant",
            lat: 38.0159683,
            long: -121.811846,
            urlName: "",
            markerNum: 2
        },
        {
            name: "Beer Garden",
            lat: 38.0161142,
            long: -121.8115575,
            urlName: "",
            markerNum: 3
        },
        {
            name: "Canton City",
            lat: 38.0164977,
            long: -121.8136215,
            urlName: "",
            markerNum: 4
        },
        {
            name: "Nuce Nuce Deli",
            lat: 38.0174452,
            long: -121.8149326,
            urlName: "",
            markerNum: 5
        },
        {
            name: "Red Caboose",
            lat: 38.0160715,
            long: -121.8048994,
            urlName: "",
            markerNum: 6
        }
    ];

    //Create infowindow and contentString variables 
    var infowindow = new google.maps.InfoWindow(); 
    var contentString = '<ul id="wikipedia-links">bla</ul>';

    var initMap = function() {
        // Set 'starting' position and mapOptions 
        riverTown = new google.maps.LatLng(38.0155639,-121.8100771);
        var mapOptions = {
        zoom: 16, 
        center: riverTown
        };

        // Create map and place in map-canvas div 
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); 

        //Create markers and infowindow and place on map 
        for (i = 0; i < yelpPlaces.length; i++){ 
            var marker = new google.maps.Marker({ 
                position: new google.maps.LatLng(yelpPlaces[i].lat, yelpPlaces[i].long),
                map: map,
                title: yelpPlaces[i].name,
                wikiLink: contentString
            });

            // Google Maps API on click addListener 
            google.maps.event.addListener(marker, 'click', (function(marker){
                return function(){
                    map.panTo(marker.getPosition());
                    infowindow.setContent(marker.title);
                    infowindow.open(map, marker);

                    // Google Maps API marker animation 
                    marker.setAnimation(google.maps.Animation.BOUNCE); 
                    setTimeout(function(){ marker.setAnimation(null); }, 750);
                };
            })(marker)); 
            markers.push(marker);
        };
    };
 
 
// ViewModel 
    var mapViewModel = function(){
        var self = this;

        // Define and assign KO observables 
        self.usePlaces= ko.observableArray(yelpPlaces);
        self.markers=ko.observableArray(markers);
        self.filter= ko.observable('');

        // Infowindow list click function
        self.OpenInfoWindow= function(usePlaces){
            var point= markers[usePlaces.markerNum];
            map.panTo(point.getPosition());

            // Open infowindow on click 
            infowindow.open(map, point); 
            infowindow.setContent(point.title); 
 
            // Google Maps marker animation 
            point.setAnimation(google.maps.Animation.BOUNCE); 
            setTimeout(function(){ point.setAnimation(null); }, 750); 
        };

        // Filter show/hide markers function
        self.showOrHideMarkers= function(state){
            for (var i = 0; i < markers.length; i++){
                markers[i].setMap(state);
            }
        };
      
        // KO arrayFilter
        self.filterArray = function(filter){
            return ko.utils.arrayFilter(self.usePlaces(), function(location){
            return location.name.toLowerCase().indexOf(filter) >= 0;
            });
        };

        // Selected marker displayed
        self.displaySelected = function(filteredmarkers){
            for (var i = 0; i < filteredmarkers.length; i++){
                markers[filteredmarkers[i].markerNum].setMap(map);
            }
        };

        // Filter of usePlaces list
        self.filterList = function(){
            var filter = self.filter().toLowerCase();
            if (!filter){
                self.showOrHideMarkers(map); 
                return self.usePlaces();
            }
            else{
                self.showOrHideMarkers(null);
                var filteredmarkers = [];
                filteredmarkers = self.filterArray(filter);
                self.displaySelected(filteredmarkers);
                return filteredmarkers;
            }
        };
    };
 google.maps.event.addDomListener(window, 'load', initMap); 
 ko.applyBindings(new mapViewModel()); 
