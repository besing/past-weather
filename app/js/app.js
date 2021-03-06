var API_CREDENTIALS = require('../API_KEYS.js');

var app = angular.module('wetterLuchs', []);

// Controller with several API calls (dependent on e.a.) ("Promises-Chaining")
// http://bit.ly/1PijnPx
app.controller('WeatherCtrl', ['$scope', '$http', 'timeAgo', function($scope, $http, timeAgo) {

    // HTML5 Geolocation http://www.selfhtml5.org/?p=853
    navigator.geolocation.getCurrentPosition(function(pos) {
        // on success (=first case)
        var geoLat = pos.coords.latitude;
        var geoLong = pos.coords.longitude;
        $scope.geoCoordinates = geoLat + ',' + geoLong;

        $http({
            method: 'GET',
            url: 'https://eu1.locationiq.com/v1/reverse.php?key=' + API_CREDENTIALS.LOCATIONIQ + '&lat=' + geoLat + '&lon=' + geoLong + '&format=json&normalizecity=1'})

            .then(function (response) {
                var getCityObj = response.data;
                $scope.getCityName = getCityObj.address.city;

        // TODO: add caching!


// API CALL 2 (Current Weather)
                return $http({
                    method: 'JSONP',
                    url: 'https://api.darksky.net/forecast/' + API_CREDENTIALS.DARKSKY + '/' + $scope.geoCoordinates + '?units=si&lang=de&callback=JSON_CALLBACK'})
            })

            .then(function(response) {
                $scope.currentWeather = response.data;

                var currentWeatherIcon = response.data.currently.icon;

                var unsplashImgQuery = '';

                switch (currentWeatherIcon) {
                    case 'clear-day':
                        unsplashImgQuery = 'sun';
                        break;
                    case 'clear-night':
                        unsplashImgQuery = 'night';
                        break;
                    case 'cloudy':
                        unsplashImgQuery = 'cloudy';
                        break;
                    case 'fog':
                        unsplashImgQuery = 'fog';
                        break;
                    case 'partly-cloudy-day':
                        unsplashImgQuery = 'clouds';
                        // not ideal search term
                        break;
                    case 'partly-cloudy-night':
                        unsplashImgQuery = 'night';
                        // not ideal search term
                        break;
                    case 'rain':
                        unsplashImgQuery = 'rain';
                        break;
                    case 'sleet':
                        unsplashImgQuery = 'snow';
                        // not ideal search term
                        break;
                    case 'snow':
                        unsplashImgQuery = 'snow';
                        break;
                    case 'wind':
                        unsplashImgQuery = 'wind';
                        break;
                    default:
                        console.log('Forecast Icon Error!');
                }

                // Add to Image Query: Background Image with optimum size for device orientation
                // Implemented via viewport dimension comparison (easier than device-orientation + desktop browser compatible)

                var viewportWidth = window.innerWidth;
                var viewportHeight = window.innerHeight;
                var bgImageOrientation;

                if (viewportHeight > viewportWidth){
                    // Portrait orientation / viewport
                    bgImageOrientation = '&portrait&h=1500';
                } else {
                    // Landscape orientation / viewport
                    bgImageOrientation = '&landscape&w=1500';
                }


                return $http({
                    method: 'GET',
                    url: 'https://api.unsplash.com/photos/random?query=' + unsplashImgQuery + '&client_id=' + API_CREDENTIALS.UNSPLASH + bgImageOrientation
                })
            })

            .then(function(response) {

                //console.log('Unsplash Img Query: ', response.data);
                //console.log('Unsplash Img Large: ', response.data.urls.regular);
                //console.log('Photo taken by: ', response.data.user.name);
                //console.log('Photographer URL: ', response.data.user.links.html);
                //console.log('Photo main color: ', response.data.color);

                $scope.unsplashPhoto = response.data;

                var unsplashRandImgUrl = response.data.urls.custom;
                // urls.custom = query param (see above), urls.regular = 1080 w

                $scope.bgImgCurrentWeather = {
                    'background-image': 'url(' + unsplashRandImgUrl + ')'
                };

// API CALL 3 (Historical Weather I)
                return $http({
                    method: 'JSONP',
                    url: 'https://api.darksky.net/forecast/' + API_CREDENTIALS.DARKSKY + '/' + $scope.geoCoordinates + ',' + timeAgo.timeAgoFunc(7) + '?units=si&lang=de&callback=JSON_CALLBACK'
                })

            })

            .then(function (response) {
                $scope.weather1week = response.data;

// API CALL 4 (Historical Weather II)
                return $http({
                    method: 'JSONP',
                    url: 'https://api.darksky.net/forecast/' + API_CREDENTIALS.DARKSKY + '/' + $scope.geoCoordinates + ',' + timeAgo.timeAgoFunc(10 * 365 + 2) + '?units=si&lang=de&callback=JSON_CALLBACK'
                })
            })

            .then(function (response) {
                $scope.weather10years = response.data;

// API CALL 5 (Historical Weather III)
                return $http({
                    method: 'JSONP',
                    url: 'https://api.darksky.net/forecast/' + API_CREDENTIALS.DARKSKY + '/' + $scope.geoCoordinates + ',' + timeAgo.timeAgoFunc(20 * 365 + 6) + '?units=si&lang=de&callback=JSON_CALLBACK'
                })
            })

            .then(function (response) {
                $scope.weather20years = response.data;
            })


    }, function() {
        // on HTML5 Geo Location Error
        $('.city').html('<em>Kein Ort,<br />kein Wetter<br />:(</em>');
        $('#geo-error-modal').modal();
    });

}]);


app.factory('timeAgo', function() {
    return {
        timeAgoFunc: function(timeDiffDays) {
            var currentDateString = new Date();
            currentDateString.setTime(currentDateString.valueOf() - (timeDiffDays * 24 * 60 * 60 * 1000));
            // "valueOf" gets number out of (date-)string
            // JS Date needs ms (below converted back to sec for API)
            // TODO: dynamically count in leap-years
            var endDateSec = currentDateString.valueOf() / 1000;
            var endDateStripped = endDateSec | 0;
            // "Bitwise Operator" --> stripping digits after decimal point
            return endDateStripped;
        }
    }
});

app.filter('tempCelsius', function() {
    return function(input) {
        var output;
        if (input == '') {
            output = '';
        } else {
            output = input + '\xB0C';
        }
        return output;
    }
});

app.directive('myDataLoader', function() {
   return {
       restrict: 'E',
       scope: {
           hideIf: '=data' // Connection to template (below) --> makes directive dynamic
       },
       template: '<span class="data-label" ng-hide="hideIf"><em><small>(lade Daten...)</small></em></span>'
   };
});
