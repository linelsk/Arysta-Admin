'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('EnsayoCrtl', ['contenidoFactory', '$scope', 'API_PATH_MEDIA', '$mdDialog', '$window', function (contenidoFactory, $scope, API_PATH_MEDIA, $mdDialog, $window) {

        $scope.pais = [{}];
        $scope.nuevo = false;
        $scope.id_producto = "";
        $scope.cultivo = [{}];
        $scope.label_pais = [{}];
        $scope.ids_categoria = [];
        $scope.ids_cultivo = [];
        $scope.ids_subcategoria = [];
        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.selectedclients = [];
        $scope.selectedclientscategoria = [];
        $scope.selectedclientssubcategoria = [];
        $scope.image_source_temp = "";
        $scope.image_source_temp_hoja = "";
        $scope.image_source_temp_folleto = "";
        $scope.hoja = "";
        $scope.folleto = "";

        $scope.image_source_hoja = "";
        $scope.image_source_folleto = "";
        $scope.image_source_etiqueta = "";
        $scope.image_testSliderProducto = "";
        $scope.insertSliderPronutiva = false;
        $scope.Isview = true;
        $scope.Ishoja = true;
        $scope.Isficha = true;
        $scope.image_titulo_temp = "";
        $scope.image_slider_temp = "";

        $scope.slider_pronutiva = {
            "image": "",
            "textomensaje": "",
            "texto_contenido": ""
        };

        //Slider Productos
        contenidoFactory.ServiceContenido('manager/Pronutiva/', 'GET', {}).then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.insertSliderPronutiva = true;
                $scope.slider_pronutiva.image_update = data.data[0].image;
                $scope.slider_pronutiva.image_update_titulo = data.data[0].image_titulo;
                $scope.slider_pronutiva = data.data[0];
                $scope.slider_pronutiva.image = API_PATH_MEDIA + data.data[0].image;
                $scope.slider_pronutiva.image_titulo = API_PATH_MEDIA + data.data[0].image_titulo;
            }
        });

        $scope.setFilesSliderPronutiva = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.slider_pronutiva.image = event.target.result;
                $scope.image_slider_temp = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.setFilesSliderTituloPronutiva = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.slider_pronutiva.image_titulo = event.target.result;
                $scope.image_titulo_temp = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);

        }
        $scope.guardarsliderpronutiva = function (ev) {
            if ($scope.image_testSliderProducto != "" || $scope.slider_pronutiva.textomensaje != "") {
                if ($scope.insertSliderPronutiva == false) {

                    $scope.userExtencion = $scope.slider_pronutiva.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenSliderPronutiva/', 'PUT', {
                        "image": $scope.slider_pronutiva.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {

                        $scope.userExtencion = $scope.slider_pronutiva.image_titulo.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenTituloPronutiva/', 'PUT', {
                            "image": $scope.slider_pronutiva.image_titulo.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (tituto) {
                            contenidoFactory.ServiceContenido('manager/Pronutiva/', 'POST', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.slider_pronutiva.textomensaje,
                                "image_titulo": tituto.data.image + '.' + tituto.data.extension,
                                "texto_contenido": $scope.slider_pronutiva.texto_contenido,
                                "titulo": "",
                                "status": true,
                                "created_by": $window.localStorage.userid

                            }).then(function (data) {
                                //console.log(data);
                                contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                            });
                        });
                    });
                }
                else {
                    var _slider;
                    var _titulo;

                    if ($scope.image_slider_temp == "") {
                        _slider = $scope.slider_pronutiva.image_update
                    }
                    else {

                        $scope.userExtencion = $scope.image_slider_temp.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenSliderPronutiva/', 'PUT', {
                            "image": $scope.image_slider_temp.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {

                        });
                    }

                    if ($scope.image_titulo_temp == "") {
                        _titulo = $scope.slider_pronutiva.image_update_titulo
                    }
                    else {

                        $scope.userExtencion = $scope.image_titulo_temp.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenTituloPronutiva/', 'PUT', {
                            "image": $scope.image_titulo_temp.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {

                        });
                    }

                    contenidoFactory.ServiceContenido('manager/PronutivaUpdate/' + $scope.slider_pronutiva.id + '/', 'PUT', {
                        "image": _slider,
                        "textomensaje": $scope.slider_pronutiva.textomensaje,
                        "image_titulo": _titulo,
                        "texto_contenido": $scope.slider_pronutiva.texto_contenido,
                        "titulo": "",
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                    });
                }
            }
            else {
                contenidoFactory.mensaje(ev, "Por lo menos un campo de texto debe ser llenado");
            }
        }

        //Productos Catalogo
        contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
            console.log(data.data);
            $scope.cultivo = data.data;
        });

        $scope.nuevopais = function () {
            $scope.nuevo = true;
            $scope.cultivo = {};
            $scope.nuevoboton = true;
            $scope.get_Cultivo = {};
            $scope.get_categoria = {};
            $scope.get_subcategoria = {};
            $scope.selectedclients = [];
            $scope.selectedclientscategoria = [];
            $scope.selectedclientssubcategoria = [];
            $scope.image_source = "";
            $scope.image_source_etiqueta = "";
            $scope.image_source_hoja = "";
            $scope.image_source_folleto = "";
        }

        function removeItemFromArr(arr, item) {
            var i = arr.indexOf(item);
            arr.splice(i, 1);

            //return arr;
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

        $scope.editarcultivo = function (id) {
            $scope.nuevo = true;
            $scope.nuevoboton = false;

            contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + id + '/', 'GET', {

            }).then(function (result) {
                $scope.cultivo = result.data;
                $scope.image_source = API_PATH_MEDIA + '/' + result.data.image;
            });
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

        $scope.gurdarcultivo = function (ev) {
            //console.log(guid());
            if ($scope.image_source == undefined) {
                contenidoFactory.mensaje(ev, "Falta imagen de cultivo");
            }
            else {
                $scope.userExtencion = $scope.image_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('catalogos/SubirImagenCultivo/', 'PUT', {
                    "image": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'POST', {
                        "image": data.data.image + '.' + data.data.extension,
                        "nombre": $scope.cultivo.nombre,
                        "definicion": $scope.cultivo.definicion,
                        "registro": $scope.cultivo.registro,
                        "cultivo": $scope.cultivo.cultivo,
                        "created_by": $window.localStorage.userid,

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
                            $scope.cultivo = data.data;
                        });
                    });
                });
            }
        }

        $scope.editcultivo = function (ev) {
            if ($scope.image_source_temp == "") {

                contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + $scope.cultivo.id + '/', 'PUT', {
                    "image": $scope.cultivo.image,
                    "nombre": $scope.cultivo.nombre,
                    "definicion": $scope.cultivo.definicion,
                    "registro": $scope.cultivo.registro,
                    "cultivo": $scope.cultivo.cultivo,
                    "created_by": $window.localStorage.userid

                }).then(function (data) {
                    console.log(data);
                    contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                    $scope.nuevo = false;
                    contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {

                    }).then(function (data) {
                        $scope.cultivo = data.data;
                    });
                });
            }
            else {
                $scope.userExtencion = $scope.image_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('catalogos/SubirImagenCultivo/', 'PUT', {
                    "image": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('catalogos/CultivoUpdate/' + $scope.cultivo.id + '/', 'PUT', {
                        "image": data.data.image + '.' + data.data.extension,
                        "nombre": $scope.cultivo.nombre,
                        "definicion": $scope.cultivo.definicion,
                        "registro": $scope.cultivo.registro,
                        "cultivo": $scope.cultivo.cultivo,
                        "created_by": $window.localStorage.userid,

                    }).then(function (result) {
                        console.log(result);
                        contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {
                            $scope.cultivo = result.data;
                        });
                    });
                });
            }
        }    

        $scope.regresar = function () {
            $scope.nuevo = false;
            contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {

            }).then(function (data) {
                //console.log(data.data);
                $scope.cultivo = data.data;
                //$scope.get_pais = $scope.get_pais;
            });
        }
    }]);


