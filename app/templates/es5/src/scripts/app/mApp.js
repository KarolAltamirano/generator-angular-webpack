'use strict';

var angular = require('angular'),
    ngTouch = require('angular-touch'),
    ngSanitize = require('angular-sanitize'),
    uiRouter = require('angular-ui-router'),
    mAnimations = require('./animations/_loader'),
    mCtrls = require('./controllers/_loader');
/*
    mDirectives = require('./directives/_loader'),
    mServices = require('./services/_loader');
*/
<% if (pixijs) { %>
var Canvas = require('../canvas/Canvas');
<% } %>
/**
 * Register main angular app
 */
angular.module('mApp', [ngTouch, ngSanitize, uiRouter, mAnimations, mCtrls])
    .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
        'ngInject';

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
