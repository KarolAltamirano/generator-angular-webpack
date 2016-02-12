'use strict';

require('./_mCtrls');

var log = window.debug('Ctrls'),
    loader = require('../../utilities/loader');

angular.module('mCtrls').controller('RootCtrl', function ($scope) {
    log('test');
    $scope.test = 'test';
    console.log(loader.getLoader('main').getResult('app-data'));
});
