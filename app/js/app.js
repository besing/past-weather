var app = angular.module('pastWeather', []);

//==== Controller with 2 API calls (dependend on e.a.) ("Promises-Chaining")
//---- http://bit.ly/1PijnPx
app.controller('ComboCtrl', function($scope, $http) {
    $http({method: 'GET', url: 'http://ipinfo.io/geo'})
    // TODO: add caching
        .then(function (response) {
            $scope.ipCheck = response.data;
            return $http({
                method: 'JSONP',
                url: 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/' + $scope.ipCheck.loc + '?units=si&callback=JSON_CALLBACK'});
        })
        .then(function(response) {
            $scope.weatherInfo = response.data;
        });
});
