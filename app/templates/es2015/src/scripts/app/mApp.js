import angular from 'angular';
import ngTouch from 'angular-touch';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import mAnimations from './animations/_loader';
import mCtrls from './controllers/_loader';

/*
import mDirectives from './directives/_loader';
import mServices from './services/_loader';
*/
<% if (pixijs) { %>
import Canvas from '../canvas/Canvas';
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
