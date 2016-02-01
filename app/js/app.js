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
                url: 'https://api.forecast.io/forecast/1d96cc3ef09464128ca17edb27b686c6/' + $scope.ipCheck.loc + '?units=si&lang=de&callback=JSON_CALLBACK'});
        })
        .then(function(response) {
            $scope.weatherInfo = response.data;
        });
});
