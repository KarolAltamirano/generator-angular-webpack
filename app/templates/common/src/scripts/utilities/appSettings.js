'use strict';

/**
 *
 * enable  logs -> debug.enable('*');
 * disable logs -> debug.disable();
 *
 */

var appSettings = {};

appSettings.isProduction = function () {
    var host = window.location.hostname;

    if (host === 'localhost') { // localhost
        return false;
    }

    return true;
};

appSettings.isNotProduction = function () {
    return !appSettings.isProduction();
};

appSettings.renderVersionInfo = true;

module.exports = appSettings;
