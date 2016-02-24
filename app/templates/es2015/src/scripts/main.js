import incompDetect from './utilities/incompDetect';

// run browser detection
incompDetect();

import 'babel-polyfill';
import $ from 'jquery';
import loader from './utilities/loader';
import version from './utilities/version';
import incompatible from './utilities/incompatible';
import appCopy from './data/app-copy.json';

// render build version if enabled
version();

// set loader callbacks
function progressCb(e) {
    var p = Math.round(100 * e.progress);

    // show progress in loader
    $('.loader').text(p + appCopy.loader.progress);
}

function completeCb() {
    // create new chunk
    require.ensure([], function (require) {
        var angular = require('angular');

        require('./app/mApp');

        // hide loader
        $('.loader').hide();

        // run app
        angular.bootstrap(document, ['mApp']);
    });
}

// bootstrap application
$(document).ready(function () {
    if (incompatible.isIncompatibleBrowser()) {
        return;
    }

    // show loader
    $('.loader').text(appCopy.loader.start).show();

    // start loader
    loader.createLoader('main', progressCb, completeCb);
});
