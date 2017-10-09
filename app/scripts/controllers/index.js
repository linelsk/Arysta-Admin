'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('IndexCtrl', ['$scope', '$http', 'API_PATH', '$window', 'contenidoFactory', function ($scope, $http, API_PATH, $window, contenidoFactory) {

        $scope.entrar = function (ev) {
            console.log($scope.login.username);
            console.log($scope.login.password);
            $http({
                url: API_PATH + "rest-auth/login/",
                method: 'POST',
                data: {
                    username: $scope.login.username,
                    password: $scope.login.password
                },
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).then(function successCallback(data, status) {
                //console.log(status);
                if (status = 200) {
                    location.href = "main";
                    $window.localStorage.role = "ADMINISTRADOR";
                    $window.localStorage.token = data.data.key;
                    $window.localStorage.nombre = $scope.login.username;

                    contenidoFactory.ServiceActive('manager/UserCurrent/', 'GET', {}).then(function (data) {
                        console.log(data);
                        $window.localStorage.userid = data.id;
                    });
                }
                else {
                    console.log(data);
                    contenidoFactory.mensaje(ev, "Usuario y/o contraseña incorrecta");
                }
            })
                .catch(function (e) {
                    console.log('Error: ', e);
                    //throw e;
                    contenidoFactory.mensaje(ev, "Usuario y/o contraseña incorrecta");
                });
        }
    }]);
