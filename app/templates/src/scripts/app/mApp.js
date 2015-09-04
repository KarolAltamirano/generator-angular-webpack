'use strict';

require('./animations/_loader');
require('./controllers/_loader');
require('./directives/_loader');
require('./services/_loader');<% if (pixijs) { %>

var Canvas = require('../canvas/Canvas');<% } %>

/* register main app */
angular.module('mApp', ['ngTouch', 'ngSanitize', 'ui.router', 'mAnimations', 'mCtrls'])
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'tpls/views/home.html',
                controller: 'MyCtrl'
            })
            .state('page1', {
                url: '/page1',
                templateUrl: 'tpls/views/page1.html',
                controller: 'MyCtrl'
            })
            .state('page1.detail', {
                url: '/detail',
                templateUrl: 'tpls/views/detail.html',
                controller: 'DetailCtrl'
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    })<% if (pixijs) { %>
    .run(function () {
        new Canvas('canvas-elem');
    });<% } else { %>;<% } %>
