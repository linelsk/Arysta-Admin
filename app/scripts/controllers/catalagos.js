'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('CatalogosCtrl', ['$scope', 'contenidoFactory', '$mdDialog', function ($scope, contenidoFactory, $mdDialog) {

        $scope.pais = [{}];
        $scope.cultivo = [{}];
        $scope.nuevo = false;
        $scope.nuevocultivo_v = false;
        $scope.id_pais = "";
        $scope.id_cultivo = "";

        contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {

        }).then(function (data) {
            console.log(data.data);
            $scope.pais = data.data;
        });

        contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {

        }).then(function (data) {
            console.log(data.data);
            $scope.cultivo = data.data;
        });


        $scope.nuevopais = function () {
            $scope.nuevo = true;
            $scope.pais = [{}];
            $scope.nuevoboton = true;
        }

        $scope.nuevocultivo = function () {
            $scope.nuevocultivo_v = true;
            $scope.cultivo = [{}];
            $scope.nuevobotoncultivo = true;
        }

        $scope.editarpais = function (id) {
            $scope.id_pais = id;
            $scope.nuevo = true;
            $scope.nuevoboton = false;
            contenidoFactory.ServiceContenido('catalogos/PaisUpdate/' + id + '/', 'GET', {

            }).then(function (data) {
                console.log(data.data);
                $scope.pais = data.data;
            });
        }

        $scope.editarcultivo = function (id) {
            $scope.id_cultivo = id;
            $scope.nuevocultivo_v = true;
            $scope.nuevobotoncultivo = false;
            contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + id + '/', 'GET', {

            }).then(function (data) {
                console.log(data.data);
                $scope.cultivo = data.data;
            });
        }

        $scope.eliminarpais = function (ev, id) {
            var confirm = $mdDialog.confirm({
                targetEvent: ev,
                template: '<md-dialog md-theme="{{ dialog.theme || dialog.defaultTheme }}" aria-label="{{ dialog.ariaLabel }}" ng-class="dialog.css">' +
                '<md-dialog-content class="md-dialog-content" role="document" tabIndex="-1">' +
                '<div class="md-dialog-content-body"><h5 class="negrita">¿Estás seguro que deseas borrar este ítem?</h5></div>' +
                '</md-dialog-content>' +
                '<md-dialog-actions>' +
                '<md-button ng-click="dialog.hide()" class="md-primary md-confirm-button">Si</md-button>' +
                '<md-button ng-click="dialog.abort()" class="md-primary md-cancel-button">No</md-button>' +
                '</md-dialog-actions>' +
                '</md-dialog>'
            })
            $mdDialog.show(confirm).then(function () {
                contenidoFactory.ServiceContenido('catalogos/PaisUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.pais = data.data;
                    });
                });
            });
        }

        $scope.eliminarcultivo = function (ev, id) {
            var confirm = $mdDialog.confirm({
                targetEvent: ev,
                template: '<md-dialog md-theme="{{ dialog.theme || dialog.defaultTheme }}" aria-label="{{ dialog.ariaLabel }}" ng-class="dialog.css">' +
                '<md-dialog-content class="md-dialog-content" role="document" tabIndex="-1">' +
                '<div class="md-dialog-content-body"><h5 class="negrita">¿Estás seguro que deseas borrar este ítem?</h5></div>' +
                '</md-dialog-content>' +
                '<md-dialog-actions>' +
                '<md-button ng-click="dialog.hide()" class="md-primary md-confirm-button">Si</md-button>' +
                '<md-button ng-click="dialog.abort()" class="md-primary md-cancel-button">No</md-button>' +
                '</md-dialog-actions>' +
                '</md-dialog>'
            })
            $mdDialog.show(confirm).then(function () {
                contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.cultivo = data.data;
                    });
                });
            });
        }

        $scope.guardarValores = function (ev) {
            if ($scope.pais.nombre_us != "" || $scope.pais.nombre_us != "" || $scope.pais.nombre_us != "" || $scope.pais.pais_us != "" || $scope.pais.abreviacion != "") {
                contenidoFactory.ServiceContenido('catalogos/Pais/', 'POST', {

                    "nombre_us": $scope.pais.nombre_us,
                    "nombre_ar": $scope.pais.nombre_ar,
                    "nombre_br": $scope.pais.nombre_br,
                    "abreviacion": $scope.pais.abreviacion,
                    "created_by": 1

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.mensaje(ev, "Registro dado de alta correctamente");
                    $scope.nuevo = false;
                    contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.pais = data.data;
                    });
                });
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo debe ser llenado");

            }
        }

        $scope.guardarValorescultivo = function (ev) {
            if ($scope.cultivo.nombre_us != "" || $scope.cultivo.nombre_us != "" || $scope.cultivo.nombre_us != "" || $scope.cultivo.pais_us != "") {
                contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'POST', {

                    "nombre_us": $scope.cultivo.nombre_us,
                    "nombre_ar": $scope.cultivo.nombre_ar,
                    "nombre_br": $scope.cultivo.nombre_br,
                    "created_by": 1

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.mensaje(ev, "Registro dado de alta correctamente");
                    $scope.nuevocultivo_v = false;
                    contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.cultivo = data.data;
                    });
                });
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo debe ser llenado");

            }
        }

        $scope.EditarValores = function (ev) {
            contenidoFactory.ServiceContenido('catalogos/PaisUpdate/' + $scope.id_pais + '/', 'PUT', {

                "nombre_us": $scope.pais.nombre_us,
                "nombre_ar": $scope.pais.nombre_ar,
                "nombre_br": $scope.pais.nombre_br,
                "abreviacion": $scope.pais.abreviacion,
                "created_by": 1

            }).then(function (data) {
                contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                $scope.nuevo = false;
                contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {}).then(function (data) {
                    console.log(data.data);
                    $scope.pais = data.data;
                });
            });
        }

        $scope.EditarValorescultivo = function (ev) {
            contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + $scope.id_cultivo + '/', 'PUT', {

                "nombre_us": $scope.cultivo.nombre_us,
                "nombre_ar": $scope.cultivo.nombre_ar,
                "nombre_br": $scope.cultivo.nombre_br,
                "created_by": 1

            }).then(function (data) {
                contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                $scope.nuevocultivo_v = false;
                contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
                    console.log(data.data);
                    $scope.cultivo = data.data;
                });
            });
        }
    }]);
