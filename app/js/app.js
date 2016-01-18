angular.module('pastWeather', [])
    .controller('IpCheckCtrl', function($scope, $http) {
        $http.get('http://ipinfo.io/geo')
            .then(function(response) { $scope.ipcheck = response.data });
    });