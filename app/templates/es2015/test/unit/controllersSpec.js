/* globals inject */

import angular from 'angular';
import mCtrls from '../../src/scripts/app/controllers/_loader';
import loader from '../../src/scripts/utilities/loader';

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
