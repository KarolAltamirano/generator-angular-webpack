'use strict';

require('./app/mApp');

var loader = require('./utilities/loader'),
    version = require('./utilities/version'),
    incompatible = require('./utilities/incompatible');

// render build version if enabled
version();

// set loader callbacks
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
    if (incompatible.isIncompatibleBrowser()) {
        return;
    }

    // show loader
    $('.loader').text('0%').show();

    // start loader
    loader.createLoader(progressCb, completeCb);
});
