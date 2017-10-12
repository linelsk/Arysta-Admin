
'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('Catalogos_newCtrl', ['contenidoFactory', '$scope', '$mdDialog', 'API_PATH_MEDIA', '$window', function (contenidoFactory, $scope, $mdDialog, API_PATH_MEDIA, $window) {

        $scope.subcategoria = false;
        $scope.subcategoriaarr = [];
        $scope.subcategoria_adm = [];
        $scope.id = "";
        contenidoFactory.ServiceContenido('catalogos/Categoria/', 'GET', '{}').then(function (data) {

            $scope.categoria = data.data;

        });

        $scope.gurdarCategoria = function (ev) {

            contenidoFactory.ServiceContenido('catalogos/Categoria/', 'POST', {
                "nombre": $scope.categoria.nombre

            }).then(function (data) {
                //console.log(data);
                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                contenidoFactory.ServiceContenido('catalogos/Categoria/', 'GET', {}).then(function (data) {
                    $scope.categoria = data.data;
                });
            });
        }

        $scope.eliminarCategoria = function (ev, id) {
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
                contenidoFactory.ServiceContenido('catalogos/CategoriaUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.ServiceContenido('catalogos/Categoria/', 'GET', {}).then(function (data) {
                        //console.log(data.data);
                        $scope.categoria = data.data;
                    });
                });
            });
        }

        $scope.AgregarSubCategoria = function (id) {
            //console.log(id);
            $scope.subcategoria = true;
            $scope.id = id;
            $scope.subcategoriaarr = [];
            contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'GET', '{}').then(function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].id_categoria == id) {
                        
                        $scope.subcategoriaarr.push({
                            "id": data.data[i].id,
                            "id_categoria": data.data[i].id_categoria,
                            "nombre": data.data[i].nombre
                        });
                    }                    
                }                
                console.log($scope.subcategoriaarr);
            });
            
        }

        $scope.gurdarSubCategoria = function () {
            contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'POST', {
                "id_categoria": $scope.id,
                "nombre": $scope.subcategoria_adm.nombre
            }).then(function (data) {
                $scope.subcategoriaarr = [];
                contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'GET', '{}').then(function (data) {
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].id_categoria == $scope.id) {

                            $scope.subcategoriaarr.push({
                                "id": data.data[i].id,
                                "id_categoria": data.data[i].id_categoria,
                                "nombre": data.data[i].nombre
                            });
                        }
                    }
                   //onsole.log($scope.subcategoriaarr);
                });

            });
        }

        $scope.eliminarSubCategoria = function (ev, id) {
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
                contenidoFactory.ServiceContenido('catalogos/SubCategoriaUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    $scope.subcategoriaarr = [];
                    contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'GET', '{}').then(function (data) {
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].id_categoria == $scope.id) {

                                $scope.subcategoriaarr.push({
                                    "id": data.data[i].id,
                                    "id_categoria": data.data[i].id_categoria,
                                    "nombre": data.data[i].nombre
                                });
                            }
                        }
                        //onsole.log($scope.subcategoriaarr);
                    });
                });
            });
        }

        $scope.regresar = function () {
            $scope.subcategoria = false;
        }
    }]);