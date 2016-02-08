var app = angular.module('wetterLuchs', []);

//==== Controller with 2 API calls (dependend on e.a.) ("Promises-Chaining")
//---- http://bit.ly/1PijnPx
app.controller('WeatherCtrl', function($scope, $http) {

// 1st API Call (IP/Location)
    $http({method: 'GET', url: 'http://ipinfo.io/geo'})
    // TODO: add caching!

        .then(function (response) {
            $scope.ipCheck = response.data;
// 2nd API Call (W. Forecast)
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + '?units=si&lang=de&callback=JSON_CALLBACK'});
        })

        .then(function(response) {
            $scope.weatherInfo = response.data;

            var currentWeatherIcon = response.data.currently.icon;

            var iconImgCount = 0;
            switch (currentWeatherIcon) {
                // current number of pictures for every weather state ('icon')
                // (needs to be modified each time a picture gets added/removed)
                // (automation would be nice but difficult since JS = client side
                // and no access to files on the server (.jpg))
                case 'clear-day':
                    iconImgCount = 6;
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
                    iconImgCount = 2;
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
        });
});
