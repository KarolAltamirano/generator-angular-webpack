import mAnimations from './_mAnimations';
import gsap from 'gsap';

mAnimations.animation('.view-change-animate', function () {
    return {
        enter: function (element, done) {
            gsap.TweenMax.set(element, { autoAlpha: 0 });
            gsap.TweenMax.to(element, 1, { autoAlpha: 1, onComplete: done });
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
            gsap.TweenMax.set(element, { autoAlpha: 1 });
            gsap.TweenMax.to(element, 0.5, { autoAlpha: 0, onComplete: done });

            return function (isCancelled) {
                if (isCancelled) {
                    element.remove();
                }
            };
        }
        */
    };
});
