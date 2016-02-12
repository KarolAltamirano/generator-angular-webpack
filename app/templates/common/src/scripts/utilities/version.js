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
            '\n%cv' + versionJson.version + '%c %c' + versionJson.time + '%c\n\n',
            'color: #ffffff; background: #00aa00; padding: 1px 5px;',
            'color: #ffffff; background: #d1eeee; padding: 1px 5px;',
            'color: #ffffff; background: #00aa00; padding: 1px 5px;',
            'background: #ffffff;'
        );
    }

    $('body').append(
        '<div class="version">' +
            'v' + versionJson.version + ' <span>| ' + versionJson.time + '</span>' +
        '</div>'
    );
};

module.exports = version;
