import mDirectives from './_mDirectives';

mDirectives.directive('mdTemplateDirective', function () {
    return {
        restrict: 'AEC',
        template: '',
        link: function (scope, element) {
            element;
        }
    };
});
