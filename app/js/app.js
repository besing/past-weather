var app = angular.module('pastWeather', []);

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

app.controller('IpCheckCtrl', function($scope, $http, resultService) {
    $http.get('http://ipinfo.io/geo')
        .then(function(response) {
            $scope.ipcheck = response.data;
            resultService.setResult(response.data);
            console.log('Query 1:', response.data);
            console.log('GetRes(1):', resultService.getResult());
        });
});

app.controller('WeatherCtrl', function($scope, $http, resultService) {
    var url = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/53.5500,10.0000';
    var callbackJsonp = '?callback=JSON_CALLBACK';
    $http.jsonp(url + callbackJsonp)
    .then(function(response) {
        $scope.weather = response.data;
        console.log('Query 2:', response.data);
        console.log('GetRes(2):', resultService.getResult().city);
        });
});
