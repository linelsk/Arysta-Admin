'use strict';

/**
 * @ngdoc overview
 * @name adminSomeonesomewhereApp
 * @description
 * # adminSomeonesomewhereApp
 *
 * Main module of the application.
 */
angular
    .module('spraytec-admin', [
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'permission',
        'permission.ui',
        'textAngular'
    ])
    .constant('API_PATH', 'http://127.0.0.1:8001/')
    .constant('API_PATH_MEDIA', 'http://127.0.0.1:8001/media/')
    //.constant('API_PATH', 'http://174.138.51.31:8001/')
    //.constant('API_PATH_MEDIA', 'http://174.138.51.31:8001/media/')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $qProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'views/index.html',
                controller: 'IndexCtrl',
                data: {
                    permissions: {
                        only: ['ANONIMO'],
                        redirectTo: '/main'
                    }
                }

            })
            .state('main', {
                url: '/main',
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('acerca', {
                url: '/acerca',
                templateUrl: 'views/acerca.html',
                controller: 'AcercaCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('detalle', {
                url: '/detalle/:id',
                templateUrl: 'views/detalle.html',
                controller: 'DetalleCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('catalogos', {
                url: '/catalogos',
                templateUrl: 'views/catalogos.html',
                controller: 'CatalogosCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('productos', {
                url: '/productos',
                templateUrl: 'views/producto.html',
                controller: 'ProductoCtrl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('ensayo', {
                url: '/ensayo',
                templateUrl: 'views/ensayo.html',
                controller: 'EnsayoCrtl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            })
            .state('contacto', {
                url: '/contacto',
                templateUrl: 'views/contacto.html',
                controller: 'ContactoCrtl',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR'],
                        redirectTo: '/'
                    }
                }
            });


       // $qProvider.errorOnUnhandledRejections(false);
        $locationProvider.html5Mode(true);
    }).
    config(function ($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .run(function ($rootScope, $location, $window, PermRoleStore, contenidoFactory) {
        
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            
            var sesion = contenidoFactory.session();
            console.log(sesion);
            switch (toState.name) {
                case "main":
                    if (!sesion) {
                        $window.location.assign('/');
                    }
                    break;
                case "home":
                    if (!sesion) {
                        $window.location.assign('/');
                    }
                    break;
                case "/":
                    if (sesion) {
                        $window.location.assign('/main');
                    }
                    break;
                default:
                    ""
            }
            //if (toState.name == 'quienessomos' && !sesion) {
            //    $window.location.assign('/#!/main');
            //}
        });

        PermRoleStore.defineManyRoles({
            'ANONIMO': function () {
                if (contenidoFactory.role() == null) {
                    return true;
                }
                return false;
            },
            'ADMINISTRADOR': function () {
                if (contenidoFactory.role() == "ADMINISTRADOR") {
                    return true;
                }
                return false;

            }
        });

    });



