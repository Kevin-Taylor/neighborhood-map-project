// Set up the  data Model

var Model = {
    points: [
        {
        name: "Nature's Bounty Cafe & Catering",
        lat: 38.0159428, 
        long: -121.8128857,
        url:  'http://naturesbountycafe.com/',
        yelpID: 'natures-bounty-cafe-antioch',
        },
        {
        name: "Rick's On Second",
        lat: 38.0167263,
        long: -121.8142826,
        url:  'http://www.ricksonsecond.com/',
        yelpID: 'ricks-on-second-antioch',
        },
        {
        name: "Riverview Lodge Restaurant",
        lat: 38.0159683,
        long: -121.811846,
        url:  'http://www.riverviewlodgeantioch.com/',
        yelpID: 'riverview-lodge-antioch',
        },
        {  
        name: "Beer Garden",
        lat: 38.0161142,
        long: -121.8115575,
        url:  '',
        yelpID: 'new-beer-garden-antioch-2',
        },
        {
        name: "Canton City",
        lat: 38.0164977,
        long: -121.8136215,
        url:  'http://www.arapahoebasin.com/Abasin/Default.aspx',
        yelpID: 'canton-city-antioch',
        },
        {
        name: "Nuce Nuce Deli",
        lat: 38.0174452,
        long: -121.8149326,
        url:  'http://www.lakedillontavern.com/',
        yelpID: 'nuce-nuce-deli-antioch',
        },
        { 
        name: "Red Caboose",
        lat: 38.0160715,
        long: -121.8048994,
        url:  'http://www.snakeriversaloon.com/',
        yelpID: 'the-red-caboose-antioch',
        }, 
    ],
    currentPoint: ko.observable(null)
};

// ViewModel

var ViewModel = function(){

// Initialize Regular and Observables 

    var self = this;
    self.dialogItem = ko.observable();
    self.markerArray = ko.observableArray();
    self.filterArray = ko.observableArray();
    self.mapUnavailable = ko.observable(false);
    self.listArray = ko.observableArray();
    self.query = ko.observable("");
    self.dialogVisible = ko.observable(false);
    self.showMarkers = ko.observable(true);
    var map, place;
    var yelpId;
    var activityButton = false;

// Initialize

    var initDom = function(){

// Prep for map error

        if (typeof window.google === 'object' && typeof window.google.maps === 'object')
        {

// Set map options

            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(38.0155639,-121.8100771),
            };

// Call to Google Maps API


            map = new google.maps.Map(document.getElementById('map'), mapOptions);
                infowindow = new google.maps.InfoWindow({
                content: null
            });
 
// Create markers and list

            var pointsArray = Model.points;

            for (var x=0; x < pointsArray.length; x++){
                var pointPosition = new google.maps.LatLng(
                pointsArray[x].lat,
                pointsArray[x].long
                );

                var marker = new google.maps.Marker({
                    position: pointPosition,
                    title: pointsArray[x].name,
                    url: pointsArray[x].url,
                    map: map,
                    busYelpId: pointsArray[x].yelpID,
                });

                self.markerArray.push(marker);
                self.listArray.push(marker);

// Show information window when marker is clicked

                google.maps.event.addListener(marker, 'click', function()
                {
                    var that = this;
                    yelpId = that.busYelpId;

// Set window information

                    infowindow.setContent("<h5>" + that.title +
                          "</h5><button type='button' onclick=" +
                          "yelpResponse()><img src='img/yelp.gif' width='110' height='28'" +
                          "border='0' alt='yelp btn'></button><br>");

                    infowindow.open(map, that);
                }); // end event listener 
            } // end pointsArray for loop 

        } else
        {

// Display Error if Google Map for area is not available

            $("#map-unavailable").css('visibility', 'visible');
            self.mapUnavailable(true);

        } // end window.google object if

    }(); // end initDom

// Function to filter list based on activity button clicked

    self.filterActivity = function(activity)
    {

// Set displayed list array to full list of places by setting it equal marker array

        self.listArray(self.markerArray().slice(0));
        if (activity == "all")
        {
            return;
        }

        var i = self.listArray().length;
        while (i--)
        {
            if (self.listArray()[i].type !== activity)
            {
                self.listArray.splice(i, 1);
            }
        }
    };

// Filter listed locations based on the search/filter input box 

    self.filterArray = ko.computed(function(){
        var query = self.query().toLowerCase();
        self.listArray.splice(0);
        return ko.utils.arrayFilter(self.markerArray(), function(marker){
            if (marker.title.toLowerCase().indexOf(query) > -1)
            {
                self.listArray.push(marker);
                return marker.title.toLowerCase().indexOf(query) > -1;
            }
        });
    }, self);

// Synch markers with list

    self.listArray.subscribe(function(){
        var differences = ko.utils.compareArrays(self.markerArray(), self.listArray());
        ko.utils.arrayForEach(differences, function(marker){
          if (marker.status == 'deleted')
          {
            marker.value.setMap(null);
          } else 
          {
            marker.value.setMap(map);
          }
        });
    });

//Open window if list item is clicked

    self.selectItem = function(listItem) {
        google.maps.event.trigger(listItem, 'click');
    };

// Display Yelp information when Yelp button clicked

    self.yelpResponse = function(){

        var auth = {
            consumerKey : "BiCBDxZsFj7KVvGLNb9jYw",
            consumerSecret : "7OoDf9QonYUw2HZZVuSDTTLHrsE",
            accessToken : "wtmCT_LqLQfGktztQ_k989t7du3Vs8xY",
            accessTokenSecret : "gp_EFPJ8jAwJ7XAZVB2xh8le1Mo",
            serviceProvider : {
                signatureMethod : "HMAC-SHA1"
            }
        };

// Test data to get a response

        var terms = 'food';
            var near = 'San+Francisco';

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            var message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            var parameterMap = OAuth.getParameterMap(message.parameters);
            console.log(parameterMap);


            $.ajax({
                'url' : message.action,
                'data' : parameterMap,
                'dataType' : 'jsonp',
                'jsonpCallback' : 'cb',
                'success' : function(data, textStats, XMLHttpRequest) {
                    console.log(data);
                }
            });

    }; // End yelpResponse function

}; // End ViewModel function 

ko.applyBindings(ViewModel);
