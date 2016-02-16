'use strict';

var incompatible = require('./incompatible');

/**
 * Add 'incompatible' class to documentElement in unsupported browsers
 */
var incompDetect = function () {
    if (incompatible.isIncompatibleBrowser()) {
        // if browser is incompatible
        document.documentElement.className = 'incompatible ' + document.documentElement.className;
    }
};

module.exports = incompDetect;
