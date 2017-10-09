'use strict';

/**
 * @ngdoc function
 * @name adminSomeonesomewhereApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the adminSomeonesomewhereApp
 */
angular.module('spraytec-admin')
    .controller('DetalleCtrl', ['contenidoFactory', '$scope', '$stateParams', 'API_PATH_MEDIA', '$window', '$mdDialog', function (contenidoFactory, $scope, $stateParams, API_PATH_MEDIA, $window, $mdDialog) {

        $scope.image = [{}];
        $scope.API_PATH_MEDIA = API_PATH_MEDIA;

        contenidoFactory.ServiceContenido('manager/SliderUpdate/' + $stateParams.id + '/', 'GET', '{}').then(function (data) {
            console.log(data.data.image);
            $scope.image = data.data.image;
            $scope.slider = data.data;
            $scope.slider.image = API_PATH_MEDIA + data.data.image;            
        });

        $scope.setFileslider = function (element) {
            $scope.currentFile = element.files[0];
            
            var reader = new FileReader();

            reader.onload = function (event) {
                $scope.image_source_slider = event.target.result;
                $scope.slider.image = event.target.result;
                //console.log($scope.image_source);
                $scope.$apply();
            }
            // when the file is read it triggers the onload event above.
            reader.readAsDataURL(element.files[0]);
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

        $scope.uploadImageslider = function (ev) {
            //console.log($scope.image_source_carrousel);

            if ($scope.image_source_slider == undefined) {
                console.log($scope.image);
                contenidoFactory.ServiceContenido('manager/SliderUpdate/' + $stateParams.id + '/', 'PUT', {

                    "image": $scope.image,
                    "textomensaje": $scope.slider.textomensaje,
                    "mensaje_boton": $scope.slider.mensaje_boton,
                    "status": true,
                    "created_by": $window.localStorage.userid

                }).then(function (data) {
                    //console.log(data);
                    contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");

                });

            }
            else {
                $scope.userExtencion = $scope.image_source_slider.split(',');
                $scope.tipoimg = $scope.userExtencion[0].split('/')[1].split(';')[0];

                contenidoFactory.ServiceContenido('manager/SubirImagenSlider/', 'PUT', {
                    "image": $scope.image_source_slider.split(',')[1],
                    "extension": $scope.tipoimg,
                    "filename": guid()

                }).then(function (data) {
                    contenidoFactory.ServiceContenido('manager/SliderUpdate/' + $stateParams.id + '/', 'PUT', {
                        "image": data.data.image + '.' + data.data.extension,
                        "textomensaje": $scope.slider.textomensaje,
                        "mensaje_boton": $scope.slider.mensaje_boton,
                        "status": true,
                        "created_by": $window.localStorage.userid

                    }).then(function (data) {
                        console.log(data);
                        contenidoFactory.mensaje(ev, "Resgistro actualizado correctamente");
                        //contenidoFactory.ServiceContenido('manager/SliderUpdate/' + $stateParams.id + '/', 'GET', '{}').then(function (data) {

                        //    $scope.slider.image = data.data.image
                        //    //console.log($scope.image);
                        //});
                    });
                });
            }
        };

        $scope.deleteImageslider = function (ev) {

            contenidoFactory.ServiceContenido('manager/SliderUpdate/' + $stateParams.id + '/', 'DELETE', {
            }).then(function (data) {
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
                    $window.location.href = "home";
                });

                //contenidoFactory.mensaje(ev, "Resgistro borrado correctamente");
            });
        };
    }]);