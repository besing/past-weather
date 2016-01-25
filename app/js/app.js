var app = angular.module('pastWeather', []);

// === Factory for Sharing Data between controllers
// ====== Tuts+: http://bit.ly/1PwcJXH
app.factory('resultService', function() {
    var result;
    var resultService = {
        setResult: function(input) {
            result = input;
        },
        getResult: function() {
            return result;
        }
    };
    return resultService;
});

// === 1st controller (IP Check)
app.controller('IpCheckCtrl', function($scope, $http, resultService) {
    $http.get('http://ipinfo.io/geo')
        .then(function(response) {
            $scope.ipcheck = response.data;
            resultService.setResult(response.data);
            //console.log('Query 1:', response.data);
            //console.log('GetRes(1):', resultService.getResult());
        });
});

// === 2nd controller (use IP for Weather Data)
// ====== (call resultService inside Promise of $http (http://bit.ly/1Pwdlww))
app.controller('WeatherCtrl', function($scope, $http, resultService) {
    var urlByLocation = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/'
        + resultService.getResult().loc;
    $http.jsonp(urlByLocation + '?callback=JSON_CALLBACK')
    .then(function(response) {
        $scope.weather = response.data;
        //console.log('Query 2:', response.data);
        //console.log('GetRes(2):', resultService.getResult().city);
        });
});
