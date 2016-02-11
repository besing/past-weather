var app = angular.module('wetterLuchs', []);

// Controller with several API calls (dependent on e.a.) ("Promises-Chaining")
// http://bit.ly/1PijnPx
app.controller('WeatherCtrl', ['$scope', '$http', 'timeAgo', function($scope, $http, timeAgo) {

// API CALL 1 (Location by IP)
    $http({method: 'GET', url: 'http://ipinfo.io/geo'})
    // TODO: add caching! (working on local machine but not on Uberspace..?)

        .then(function (response) {
            $scope.ipCheck = response.data;

// API CALL 2 (Current Weather)
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + '?units=si&lang=de&callback=JSON_CALLBACK'});
        })

        .then(function(response) {
            $scope.currentWeather = response.data;

            var currentWeatherIcon = response.data.currently.icon;

            var iconImgCount = 0;
            switch (currentWeatherIcon) {
                // current number of pictures for every weather state ('icon')
                // (needs to be modified each time a picture gets added/removed)
                // (automation would be nice but difficult since JS = client side
                // and no access to files on the server (.jpg))
                case 'clear-day':
                    iconImgCount = 7;
                    break;
                case 'clear-night':
                    iconImgCount = 4;
                    break;
                case 'cloudy':
                    iconImgCount = 1;
                    break;
                case 'fog':
                    iconImgCount = 4;
                    break;
                case 'partly-cloudy-day':
                    iconImgCount = 4;
                    break;
                case 'partly-cloudy-night':
                    iconImgCount = 1;
                    break;
                case 'rain':
                    iconImgCount = 2;
                    break;
                case 'sleet':
                    iconImgCount = 1;
                    break;
                case 'snow':
                    iconImgCount = 3;
                    break;
                case 'wind':
                    iconImgCount = 2;
                    break;
                default:
                    console.log('Forecast Icon Error!');
            }

            var randIconImg;

            if (iconImgCount == 0) {
                console.log('No Forecast Icon -- no different images!');
            } else if (iconImgCount == 1) {
                randIconImg = 1;
            } else {
                randIconImg = Math.floor(Math.random() * iconImgCount + 1);
            }

            $scope.bgImgCurrentWeather = {
                'background-image': 'url(img/bg/' + currentWeatherIcon + '_' + randIconImg + '.jpeg)'
            };

// API CALL 3 (Historical Weather I)
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + ',' + timeAgo.timeAgoFunc(7) + '?units=si&lang=de&callback=JSON_CALLBACK'
            })

        })

        .then(function (response) {
            $scope.weather1week = response.data;

// API CALL 4 (Historical Weather II)
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + ',' + timeAgo.timeAgoFunc(10 * 365 + 2) + '?units=si&lang=de&callback=JSON_CALLBACK'
            })
        })

        .then(function (response) {
            $scope.weather10years = response.data;

// API CALL 5 (Historical Weather III)
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + ',' + timeAgo.timeAgoFunc(25 * 365 + 6) + '?units=si&lang=de&callback=JSON_CALLBACK'
            })
        })

        .then(function (response) {
            $scope.weather25years = response.data;
        })
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


