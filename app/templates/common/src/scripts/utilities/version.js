'use strict';

var $ = require('jquery'),
    versionJson = require('../data/version.json'),
    appSettings = require('./appSettings');

var version = function () {
    if (!appSettings.renderVersionInfo) {
        return;
    }

    if (console && console.log) {
        console.log(
            '%cv' + versionJson.version + '%c | %c' + versionJson.time,
            'color: #ffffff; background: #00aa00; padding: 0 5px;',
            'color: #666666; background: #ffffff;',
            'color: #ffffff; background: #00aa00; padding: 0 5px;'
        );
    }

    $('body').append(
        '<div class="version">' +
            'v' + versionJson.version + ' <span>| ' + versionJson.time + '</span>' +
        '</div>'
    );
};

module.exports = version;
