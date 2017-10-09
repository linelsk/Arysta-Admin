'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('AcercaCtrl', ['contenidoFactory', '$scope', '$mdDialog', 'API_PATH_MEDIA', '$window', function (contenidoFactory, $scope, $mdDialog, API_PATH_MEDIA, $window) {

        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.insertquienessomos = false;
        $scope.image_test = "";
        $scope.inserthistoria = false;
        $scope.image_testHistoria = "";
        $scope.insertmyv = false;
        $scope.image_tesMision = "";
        $scope.image_tesVision = "";
        $scope.mision_img = [];
        $scope.valores_img = [];

        $scope.quienessomos = {
            "image": "",
            "textomensaje": "",
            "titulo": "",
            "nosotros": "",
        };

        $scope.historia = {
            "image": "",
            "textomensaje": "",
        };

        $scope.mision = {
            "image": ""
        };

        $scope.vision = {
            "image": ""
        }

        $scope.valores = {
            "image": ""
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

        ///Quienes somos
        contenidoFactory.ServiceContenido('manager/QuienesSomos/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.quienessomos.image_update = data.data[0].image;
                $scope.quienessomos = data.data[0];
                $scope.quienessomos.image = API_PATH_MEDIA + data.data[0].image;
                $scope.insertquienessomos = true;
            }
        });

        $scope.setFilesQuienessomos = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.quienessomos.image = event.target.result;
                $scope.image_test = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarquienessomo = function (ev) {
            if ($scope.image_test != "" || $scope.quienessomos.textomensaje != "" || $scope.quienessomos.titulo != "" || $scope.quienessomos.nosotros) {
                if ($scope.insertquienessomos == false) {

                    $scope.userExtencion = $scope.quienessomos.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenquienessomos/', 'PUT', {
                        "image": $scope.quienessomos.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/QuienesSomos/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.quienessomos.textomensaje,
                            "titulo": $scope.quienessomos.titulo,
                            "nosotros": $scope.quienessomos.nosotros,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_test == "") {
                        //console.log($scope.quienessomos.textomensajeNosotros);
                        contenidoFactory.ServiceContenido('manager/QuienesSomosUpdate/' + $scope.quienessomos.id + '/', 'PUT', {

                            "image": $scope.quienessomos.image_update,
                            "textomensaje": $scope.quienessomos.textomensaje,
                            "titulo": $scope.quienessomos.titulo,
                            "nosotros": $scope.quienessomos.nosotros,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.quienessomos.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenquienessomos/', 'PUT', {
                            "image": $scope.quienessomos.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/QuienesSomosUpdate/' + $scope.quienessomos.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.quienessomos.textomensaje,
                                "titulo": $scope.quienessomos.titulo,
                                "nosotros": $scope.quienessomos.textomensajeNosotros,
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

        ///Acordeon Historia
        contenidoFactory.ServiceContenido('manager/Acordeon_historia/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.historia.image_update = data.data[0].image;
                $scope.historia = data.data[0];
                $scope.historia.image = API_PATH_MEDIA + data.data[0].image;
                $scope.inserthistoria = true;
            }
        });

        $scope.setFilesHistoria = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.historia.image = event.target.result;
                $scope.image_testHistoria = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarHistoria = function (ev) {
            if ($scope.image_testHistoria != "" || $scope.historia.textomensaje != "") {
                if ($scope.inserthistoria == false) {

                    $scope.userExtencion = $scope.historia.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonHistoria/', 'PUT', {
                        "image": $scope.historia.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Acordeon_historia/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.historia.textomensaje,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_testHistoria == "") {
                        contenidoFactory.ServiceContenido('manager/Acordeon_historiaUpdate/' + $scope.historia.id + '/', 'PUT', {

                            "image": $scope.historia.image_update,
                            "textomensaje": $scope.historia.textomensaje,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.historia.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonHistoria/', 'PUT', {
                            "image": $scope.historia.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Acordeon_historiaUpdate/' + $scope.historia.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.historia.textomensaje,
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

        ///Mision y Vision
        contenidoFactory.ServiceContenido('manager/Acordeon_mision/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.myv = data.data[0];
                $scope.insertmyv = true;
            }
        });

        contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.mision_img = data.data;
            }
        });

        contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'GET', '{}').then(function (data) {
            //console.log(data.data);
            if (data.data != "") {
                $scope.vision_img = data.data;
            }
        });


        $scope.setMision = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.mision.image = event.target.result;
                $scope.image_tesMision = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.setVision = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.vision.image = event.target.result;
                $scope.image_tesVision = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarmision = function (ev) {
            if ($scope.mision.image == "" || $scope.myv.tiutlo_mision != "" || $scope.myv.mision != "" || $scope.myv.tiutlo_vision || $scope.myv.vision) {
                if ($scope.insertmyv == false) {

                    $scope.userExtencion = $scope.mision.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonMision/', 'PUT', {
                        "image": $scope.mision.image.split(',')[1],
                        "extension": $scope.tipoimg,
                        "filename": guid()

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'POST', {

                            "image": data.data.image + '.' + data.data.extension,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Acordeon_mision/', 'POST', {

                                "tiutlo_mision": $scope.myv.tiutlo_mision,
                                "mision": $scope.myv.mision,
                                "tiutlo_vision": $scope.myv.tiutlo_vision,
                                "vision": $scope.myv.vision,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'GET', '{}').then(function (data) {
                                    //console.log(data.data);
                                    if (data.data != "") {
                                        $scope.mision_img = data.data;
                                    }
                                });
                                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                            });
                        });

                    });

                }
                else {
                    if ($scope.image_tesMision == "") {
                        contenidoFactory.ServiceContenido('manager/Acordeon_misionUpdate/' + $scope.myv.id + '/', 'PUT', {

                            "tiutlo_mision": $scope.myv.tiutlo_mision,
                            "mision": $scope.myv.mision,
                            "tiutlo_vision": $scope.myv.tiutlo_vision,
                            "vision": $scope.myv.vision,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.mision.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonMision/', 'PUT', {
                            "image": $scope.mision.image.split(',')[1],
                            "extension": $scope.tipoimg,
                            "filename": guid()

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'POST', {

                                "image": data.data.image + '.' + data.data.extension,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                contenidoFactory.ServiceContenido('manager/Acordeon_misionUpdate/' + $scope.myv.id + '/', 'PUT', {

                                    "tiutlo_mision": $scope.myv.tiutlo_mision,
                                    "mision": $scope.myv.mision,
                                    "tiutlo_vision": $scope.myv.tiutlo_vision,
                                    "vision": $scope.myv.vision,
                                    "status": true,
                                    "created_by": $window.localStorage.userid

                                }).then(function (data) {
                                    //console.log(data);
                                    contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'GET', '{}').then(function (data) {
                                        //console.log(data.data);
                                        if (data.data != "") {
                                            $scope.mision_img = data.data;
                                        }
                                    });
                                    contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                                });
                            });

                        });
                    }
                    
                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        $scope.guardarvision = function (ev) {
            if ($scope.vision.image == "" || $scope.myv.tiutlo_mision != "" || $scope.myv.mision != "" || $scope.myv.tiutlo_vision || $scope.myv.vision) {
                if ($scope.insertmyv == false) {

                    $scope.userExtencion = $scope.vision.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonVision/', 'PUT', {
                        "image": $scope.vision.image.split(',')[1],
                        "extension": $scope.tipoimg,
                        "filename": guid()

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'POST', {

                            "image": data.data.image + '.' + data.data.extension,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/Acordeon_mision/', 'POST', {

                                "tiutlo_mision": $scope.myv.tiutlo_mision,
                                "mision": $scope.myv.mision,
                                "tiutlo_vision": $scope.myv.tiutlo_vision,
                                "vision": $scope.myv.vision,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'GET', '{}').then(function (data) {
                                    //console.log(data.data);
                                    if (data.data != "") {
                                        $scope.mision_img = data.data;
                                    }
                                });
                                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                            });
                        });

                    });

                }
                else {
                    if ($scope.image_tesVision == "") {
                        contenidoFactory.ServiceContenido('manager/Acordeon_misionUpdate/' + $scope.myv.id + '/', 'PUT', {

                            "tiutlo_mision": $scope.myv.tiutlo_mision,
                            "mision": $scope.myv.mision,
                            "tiutlo_vision": $scope.myv.tiutlo_vision,
                            "vision": $scope.myv.vision,
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.vision.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonVision/', 'PUT', {
                            "image": $scope.vision.image.split(',')[1],
                            "extension": $scope.tipoimg,
                            "filename": guid()

                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'POST', {

                                "image": data.data.image + '.' + data.data.extension,
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                contenidoFactory.ServiceContenido('manager/Acordeon_misionUpdate/' + $scope.myv.id + '/', 'PUT', {

                                    "tiutlo_mision": $scope.myv.tiutlo_mision,
                                    "mision": $scope.myv.mision,
                                    "tiutlo_vision": $scope.myv.tiutlo_vision,
                                    "vision": $scope.myv.vision,
                                    "status": true,
                                    "created_by": $window.localStorage.userid

                                }).then(function (data) {
                                    //console.log(data);
                                    contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'GET', '{}').then(function (data) {
                                        //console.log(data.data);
                                        if (data.data != "") {
                                            $scope.vision_img = data.data;
                                        }
                                    });
                                    contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                                });
                            });

                        });
                    }

                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        $scope.borrarmision = function (id, ev) {
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
                contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagenUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('manager/Acordeon_mision_imagen/', 'GET', '{}').then(function (data) {
                        //console.log(data.data);
                        if (data.data != "") {
                            $scope.mision_img = data.data;
                        }
                    });
                });
            });
        }

        $scope.borrarvision = function (id, ev) {
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
                contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagenUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('manager/Acordeon_vision_imagen/', 'GET', '{}').then(function (data) {
                        //console.log(data.data);
                        if (data.data != "") {
                            $scope.vision_img = data.data;
                        }
                    });
                });
            });
        }

        //Valores
        
        contenidoFactory.ServiceContenido('manager/Acordeon_valores/', 'GET', '{}').then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.valores_img = data.data;
            }
        });
        //console.log($scope.valores_img);
        $scope.setValores = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.valores.image = event.target.result;
                //$scope.image_tesVision = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarValores = function (ev) {
            if ($scope.valores.image != "") {

                $scope.userExtencion = $scope.valores.image.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('manager/SubirImagenAcordeonValores/', 'PUT', {
                    "image": $scope.valores.image.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {
                    contenidoFactory.ServiceContenido('manager/Acordeon_valores/', 'POST', {
                        "image": data.data.image + '.' + data.data.extension,
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                                                
                        contenidoFactory.ServiceContenido('manager/Acordeon_valores/', 'GET', '{}').then(function (data) {
                            //console.log(data.data);
                            if (data.data != "") {
                                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                                $scope.valores_img = data.data;
                            }
                        });
                    });
                });
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        $scope.borrarvalores = function (id, ev) {
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
                contenidoFactory.ServiceContenido('manager/Acordeon_valoresUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('manager/Acordeon_valores/', 'GET', '{}').then(function (data) {
                        //console.log(data.data);
                        if (data.data != "") {
                            $scope.valores_img = data.data;
                        }
                    });
                });
            });
        }
    }]);

