'use strict';

require('./app/mApp');

var loader = require('./utilities/loader');

function progressCb(e) {
    var p = Math.round(100 * e.progress);

    // show progress in loader
    $('.loader').text(p + '%');
}

function completeCb() {
    // hide loader
    $('.loader').hide();

    // run app
    angular.bootstrap(document, ['mApp']);
}

/* bootstrap application */
angular.element(document).ready(function () {
    if (window.app.incompatible.isIncompatibleBrowser()) {
        return;
    }

    // show loader
    $('.loader').text('0%').show();

    // start loader
    loader.setProgressCb(progressCb);
    loader.setCompleteCb(completeCb);
    loader.createLoader();
});
