'use strict';

var incompatilble = require('./incompatible');

var incompDetect = function () {
    if (incompatilble.isIncompatibleBrowser()) {
        // if browser is incompatible
        document.documentElement.className = 'incompatible ' + document.documentElement.className;
    }
};

module.exports = incompDetect;
