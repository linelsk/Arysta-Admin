'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('headercontroller', ['contenidoFactory', '$scope', '$window', '$http', 'API_PATH', function (contenidoFactory, $scope, $window, $http, API_PATH) {

        //$window.localStorage.clear();
        //$window.location.assign('/');

        $scope.salir = function () {
            $http({
                url: API_PATH + 'rest-auth/logout/',
                headers: {
                    authorization: 'token ' + $window.localStorage.token
                },
                method: 'POST',
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).then(function (data, status) {
                if (status == 200) {
                    $window.location.href = "#/";
                    $localStorage.token = "";
                }
                console.log(data);
            })

            $window.localStorage.clear();
            $window.location.assign('/');
        }
    }]);


