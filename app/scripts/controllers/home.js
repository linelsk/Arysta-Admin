'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('HomeCtrl', ['contenidoFactory', '$scope', 'API_PATH_MEDIA', '$window', function (contenidoFactory, $scope, API_PATH_MEDIA, $window) {

        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.insertSeccionAzul = false;
        $scope.insertVideo = false;
        $scope.insertcontactos = false;
        $scope.image_test = "";
        $scope.image_dist = "";
        $scope.image_cont = "";

        $scope.home = {
            "textomensaje": "",
            "mensaje_boton": ""
        };

        $scope.azul = {
            "textomensaje": ""
        }

        $scope.video = {
            "video_url": "",
        };

        $scope.distribuidor = {
            "image": "",
            "textomensaje": "",
            "mensaje_boton": ""
        }

        $scope.contactos = {
            "image": "",
            "textomensaje": "",
            "mensaje_boton": ""
        }

        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        ///Imagen Slider
        contenidoFactory.ServiceContenido('manager/Slider/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.slider_img = data.data;
            }
        });

        $scope.setFileSlider = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source_slider = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarSlider = function (ev) {
            //console.log($scope.image);
            if ($scope.image_source_slider == undefined) {
                contenidoFactory.mensaje(ev, "Falta la imagen para carrusel");
            }
            else {
                $scope.userExtencion = $scope.image_source_slider.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('manager/SubirImagenSlider/', 'PUT', {
                    "image": $scope.image_source_slider.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {
                    console.log(data);

                    contenidoFactory.ServiceContenido('manager/Slider/', 'POST', {
                        "image": data.data.image + '.' + data.data.extension,
                        "textomensaje": $scope.home.textomensaje,
                        "mensaje_boton": $scope.home.mensaje_boton,
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        contenidoFactory.ServiceContenido('manager/Slider/', 'GET', '{}').then(function (data) {
                            //console.log(data.data);
                            if (data.data != "") {
                                $scope.slider_img = data.data;
                            }
                        });
                    });
                });
            }

        }

       ///Imagen seccion azul
        contenidoFactory.ServiceContenido('manager/Seccion_azul/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.azul.image_update = data.data[0].image;
                $scope.azul = data.data[0];
                $scope.azul.image = API_PATH_MEDIA + data.data[0].image;
                $scope.insertSeccionAzul = true;
            }
        });

        $scope.setSeccionAzul = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.azul.image = event.target.result;
                $scope.image_test = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarSeccionAzul = function (ev) {
            if ($scope.azul.textomensaje != "") {
                if ($scope.insertSeccionAzul == false) {

                    $scope.userExtencion = $scope.azul.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenseccionAzul/', 'PUT', {
                        "image": $scope.azul.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Seccion_azul/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.azul.textomensaje,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_test == "") {
                        console.log($scope.azul.image);
                        contenidoFactory.ServiceContenido('manager/Seccion_azulUpdate/' + $scope.azul.id + '/', 'PUT', {

                            "image": $scope.azul.image_update,
                            "textomensaje": $scope.azul.textomensaje,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.azul.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenseccionAzul/', 'PUT', {
                            "image": $scope.azul.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Seccion_azulUpdate/' + $scope.azul.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.azul.textomensaje,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                                //contenidoFactory.ServiceContenido('manager/Texto_empresa/', 'GET', '{}').then(function (data) {
                                //    //console.log(data.data);
                                //    if (data.data != "") {
                                //        //$scope.insertempresa = true;
                                //        $scope.image_empresa_uno = API_PATH_MEDIA + '/' + data.data[0].image;
                                //        //$scope.empresa_id = data.data[0].id
                                //    }
                                //});
                            });
                        });
                    }

                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        ///URL video
        contenidoFactory.ServiceContenido('manager/Seccion_video/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.video = data.data[0];
            }
        });

        $scope.guardarUrlVideo = function (ev) {
            if ($scope.video.video_url != "") {
                if ($scope.insertVideo == false) {

                    contenidoFactory.ServiceContenido('manager/Seccion_video/', 'POST', {
                        "video_url": $scope.video.video_url,
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                        contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                    });
                }
                else {

                    contenidoFactory.ServiceContenido('manager/Seccion_videoUpdate/', 'PUT', {
                        "video_url": $scope.video.video_url,
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                        contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                    });

                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        ///Distibuidor
        contenidoFactory.ServiceContenido('manager/Seccion_distribuidor/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.distribuidor.image_update = data.data[0].image;
                $scope.distribuidor = data.data[0];
                $scope.distribuidor.image = API_PATH_MEDIA + data.data[0].image;
                $scope.insertdistribuidor = true;
            }
        });

        $scope.setFilesDistribuidor = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.distribuidor.image = event.target.result;
                $scope.image_dist = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.uploadImagesDistribuidor = function (ev) {
            if ($scope.image_dist != "" || $scope.distribuidor.textomensaje != "" || $scope.distribuidor.mensaje_boton) {
                if ($scope.insertdistribuidor == false) {

                    $scope.userExtencion = $scope.distribuidor.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenseccionDistribuidor/', 'PUT', {
                        "image": $scope.distribuidor.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Seccion_distribuidor/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.distribuidor.textomensaje,
                            "mensaje_boton": $scope.distribuidor.mensaje_boton,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_dist == "") {
                        contenidoFactory.ServiceContenido('manager/Seccion_distribuidorUpdate/' + $scope.distribuidor.id + '/', 'PUT', {

                            "image": $scope.distribuidor.image_update,
                            "textomensaje": $scope.distribuidor.textomensaje,
                            "mensaje_boton": $scope.distribuidor.mensaje_boton,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.distribuidor.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenseccionDistribuidor/', 'PUT', {
                            "image": $scope.distribuidor.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Seccion_distribuidorUpdate/' + $scope.distribuidor.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.distribuidor.textomensaje,
                                "mensaje_boton": $scope.distribuidor.mensaje_boton,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                                //contenidoFactory.ServiceContenido('manager/Texto_empresa/', 'GET', '{}').then(function (data) {
                                //    //console.log(data.data);
                                //    if (data.data != "") {
                                //        //$scope.insertempresa = true;
                                //        $scope.image_empresa_uno = API_PATH_MEDIA + '/' + data.data[0].image;
                                //        //$scope.empresa_id = data.data[0].id
                                //    }
                                //});
                            });
                        });
                    }

                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        ///Contactos
        contenidoFactory.ServiceContenido('manager/Seccion_contacto/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.contactos.image_update = data.data[0].image;
                $scope.contactos = data.data[0];
                $scope.contactos.image = API_PATH_MEDIA + data.data[0].image;
                $scope.insertcontactos = true;
            }
        });

        $scope.setFilescontactos = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.contactos.image = event.target.result;
                $scope.image_cont = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.uploadImagesContactos = function (ev) {
            if ($scope.image_cont != "" || $scope.contactos.textomensaje != "" || $scope.contactos.mensaje_boton) {
                if ($scope.insertcontactos == false) {

                    $scope.userExtencion = $scope.contactos.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenseccionContacto/', 'PUT', {
                        "image": $scope.contactos.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Seccion_contacto/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.contactos.textomensaje,
                            "mensaje_boton": $scope.contactos.mensaje_boton,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_cont == "") {
                        contenidoFactory.ServiceContenido('manager/Seccion_contactoUpdate/' + $scope.contactos.id + '/', 'PUT', {

                            "image": $scope.contactos.image_update,
                            "textomensaje": $scope.contactos.textomensaje,
                            "mensaje_boton": $scope.contactos.mensaje_boton,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.contactos.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenseccionContacto/', 'PUT', {
                            "image": $scope.contactos.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Seccion_contactoUpdate/' + $scope.contactos.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.contactos.textomensaje,
                                "mensaje_boton": $scope.contactos.mensaje_boton,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                            });
                        });
                    }

                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }
    }]);