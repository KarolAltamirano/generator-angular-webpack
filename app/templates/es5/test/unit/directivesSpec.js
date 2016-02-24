/* globals inject */

'use strict';

describe('Directives', function () {

    var $compile,
        $rootScope;

    // beforeEach(angular.mock.module('mDirectives'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Placeholder', function () {
        var scope = $rootScope.$new(),
            element;

        scope.variable = 'Hello World';
        element = $compile('<div ng-bind="variable"></div>')(scope);
        scope.$digest();

        expect(element.html()).toContain('Hello World');
    });

});
