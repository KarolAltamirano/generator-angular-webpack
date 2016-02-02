'use strict';

var versionJson = require('../data/version.json'),
    appSettings = require('./appSettings');

var version = function () {
    if (!appSettings.renderVersionInfo) {
        return;
    }

    $('body').append(
        '<div class="version">' +
            'v' + versionJson.version + ' <span>| ' + versionJson.time + '</span>' +
        '</div>'
    );
};

module.exports = version;
