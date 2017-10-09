'use strict';

/**
 * @ngdoc function
 * @name tcsGruntApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tcsGruntApp
 */
angular.module('spraytec-admin')
    .factory('contenidoFactory', ['$http', '$q', 'API_PATH', '$resource', '$window', '$mdDialog', function ($http, $q, API_PATH, $resource, $window, $mdDialog) {

        return {
            ServiceContenido: function (URL, tipo, parametros) {
                var _defer = $q.defer();

                $http({
                    url: API_PATH + URL,
                    method: tipo,
                    data: parametros,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).then(function successCallback(response) {
                    _defer.resolve(response);
                }, function errorCallback(response) {
                    _defer.resolve(response);
                });

                return _defer.promise;
            },

            ServiceActive: function (URL, tipo, parametros) {
                //console.log($window.localStorage.token);
                var _defer = $q.defer();
                $http({
                    url: API_PATH + URL,
                    method: tipo, //Puede ser GET, POST, HEAD, OPTIONS.
                    data: parametros,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + $window.localStorage.token                        
                    }
                }).then(
                    function (data) {
                        _defer.resolve(data.data);
                    },
                    function (e) {
                        console.log(e);
                        _defer.reject();
                    });

                return _defer.promise;
            },

            login: function (_email, _pass, _url) {
                var _defer = $q.defer();
                $http({
                    url: API_PATH + _url,
                    method: 'POST',
                    data: {
                        email: _email,
                        password: _pass
                    },
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).then(function successCallback(data) {
                    //console.log(data.data);
                    _defer.resolve(data.data);
                }).then(function successCallback(e) {
                    _defer.reject(e);
                });

                return _defer.promise;
            },

            session: function () {
                if ($window.localStorage.token) {
                    return true;
                }
                return false;
            },

            token: function () {
                if ($window.localStorage.token) {
                    return $window.localStorage.token;
                }
                return '';
            },

            role: function () {
                if ($window.localStorage.role) {
                    return $window.localStorage.role;
                }
                return null;
            },

            mensaje: function (ev, contenido) {

                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .textContent(contenido)
                        .ariaLabel('Mensajes')
                        .ok('Aceptar')
                        .targetEvent(ev)
                );
            }

        }
    }])
    .factory('file', ['$http', '$q', 'API_PATH', '$resource', '$window', function ($http, $q, API_PATH, $resource, $window) {
        return $resource('http://127.0.0.1:8001/manager/ImagenMenu/:pk/', { 'pk': '@pk' }, {
            'save': {
                method: 'POST',
                transformRequest: transformImageRequest,
                headers: {
                    'authorization': 'token ' + $window.localStorage.token,
                    'Content-Type': undefined
                }
            },
        });

        function transformImageRequest(data) {
            console.log(data);
            if (data === undefined)
                return data;

            var fd = new FormData();
            angular.forEach(data, function (value, key) {
                console.log(value);
                console.log(key);
                if (value instanceof FileList) {
                    if (value.length == 1) {
                        fd.append(key, value[0]);
                    } else {
                        angular.forEach(value, function (file, index) {
                            fd.append(key + '_' + index, file);
                        });
                    }
                } else {
                    fd.append(key, value);
                }
            });
            console.log(fd);
            return fd;
        }
    }])
    .factory('focus', function ($timeout, $window) {
        return function (id) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function () {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    });

