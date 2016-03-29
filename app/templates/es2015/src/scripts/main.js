import incompDetect from './utilities/incompDetect';

// run browser detection
incompDetect();

import 'babel-polyfill';
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
    document.querySelector('.loader').innerHTML = p + appCopy.loader.progress;
}

function completeCb() {
    // create new chunk
    require.ensure([], function (require) {
        var angular = require('angular');

        require('./app/mApp');

        // hide loader
        document.querySelector('.loader').style.display = 'none';

        // run app
        angular.bootstrap(document, ['mApp'], { strictDi: true });
    });
}

// bootstrap application
if (!incompatible.isIncompatibleBrowser()) {
    // show loader
    document.querySelector('.loader').innerHTML = appCopy.loader.start;
    document.querySelector('.loader').style.display = 'block';

    // start loader
    loader.createLoader('main', progressCb, completeCb);
}
