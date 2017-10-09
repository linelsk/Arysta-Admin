'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('MainCtrl', ['contenidoFactory', '$scope', 'file', '$window', 'API_PATH_MEDIA', function (contenidoFactory, $scope, file, $window, API_PATH_MEDIA) {

        $scope.imagen = [{}];
        $scope.image_source = [{}];
        $scope.image_temp = "";
        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.inserttexto = false;

        contenidoFactory.ServiceContenido('manager/ImagenHeader/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.image_source = $scope.API_PATH_MEDIA + data.data[0].image;
                $scope.image = data.data[0].id;
            }
        });

        contenidoFactory.ServiceContenido('manager/Menu/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.main = data.data[0];
                $scope.inserttexto = true;
                //$scope.texto_id = data.data[0].id
            }
        });

        $scope.setFile = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source = event.target.result;
                $scope.image_temp = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.uploadImage = function (ev) {
            //console.log($scope.image);
            $scope.userExtencion = $scope.image_source.split(',');
            $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

            if ($scope.image_temp != "") {
                contenidoFactory.ServiceContenido('manager/SubirImagenHeader/', 'PUT', {
                    "image": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg

                }).then(function (data) {
                    console.log(data);
                    if ($scope.image == undefined) {
                        contenidoFactory.ServiceContenido('manager/ImagenHeader/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "filename": "logo"
                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                        });                        
                    }
                    else {
                        contenidoFactory.ServiceContenido('manager/ImagenHeaderUpdate/' + $scope.image + '/', 'PUT', {
                            "image": data.data.image + '.' + data.data.extension,
                            "filename": "logo"
                        }).then(function (data) {
                            console.log(data);
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                });
            }
            else {
                contenidoFactory.mensaje(ev, "Falta una imagen para subir");
            }

        }

        $scope.guardarMenu = function (ev) {
            console.log($scope.inserttexto);
            if ($scope.main.quienessomos != "" || $scope.main.productos != "" || $scope.main.pronutiva != "" || $scope.main.dondeestamos != "" || $scope.main.contacto != "" || $scope.main.copyright != "") {
                if ($scope.inserttexto == false) {
                    contenidoFactory.ServiceContenido('manager/Menu/', 'POST', {

                        "quienessomos": $scope.main.quienessomos,
                        "productos": $scope.main.productos,
                        "pronutiva": $scope.main.pronutiva,
                        "dondeestamos": $scope.main.dondeestamos,
                        "contacto": $scope.main.contacto,
                        "status": true,
                        "created_by": $window.localStorage.userid,
                        "copyright": $scope.main.copyright

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro dado de alta correctamente");
                    });
                }
                else {
                    contenidoFactory.ServiceContenido('manager/MenuUpdate/' + $scope.main.id + '/', 'PUT', {

                        "quienessomos": $scope.main.quienessomos,
                        "productos": $scope.main.productos,
                        "pronutiva": $scope.main.pronutiva,
                        "dondeestamos": $scope.main.dondeestamos,
                        "contacto": $scope.main.contacto,
                        "status": true,
                        "created_by": $scope.main.created_by,
                        "modified_by": $window.localStorage.userid,
                        "copyright": $scope.main.copyright

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                    });
                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo debe ser llenado");
            }
        }
    }]);
