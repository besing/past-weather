var app = angular.module('pastWeather', []);

app.controller('IpCheckCtrl', function($scope, $http) {
    $http.get('http://ipinfo.io/geo')
        .then(function(response) {
            $scope.ipcheck = response.data;
            //return response;
        });
});

app.controller('WeatherCtrl', function($scope, $http) {

    //request.then(function(data) {
    //   var location = $scope.ipcheck.loc;
    //});

    //var url = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/' + location;
    var url = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/53.5500,10.0000';
    var callbackJsonp = '?callback=JSON_CALLBACK';
    $http.jsonp(url + callbackJsonp)
        .then(function(response) {
            $scope.weather = response.data;
            console.log('Response: ' + response.data);
        });
});
