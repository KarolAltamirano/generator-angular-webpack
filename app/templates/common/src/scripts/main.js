'use strict';

require('./app/mApp');

var loader = require('./utilities/loader'),
    version = require('./utilities/version'),
    incompatible = require('./utilities/incompatible'),
    appCopy = require('./data/appCopy.json');

// render build version if enabled
version();

// set loader callbacks
function progressCb(e) {
    var p = Math.round(100 * e.progress);

    // show progress in loader
    $('.loader').text(p + appCopy.loader.progress);
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
    $('.loader').text(appCopy.loader.start).show();

    // start loader
    loader.createLoader('main', progressCb, completeCb);
});
