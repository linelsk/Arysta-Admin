
'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('ContactoCrtl', ['contenidoFactory', '$scope', '$mdDialog', 'API_PATH_MEDIA', '$window', function (contenidoFactory, $scope, $mdDialog, API_PATH_MEDIA, $window) {

        $scope.contacto = [];
        $scope.contacto_imagen = [];
        $scope.insertImagencontacto = false;

        contenidoFactory.ServiceContenido('manager/Contacto/', 'GET', '{}').then(function (data) {

            $scope.contacto = data.data;
            
        });

        $scope.setFiles = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.img_source = event.target.result;
                $scope.image_test = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        contenidoFactory.ServiceContenido('manager/Contacto_Administrable_Imagen/', 'GET', '{}').then(function (data) {

            if (data.data != "") {
                $scope.contacto_imagen = data.data;
                $scope.contacto_imagen.image_update = data.data[0].image;
                $scope.img_source = API_PATH_MEDIA + data.data[0].image;
                $scope.insertImagencontacto = true;
            }

        });

        contenidoFactory.ServiceContenido('manager/Contacto_Administrable/', 'GET', '{}').then(function (data) {

            if (data.data != "") {
                $scope.contacto_adm = data.data;
            }

        });

        $scope.gurdarImagenContacto = function (ev) {
            if ($scope.insertImagencontacto == false) {

                $scope.userExtencion = $scope.img_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('manager/SubirImagenContacto/', 'PUT', {
                    "image": $scope.img_source.split(',')[1],
                    "extension": $scope.tipoimg

                }).then(function (data) {
                    contenidoFactory.ServiceContenido('manager/Contacto_Administrable_Imagen/', 'POST', {
                        "image": data.data.image + '.' + data.data.extension

                    }).then(function (data) {
                        //console.log(data);
                        contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                    });
                });
            }
            else {
                $scope.userExtencion = $scope.img_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('manager/SubirImagenContacto/', 'PUT', {
                    "image": $scope.img_source.split(',')[1],
                    "extension": $scope.tipoimg

                }).then(function (data) {
                    contenidoFactory.ServiceContenido('manager/Contacto_Administrable_Imagen/' + $scope.contacto_imagen.id + '/', 'PUT', {
                        "image": data.data.image + '.' + data.data.extension

                    }).then(function (data) {
                        //console.log(data);
                        contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                    });
                });
            }
        }

        $scope.gurdarContacto = function (ev) {
            contenidoFactory.ServiceContenido('manager/Contacto_Administrable/', 'POST', {

                "nombre_contcato": $scope.contacto_adm.nombre_contcato,
                "telefono_contacto": $scope.contacto_adm.telefono_contacto,
                "created_by": $window.localStorage.userid

            }).then(function (data) {
                //console.log(data);
                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                contenidoFactory.ServiceContenido('manager/Contacto_Administrable/', 'GET', {}).then(function (data) {
                    console.log(data.data);
                    $scope.contacto_adm = data.data;
                });
            });
        }

        $scope.eliminarContacto = function (ev, id) {
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
                contenidoFactory.ServiceContenido('manager/ContactoUpdate_Administrable/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.ServiceContenido('manager/Contacto_Administrable/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.contacto_adm = data.data;
                    });
                });
            });
        }
    }]);
