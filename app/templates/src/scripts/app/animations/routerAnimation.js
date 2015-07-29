'use strict';

require('./_mAnimations');

angular.module('mAnimations').animation('.view-change-animate', function () {
    return {
        enter: function (element, done) {
            TweenMax.set(element, { autoAlpha: 0 });
            TweenMax.to(element, 1, { autoAlpha: 1, onComplete: done });
            /*
            return function (isCancelled) {
                if (isCancelled) {
                    element.remove();
                }
            };
            */
        }
        /*
        ,
        leave: function (element, done) {
            TweenMax.set(element, { autoAlpha: 1 });
            TweenMax.to(element, 0.5, { autoAlpha: 0, onComplete: done });

            return function (isCancelled) {
                if (isCancelled) {
                    element.remove();
                }
            };
        }
        */
    };
});
