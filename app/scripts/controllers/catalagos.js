'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('CatalogosCtrl', ['$scope', 'contenidoFactory', '$mdDialog', '$window', 'API_PATH_MEDIA', function ($scope, contenidoFactory, $mdDialog, $window, API_PATH_MEDIA) {

        $scope.pais = [{}];
        $scope.cultivo = [{}];
        $scope.nuevo = false;
        $scope.nuevocultivo_v = false;
        $scope.id_pais = "";
        $scope.id_cultivo = "";
        $scope.image_source_temp = "";

        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'GET', {}).then(function (data) {
            console.log(data.data);
            $scope.ubicacion = data.data;
        });

        $scope.nuevopais = function () {
            $scope.nuevo = true;
            $scope.nuevoboton = true;
        }

        $scope.setFile = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source = event.target.result;
                $scope.image_source_temp = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.editarubicacion = function (id) {
            $scope.nuevo = true;
            $scope.nuevoboton = false;
            contenidoFactory.ServiceContenido('catalogos/DondeEstamosUpdate/' + id + '/', 'GET', {

            }).then(function (data) {
                console.log(data.data);
                $scope.ubicacion_somos = data.data;
                contenidoFactory.ServiceContenido('catalogos/DondeEstamos_telefonoUpdate/' + id + '/', 'GET', {

                }).then(function (result) {
                    console.log(result.data);
                    //$scope.ubicacion_tel.image_update = data.data.image;
                    $scope.image_source = API_PATH_MEDIA + result.data.image;
                    $scope.ubicacion_tel = result.data;
                });
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

        $scope.gurdarUbicacion = function (ev) {
            if ($scope.ubicacion.direccion != "" || $scope.ubicacion.image_source != "" || $scope.ubicacion.nombre_rtv != "" || $scope.ubicacion.telefono_rtv == "" || $scope.ubicacion.movil_rtv == ""
                || $scope.ubicacion.mail_rtv != "" || $scope.ubicacion.nombre_dm != "" || $scope.ubicacion.telefono_dm != "" || $scope.ubicacion.movil_dm != "" || $scope.ubicacion.mail_dm
            ) {
                contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'POST', {

                    "direccion": $scope.ubicacion_somos.direccion,
                    "created_by": $window.localStorage.userid

                }).then(function (data) {

                    $scope.userExtencion = $scope.image_source.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                    $scope.filename = guid()

                    contenidoFactory.ServiceContenido('catalogos/SubirImagenDondeEstamos/', 'PUT', {
                        "image": $scope.image_source.split(',')[1],
                        "extension": $scope.tipoimg,
                        "filename": $scope.filename

                    }).then(function (ubicacion) {
                        contenidoFactory.ServiceContenido('catalogos/DondeEstamos_telefono/', 'POST', {

                            "id": data.data.id,
                            "image": ubicacion.data.image + '.' + ubicacion.data.extension,
                            "nombre_rtv": $scope.ubicacion_tel.nombre_rtv,
                            "telefono_rtv": $scope.ubicacion_tel.telefono_rtv,
                            "movil_rtv": $scope.ubicacion_tel.movil_rtv,
                            "mail_rtv": $scope.ubicacion_tel.mail_rtv,
                            "nombre_dm": $scope.ubicacion_tel.nombre_dm,
                            "telefono_dm": $scope.ubicacion_tel.telefono_dm,
                            "movil_dm": $scope.ubicacion_tel.movil_dm,
                            "mail_dm": $scope.ubicacion_tel.mail_dm,
                            "created_by": $window.localStorage.userid

                        }).then(function (result) {
                            contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                            $scope.nuevo = false;
                            contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'GET', {}).then(function (data) {
                                $scope.ubicacion = result.data;
                            });
                        });
                    });

                });
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo debe ser llenado");

            }
        }

        $scope.editUbicaion = function (ev) {
            if ($scope.image_source_temp == "") {

                contenidoFactory.ServiceContenido('catalogos/DondeEstamosUpdate/' + $scope.ubicacion_somos.id + '/', 'PUT', {
                    "direccion": $scope.ubicacion_somos.direccion,
                    "created_by": $window.localStorage.userid

                }).then(function (data) {
                    console.log(data);
                    contenidoFactory.ServiceContenido('catalogos/DondeEstamos_telefonoUpdate/' + $scope.ubicacion_somos.id + '/', 'PUT', {

                        "id": $scope.ubicacion_somos.id,
                        "image": $scope.ubicacion_tel.image,
                        "nombre_rtv": $scope.ubicacion_tel.nombre_rtv,
                        "telefono_rtv": $scope.ubicacion_tel.telefono_rtv,
                        "movil_rtv": $scope.ubicacion_tel.movil_rtv,
                        "mail_rtv": $scope.ubicacion_tel.mail_rtv,
                        "nombre_dm": $scope.ubicacion_tel.nombre_dm,
                        "telefono_dm": $scope.ubicacion_tel.telefono_dm,
                        "movil_dm": $scope.ubicacion_tel.movil_dm,
                        "mail_dm": $scope.ubicacion_tel.mail_dm,
                        "created_by": $window.localStorage.userid

                    }).then(function (result) {
                        console.log(result);
                        contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'GET', {}).then(function (data) {
                            $scope.ubicacion = result.data;
                        });
                    });
                });

            }
            else {
                contenidoFactory.ServiceContenido('catalogos/DondeEstamosUpdate/' + $scope.ubicacion_somos.id + '/', 'PUT', {

                    "direccion": $scope.ubicacion_somos.direccion,
                    "created_by": $window.localStorage.userid

                }).then(function (data) {

                    $scope.userExtencion = $scope.image_source.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                    $scope.filename = guid()

                    contenidoFactory.ServiceContenido('catalogos/SubirImagenDondeEstamos/', 'PUT', {
                        "image": $scope.image_source.split(',')[1],
                        "extension": $scope.tipoimg,
                        "filename": $scope.filename

                    }).then(function (ubicacion) {
                        contenidoFactory.ServiceContenido('catalogos/DondeEstamos_telefonoUpdate/' + $scope.ubicacion_somos.id + '/', 'PUT', {

                            "id": data.data.id,
                            "image": ubicacion.data.image + '.' + ubicacion.data.extension,
                            "nombre_rtv": $scope.ubicacion_tel.nombre_rtv,
                            "telefono_rtv": $scope.ubicacion_tel.telefono_rtv,
                            "movil_rtv": $scope.ubicacion_tel.movil_rtv,
                            "mail_rtv": $scope.ubicacion_tel.mail_rtv,
                            "nombre_dm": $scope.ubicacion_tel.nombre_dm,
                            "telefono_dm": $scope.ubicacion_tel.telefono_dm,
                            "movil_dm": $scope.ubicacion_tel.movil_dm,
                            "mail_dm": $scope.ubicacion_tel.mail_dm,
                            "created_by": $window.localStorage.userid

                        }).then(function (result) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                            $scope.nuevo = false;
                            contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'GET', {}).then(function (data) {
                                $scope.ubicacion = result.data;
                            });
                        });
                    });

                });
            }
        }

        $scope.regresar = function () {
            $scope.nuevo = false;
            contenidoFactory.ServiceContenido('catalogos/DondeEstamos/', 'GET', {

            }).then(function (data) {
                //console.log(data.data);
                $scope.ubicacion = data.data;
                //$scope.get_pais = $scope.get_pais;
            });
        }

    }]);
