'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('ProductoCtrl', ['$scope', 'contenidoFactory', 'API_PATH_MEDIA', '$mdDialog', '$window', function ($scope, contenidoFactory, API_PATH_MEDIA, $mdDialog, $window) {
        $scope.pais = [{}];
        $scope.nuevo = false;
        $scope.id_producto = "";
        $scope.producto = [{}];
        $scope.label_pais = [{}];
        $scope.ids_categoria = [];
        $scope.ids_cultivo = [];
        $scope.ids_subcategoria = [];
        $scope.API_PATH_MEDIA = API_PATH_MEDIA;
        $scope.selectedclients = [];
        $scope.selectedclientscategoria = [];
        $scope.selectedclientssubcategoria = [];
        $scope.image_source_temp = "";
        $scope.image_source_temp_etiqueta = "";
        $scope.image_source_temp_hoja = "";
        $scope.image_source_temp_folleto = "";
        $scope.hoja = "";
        $scope.folleto = "";

        $scope.image_source_hoja = "";
        $scope.image_source_folleto = "";
        $scope.image_source_etiqueta = "";
        $scope.image_testSliderProducto = "";
        $scope.insertSliderProducto = false;
        $scope.Isview = true;
        $scope.Ishoja = true;
        $scope.Isficha = true;

        $scope.slider_productos = {
            "image": "",
            "textomensaje": ""
        };

        //Slider Productos
        contenidoFactory.ServiceContenido('manager/Productos/', 'GET', {}).then(function (data) {
            console.log(data.data);
            if (data.data != "") {
                $scope.insertSliderProducto = true;
                $scope.slider_productos.image_update = data.data[0].image;
                $scope.slider_productos = data.data[0];
                $scope.slider_productos.image = API_PATH_MEDIA + data.data[0].image;
            }
        });

        $scope.setFilesSliderProductos = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.slider_productos.image = event.target.result;
                $scope.image_testSliderProducto = event.target.result;

                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.guardarsliderproductos = function (ev) {
            if ($scope.image_testSliderProducto != "" || $scope.slider_productos.textomensaje != "") {
                if ($scope.insertSliderProducto == false) {

                    $scope.userExtencion = $scope.slider_productos.image.split(',');
                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                    contenidoFactory.ServiceContenido('manager/SubirImagenSliderProducto/', 'PUT', {
                        "image": $scope.slider_productos.image.split(',')[1],
                        "extension": $scope.tipoimg

                    }).then(function (data) {
                        contenidoFactory.ServiceContenido('manager/Productos/', 'POST', {
                            "image": data.data.image + '.' + data.data.extension,
                            "textomensaje": $scope.slider_productos.textomensaje,
                            "titulo": "",
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            //console.log(data);
                            contenidoFactory.mensaje(ev, "Resgistro dado de alta correctamente");
                        });
                    });
                }
                else {
                    if ($scope.image_testSliderProducto == "") {
                        contenidoFactory.ServiceContenido('manager/ProductosUpdate/' + $scope.slider_productos.id + '/', 'PUT', {

                            "image": $scope.slider_productos.image_update,
                            "textomensaje": $scope.slider_productos.textomensaje,
                            "titulo": "",
                            "status": true,
                            "created_by": $window.localStorage.userid

                        }).then(function (data) {
                            contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                        });
                    }
                    else {
                        $scope.userExtencion = $scope.slider_productos.image.split(',');
                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                        contenidoFactory.ServiceContenido('manager/SubirImagenSliderProducto/', 'PUT', {
                            "image": $scope.slider_productos.image.split(',')[1],
                            "extension": $scope.tipoimg

                        }).then(function (data) {
                            contenidoFactory.ServiceContenido('manager/ProductosUpdate/' + $scope.slider_productos.id + '/', 'PUT', {
                                "image": data.data.image + '.' + data.data.extension,
                                "textomensaje": $scope.slider_productos.textomensaje,
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

        //Productos Catalogo
        contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {}).then(function (data) {
            console.log(data.data);
            $scope.producto = data.data;
        });

        $scope.nuevopais = function () {
            //Catalogos
            contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {
            }).then(function (data) {
                $scope.get_Cultivo = data.data;
            });

            contenidoFactory.ServiceContenido('catalogos/Categoria/', 'GET', {
            }).then(function (data) {
                $scope.get_categoria = data.data;
            });

            contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'GET', {
            }).then(function (data) {
                $scope.get_subcategoria = data.data;
            });

            $scope.nuevo = true;
            $scope.producto = {};
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

        $scope.eliminarproducto = function (ev, id) {
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
                contenidoFactory.ServiceContenido('catalogos/ProductoUpdate/' + id + '/', 'DELETE', {

                }).then(function (data) {
                    console.log(data.data);
                    contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {}).then(function (data) {
                        console.log(data.data);
                        $scope.producto = data.data;
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

        $scope.setFileEtiqueta = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source_etiqueta = event.target.result;
                $scope.image_source_temp_etiqueta = event.target.result;
                $scope.Isview = true;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.setFileHoja = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source_hoja = event.target.result;
                $scope.image_source_temp_hoja = event.target.result;
                $scope.Ishoja = true;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.setFileFicha = function (element) {
            $scope.currentFile = element.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source_folleto = event.target.result;
                $scope.image_source_temp_folleto = event.target.result;
                $scope.Isficha = true;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
        }

        $scope.moveItemcultivos = function (item, from, to) {
            //console.log(item);
            //$scope.ids_cultivo.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
            //console.log($scope.ids_cultivo);
        };

        $scope.moveItemcategoria = function (item, from, to) {
            //console.log(item);
            //$scope.ids_categoria.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
            //console.log($scope.ids_cultivo);
        };

        $scope.moveItemsubcategoria = function (item, from, to) {
            //console.log(item);
            //$scope.ids_subcategoria.push(item.id)
            var idx = from.indexOf(item);
            if (idx != -1) {
                from.splice(idx, 1);
                to.push(item);
            }
            //console.log($scope.ids_cultivo);
        };

        $scope.editarproducto = function (id) {
            $scope.id_producto = id;
            $scope.nuevo = true;
            $scope.nuevoboton = false;
            $scope.selectedclients = [];
            $scope.selectedclientscultivo = [];

            contenidoFactory.ServiceContenido('catalogos/Cultivo/', 'GET', {
            }).then(function (data) {
                $scope.get_Cultivo = data.data;
            });

            contenidoFactory.ServiceContenido('catalogos/Categoria/', 'GET', {
            }).then(function (data) {
                $scope.get_categoria = data.data;
            });

            contenidoFactory.ServiceContenido('catalogos/SubCategoria/', 'GET', {
            }).then(function (data) {
                $scope.get_subcategoria = data.data;
            });

            contenidoFactory.ServiceContenido('catalogos/ProductoUpdate/' + id + '/', 'GET', {

            }).then(function (result) {
                //console.log(result.data);
                $scope.producto = result.data;
                $scope.image_source = API_PATH_MEDIA + '/' + result.data.image;
                $scope.image_source_hoja = API_PATH_MEDIA + '/' + result.data.hojaseguridad;
                $scope.image_source_etiqueta = API_PATH_MEDIA + '/' + result.data.etiqueta;
                $scope.image_source_folleto = API_PATH_MEDIA + '/' + result.data.folletoproducto;
                $scope.Isview = false;
                $scope.Ishoja = false;
                $scope.Isficha = false;

                //for (var z = 0; z < $scope.producto.cultivos.length; z++) {
                //    console.log($scope.producto.cultivos);
                //    $scope.ids_cultivo.push($scope.producto.cultivos[z]);
                //}

                for (var i = 0; i < $scope.get_Cultivo.length; i++) {
                    for (var j = 0; j < result.data.cultivos.length; j++) {
                        if ($scope.get_Cultivo[i].id == result.data.cultivos[j]) {
                            $scope.selectedclients.push(
                                {
                                    id: $scope.get_Cultivo[i].id,
                                    cultivo: $scope.get_Cultivo[i].cultivo
                                }
                            );
                            $scope.get_Cultivo.splice(i, 1);
                            break;
                        }
                    }
                }

                for (var i = 0; i < $scope.get_categoria.length; i++) {
                    for (var j = 0; j < result.data.categoria.length; j++) {
                        if ($scope.get_categoria[i].id == result.data.categoria[j]) {
                            $scope.selectedclientscategoria.push(
                                {
                                    id: $scope.get_categoria[i].id,
                                    nombre: $scope.get_categoria[i].nombre
                                }
                            );
                            $scope.get_categoria.splice(i, 1);
                            break;
                        }
                    }
                }

                for (var i = 0; i < $scope.get_subcategoria.length; i++) {
                    for (var j = 0; j < result.data.subcategoria.length; j++) {
                        if ($scope.get_subcategoria[i].id == result.data.subcategoria[j]) {
                            $scope.selectedclientssubcategoria.push(
                                {
                                    id: $scope.get_subcategoria[i].id,
                                    nombre: $scope.get_subcategoria[i].nombre
                                }
                            );
                            $scope.get_subcategoria.splice(i, 1);
                            break;
                        }
                    }
                }
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

        $scope.gurdarProducto = function (ev) {

            for (var z = 0; z < $scope.selectedclients.length; z++) {
                $scope.ids_cultivo.push($scope.selectedclients[z].id);
            }

            for (var z = 0; z < $scope.selectedclientscategoria.length; z++) {
                $scope.ids_categoria.push($scope.selectedclientscategoria[z].id);
            }

            for (var z = 0; z < $scope.selectedclientssubcategoria.length; z++) {
                $scope.ids_subcategoria.push($scope.selectedclientssubcategoria[z].id);
            }

            if ($scope.image_source == undefined) {
                contenidoFactory.mensaje(ev, "Falta imagen del producto");
            }
            else {
                if ($scope.image_source_etiqueta == "") {
                    contenidoFactory.mensaje(ev, "Falta etiqueta del producto");
                }
                else {
                    if ($scope.image_source_hoja == "") {
                        contenidoFactory.mensaje(ev, "Falta hoja de seguridad del producto");
                    }
                    else {
                        if ($scope.image_source_folleto == "") {
                            contenidoFactory.mensaje(ev, "Falta ficha tecnica del proyecto")
                        }
                        else {
                            $scope.userExtencion = $scope.image_source.split(',');
                            $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                            contenidoFactory.ServiceContenido('catalogos/SubirImagenProductos/', 'PUT', {
                                "image": $scope.image_source.split(',')[1],
                                "extension": $scope.tipoimg,
                                "filename": guid()

                            }).then(function (data) {//Etiqueta

                                $scope.userExtencion = $scope.image_source_etiqueta.split(',');
                                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                                contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                                    "file": $scope.image_source_etiqueta.split(',')[1],
                                    "extension": $scope.tipoimg,
                                    "filename": guid()

                                }).then(function (etiqueta) { //Hoja

                                    $scope.userExtencion = $scope.image_source_hoja.split(',');
                                    $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                                    contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                                        "file": $scope.image_source_hoja.split(',')[1],
                                        "extension": $scope.tipoimg,
                                        "filename": guid()

                                    }).then(function (hoja) {//Ficha

                                        $scope.userExtencion = $scope.image_source_folleto.split(',');
                                        $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                                        contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                                            "file": $scope.image_source_hoja.split(',')[1],
                                            "extension": $scope.tipoimg,
                                            "filename": guid()

                                        }).then(function (ficha) { //Producto

                                            contenidoFactory.ServiceContenido('catalogos/Producto/', 'POST', {
                                                "image": data.data.image + '.' + data.data.extension,
                                                "nombre": $scope.producto.nombre,
                                                "definicion": $scope.producto.definicion,
                                                "registro": $scope.producto.registro,
                                                "formulacion": $scope.producto.formulacion,
                                                "consentracion": $scope.producto.consentracion,
                                                "ingredientes": $scope.producto.ingredientes,
                                                "cultivos": $scope.ids_cultivo,
                                                "envases": $scope.producto.envases,
                                                "toxitologia": $scope.producto.toxitologia,
                                                "expectro": $scope.producto.expectro,
                                                "categoria": $scope.ids_categoria,
                                                "subcategoria": $scope.ids_subcategoria,
                                                "etiqueta": etiqueta.data.file + '.' + etiqueta.data.extension,
                                                "hoja": hoja.data.file + '.' + hoja.data.extension,
                                                "ficha": ficha.data.file + '.' + ficha.data.extension,
                                                "created_by": $window.localStorage.userid

                                            }).then(function (data) {
                                                console.log(data);
                                                contenidoFactory.mensaje(ev, "Registro agregado correctamente");
                                                $scope.nuevo = false;
                                                contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {}).then(function (data) {
                                                    $scope.producto = data.data;
                                                });
                                            });
                                        });

                                    });

                                });

                            });
                        }
                    }
                }
            }
        }

        $scope.editProducto = function (ev) {

            $scope.ids_cultivo = [];
            $scope.ids_categoria = [];
            $scope.ids_subcategoria = [];
            var _image;
            var _etiqueta;
            var _hoja;
            var _ficha;

            for (var z = 0; z < $scope.selectedclients.length; z++) {
                $scope.ids_cultivo.push($scope.selectedclients[z].id);
            }

            for (var z = 0; z < $scope.selectedclientscategoria.length; z++) {
                $scope.ids_categoria.push($scope.selectedclientscategoria[z].id);
            }

            for (var z = 0; z < $scope.selectedclientssubcategoria.length; z++) {
                $scope.ids_subcategoria.push($scope.selectedclientssubcategoria[z].id);
            }

            if ($scope.image_source_temp == "") {
                $scope._image = $scope.producto.image
            }
            else {
                $scope.userExtencion = $scope.image_source.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                $scope.filename = guid();
                _image = 'productos/' + $scope.filename + '.' + $scope.tipoimg;

                contenidoFactory.ServiceContenido('catalogos/SubirImagenProductos/', 'PUT', {
                    "image": $scope.image_source.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": $scope.filename

                }).then(function (data) {

                });
            }

            if ($scope.image_source_temp_etiqueta == "") {
                _etiqueta = $scope.producto.etiqueta
            }
            else {

                $scope.userExtencion = $scope.image_source_temp_etiqueta.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                $scope.filename = guid()
                _etiqueta = 'achivos_producto/' + $scope.filename + '.' + $scope.tipoimg;

                contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                    "file": $scope.image_source_temp_etiqueta.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": $scope.filename

                }).then(function (data) {

                });
            }

            if ($scope.image_source_temp_hoja == "") {
                _hoja = $scope.producto.hoja
            }
            else {

                $scope.userExtencion = $scope.image_source_temp_hoja.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                $scope.filename = guid()
                _hoja = 'achivos_producto/' + $scope.filename + '.' + $scope.tipoimg;

                contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                    "file": $scope.image_source_temp_hoja.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": $scope.filename

                }).then(function (data) {

                });
            }

            if ($scope.image_source_temp_folleto == "") {
                _ficha = $scope.producto.ficha
            }
            else {

                $scope.userExtencion = $scope.image_source_temp_folleto.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];
                $scope.filename = guid()
                _ficha = 'achivos_producto/' + $scope.filename + '.' + $scope.tipoimg;

                contenidoFactory.ServiceContenido('catalogos/SubirArchivoProductos/', 'PUT', {
                    "file": $scope.image_source_temp_folleto.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": $scope.filename

                }).then(function (data) {

                });
            }

            contenidoFactory.ServiceContenido('catalogos/ProductoUpdate/' + $scope.producto.id + '/', 'PUT', {
                "image": _image,
                "nombre": $scope.producto.nombre,
                "definicion": $scope.producto.definicion,
                "registro": $scope.producto.registro,
                "formulacion": $scope.producto.formulacion,
                "consentracion": $scope.producto.consentracion,
                "ingredientes": $scope.producto.ingredientes,
                "cultivos": $scope.ids_cultivo,
                "envases": $scope.producto.envases,
                "toxitologia": $scope.producto.toxitologia,
                "expectro": $scope.producto.expectro,
                "categoria": $scope.ids_categoria,
                "subcategoria": $scope.ids_subcategoria,
                "etiqueta": _etiqueta,
                "hoja": _hoja,
                "ficha": _ficha,
                "created_by": $window.localStorage.userid

            }).then(function (data) {
                console.log(data);
                contenidoFactory.mensaje(ev, "Registro actualizado correctamente");
                $scope.nuevo = false;
                contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {

                }).then(function (data) {
                    $scope.producto = data.data;
                });
            });
        }

        $scope.regresar = function () {
            $scope.nuevo = false;
            contenidoFactory.ServiceContenido('catalogos/Producto/', 'GET', {

            }).then(function (data) {
                //console.log(data.data);
                $scope.producto = data.data;
                //$scope.get_pais = $scope.get_pais;
            });
        }
    }]);
