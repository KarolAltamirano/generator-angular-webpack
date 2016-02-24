/* globals inject */

'use strict';

var angular = require('angular'),
    mCtrls = require('../../src/scripts/app/controllers/_loader'),
    loader = require('../../src/scripts/utilities/loader');

describe('Controllers', function () {

    loader.createSpyLoader('main', 'spy loader data');

    describe('MyCtrl', function () {
        var $scope;

        beforeEach(angular.mock.module(mCtrls));

        beforeEach(inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('MyCtrl', { $scope: $scope });
        }));

        it('Placeholder', function () {
            expect($scope.test).toBe('test');
        });

    });
});
