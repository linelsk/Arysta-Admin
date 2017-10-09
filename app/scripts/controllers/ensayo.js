'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('EnsayoCrtl', ['contenidoFactory', '$scope', 'API_PATH_MEDIA', '$mdDialog', function (contenidoFactory, $scope, API_PATH_MEDIA, $mdDialog) {

        $scope.pais = [{}];
        $scope.nuevo = false;
        $scope.id_ensayo = "";
        $scope.ensayo = [{}];
        $scope.label_pais = [{}];
        $scope.ids_pais = [];
        $scope.ids_cultivo = [];
        $scope.ids_producto = [];
        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.selectedclients = [];
        $scope.selectedclientscultivo = [];
        $scope.selectedclientsproducto = [];
        $scope.image_source_temp = "";

        contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'GET', {

        }).then(function (data) {

            $scope.ensayo = data.data;
        });

        $scope.nuevopais = function () {
            $scope.nuevo = true;
            $scope.pais = [{}];
            $scope.nuevoboton = true;
        }

        function removeItemFromArr(arr, item) {
            var i = arr.indexOf(item);
            arr.splice(i, 1);
        }

        $scope.editarensayo = function (id) {
            $scope.id_ensayo = id;
            $scope.nuevo = true;
            $scope.nuevoboton = false;
            $scope.selectedclients = [];
            $scope.selectedclientscultivo = [];
            $scope.selectedclientsproducto = [];

            contenidoFactory.ServiceContenido('catalogos/EnsayoUpdate/' + id + '/', 'GET', {

            }).then(function (result) {
                console.log(result.data);
                $scope.ensayo = result.data;
                $scope.image_source = API_PATH_MEDIA + '/' + result.data.file;
                contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {}).then(function (data) {
                    //
                    //$scope.get_pais = data.data;
                    for (var j = 0; j < data.data.length; j++) {
                        for (var i = 0; i < result.data.pais.length; i++) {
                            if (result.data.pais[i] == data.data[j].id) {

                                removeItemFromArr($scope.get_pais, data.data[j].nombre_ar);
                                $scope.selectedclients.push(
                                    {
                                        id: data.data[j].id,
                                        nombre_ar: data.data[j].nombre_ar
                                    }
                                );
                            }
                            //if (result.data.pais[i] != data.data[j].id) {
                            //    console.log(data.data[j].nombre_ar);
                            //}
                        }
                    }
                });

                contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {}).then(function (data) {

                    //$scope.get_cultivo = data.data;
                    for (var j = 0; j < data.data.length; j++) {
                        for (var i = 0; i < result.data.cultivo.length; i++) {
                            if (result.data.cultivo[i] == data.data[j].id) {

                                removeItemFromArr($scope.get_cultivo, data.data[j].nombre_ar);
                                $scope.selectedclientscultivo.push(
                                    {
                                        id: data.data[j].id,
                                        nombre_ar: data.data[j].nombre_ar
                                    }
                                );
                            }
                            //if (result.data.pais[i] != data.data[j].id) {
                            //    console.log(data.data[j].nombre_ar);
                            //}
                        }
                    }
                });

                for (var j = 0; j < result.data.producto.length; j++) {
                    
                    for (var i = 0; i < $scope.get_producto.length; i++) {
                        //console.log(result.data.producto[j] + "=" + $scope.get_producto[i].id + "iteracion-i:" + i + "iteracion-j:" + j);
                        if (result.data.producto[j] == $scope.get_producto[i].id) {
                            
                            $scope.selectedclientsproducto.push(
                                {
                                    id: $scope.get_producto[i].id,
                                    nombre: $scope.get_producto[i].nombre
                                }
                            );

                            $scope.get_producto.splice(i, 1);
                        }
                    }
                }

            });
        }

        $scope.eliminarensayo = function (ev, id) {
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
                contenidoFactory.ServiceContenido('catalogos/EnsayoUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'GET', {}).then(function (data) {

                        $scope.ensayo = data.data;
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

        //Catalogos
        contenidoFactory.ServiceContenido('catalogos/Pais/', 'GET', {
        }).then(function (data) {

            $scope.get_pais = data.data;
        });

        contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {
        }).then(function (data) {
            console.log(data);
            $scope.get_cultivo = data.data;
        });

        contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {
        }).then(function (data) {
            console.log(data);
            $scope.get_producto = data.data;
        });

        $scope.moveItem = function (item, from, to) {
            //console.log(item);
            $scope.ids_pais.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
        };

        $scope.moveItemcultivos = function (item, from, to) {

            $scope.ids_cultivo.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
            console.log($scope.ids_cultivo);
        };

        $scope.moveItemproductos = function (item, from, to) {
            //console.log("OK");
            $scope.ids_producto.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
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

        $scope.gurdarEnsayo = function (ev) {
            //console.log($scope.image_source);
            if ($scope.image_source == undefined) {
                contenidoFactory.mensaje(ev, "Falta archivo del ensayo");
            }
            else {
                console.log($scope.image_source);
                $scope.userExtencion = $scope.image_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                //if ($scope.tipoimg == "msword") {
                //    $scope.tipoimg = "docx";                //}

                contenidoFactory.ServiceContenido('catalogos/FileEnsayo/', 'PUT', {
                    "file": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {
                    console.log(data);
                    contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'POST', {
                        "file": data.data.file + '.' + data.data.extension,
                        "codigo": $scope.ensayo.codigo,
                        "nombre": $scope.ensayo.nombre,
                        "pais": $scope.ids_pais,
                        "cultivo": $scope.ids_cultivo,
                        "producto": $scope.ids_producto,
                        "created_by": 1

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'GET', {

                        }).then(function (data) {

                            $scope.ensayo = data.data;
                        });
                    });
                });
            }
        }

        $scope.editEnsayo = function (ev) {
            if ($scope.image_source_temp == "") {
                //console.log($scope.selectedclients);
                //console.log($scope.selectedclientscultivo);
                $scope.ids_pais = [];
                $scope.ids_cultivo = [];
                $scope.ids_producto = [];
                for (var i = 0; i < $scope.selectedclients.length; i++) {
                    $scope.ids_pais.push($scope.selectedclients[i].id);
                }

                for (var i = 0; i < $scope.selectedclientscultivo.length; i++) {
                    $scope.ids_cultivo.push($scope.selectedclientscultivo[i].id);
                }
                for (var i = 0; i < $scope.selectedclientsproducto.length; i++) {
                    $scope.ids_producto.push($scope.selectedclientsproducto[i].id);
                }
                
                contenidoFactory.ServiceContenido('catalogos/EnsayoUpdate/' + $scope.id_ensayo + '/', 'GET', {}).then(function (data) {
                    contenidoFactory.ServiceContenido('catalogos/EnsayoUpdate/' + $scope.id_ensayo + '/', 'PUT', {
                        "file": data.data.image,
                        "codigo": $scope.ensayo.codigo,
                        "nombre": $scope.ensayo.nombre,
                        "pais": $scope.ids_pais,
                        "cultivo": $scope.ids_cultivo,
                        "producto": $scope.ids_producto,
                        "created_by": 1

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'GET', {

                        }).then(function (data) {

                            $scope.ensayo = data.data;
                            //$scope.get_pais = $scope.get_pais;
                        });
                    });
                });
            }
            else {
                $scope.userExtencion = $scope.image_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('catalogos/FileEnsayo/', 'PUT', {
                    "file": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {

                    contenidoFactory.ServiceContenido('catalogos/EnsayoUpdate/' + $scope.id_ensayo + '/', 'PUT', {
                        "file": data.data.file + '.' + data.data.extension,
                        "codigo": $scope.ensayo.codigo,
                        "nombre": $scope.ensayo.nombre,
                        "pais": $scope.ids_pais,
                        "cultivo": $scope.ids_cultivo,
                        "producto": $scope.ids_producto,
                        "created_by": 1

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                        $scope.nuevo = false;
                        contenidoFactory.ServiceContenido('catalogos/Ensayo/', 'GET', {

                        }).then(function (data) {

                            $scope.ensayo = data.data;
                        });
                    });
                });
            }
        }

        $scope.regresar = function () {
            $scope.nuevo = false;
        }
    }]);


