/* globals inject */

'use strict';

var angular = require('angular'),
    mCtrls = require('../../src/scripts/app/controllers/_loader'),
    loader = require('../../src/scripts/utilities/loader');

require('angular-mocks');

describe('Controllers', function () {

    loader.createSpyLoader('main', 'spy loader data');

    describe('RootCtrl', function () {
        var $scope;

        beforeEach(angular.mock.module(mCtrls));

        beforeEach(inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            $controller('RootCtrl', { $scope: $scope });
        }));

        it('Placeholder', function () {
            expect($scope.test).toBe('test');
        });

    });
});
