
'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('ContactoCrtl', ['contenidoFactory', '$scope', '$mdDialog', 'API_PATH_MEDIA', function (contenidoFactory, $scope, $mdDialog, API_PATH_MEDIA) {

        $scope.contacto = [];

        contenidoFactory.ServiceContenido('contacto/Contacto/', 'GET', '{}').then(function (data) {

            for (var i = 0; i < data.data.length; i++) {
                $scope.ishome = "";
                if (data.data[i].ishome == true) {
                    $scope.ishome = "Sección home";
                }
                else {
                    $scope.ishome = "Sección contactanos";
                }

                $scope.contacto.push({
                    nombres: data.data[i].nombres,
                    correo: data.data[i].correo,
                    asunto: data.data[i].asunto,
                    mensaje: data.data[i].mensaje,
                    ishome: $scope.ishome
                });
            }
            
        });
    }]);
