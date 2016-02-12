'use strict';

require('./_mCtrls');

var mCtrls = require('./_mCtrls'),
    debug = require('debug'),
    log = debug('Ctrls'),
    loader = require('../../utilities/loader');

mCtrls.controller('RootCtrl', function ($scope) {
    log('test');
    $scope.test = 'test';
    console.log(loader.getLoader('main').getResult('app-data'));
});
