'use strict';

var mDirectives = require('./_mDirectives');

mDirectives.directive('mdTemplateDirective', function () {
    return {
        restrict: 'AEC',
        template: '',
        link: function (scope, element) {
            element;
        }
    };
});
