var app = angular.module('pastWeather', []);

/*app.controller('IpCheckCtrl', function($scope, $http) {
    request = $http.get('http://ipinfo.io/geo')
        .then(function(response) {
            $scope.ipcheck = response.data;
            //return response;
        });
});

app.controller('WeatherCtrl', function($scope, $http) {
    request.then(function(data) {
       var location = $scope.ipcheck.loc;
    });
    var url = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/' + location;
    $http.get(url)
    // location.loc)
        .then(function(response) { $scope.weather = response.data });
});*/

app.controller('CombinedCtrl', function($scope, $http) {
    var requestIp = $http.get('http://ipinfo.io/geo')
        .then(function(response) {
            $scope.ipcheck = response.data;
            return response;
        });

    requestIp.then(function(data) {
        var ort = $scope.ipcheck.loc;

        var urlApi = 'https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/' + ort;
        console.log('URL =' + urlApi);

        //$http.get(urlApi)
        $http.get('https://api.forecast.io/forecast/14224f71802d6102f9e3337b9ab049a5/53.5500,10.0000')
            .then(function(response) { $scope.weather = response.data });
            console.log('Response: ' + weather.timezone);
    });
});