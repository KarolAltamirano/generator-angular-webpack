'use strict';

var versionJson = require('../data/version.json');

var version = function () {
    if (!app.renderVersionInfo) {
        return;
    }

    $('body').append(
        '<div class="version">' +
            'v' + versionJson.version + ' <span>| ' + versionJson.time + '</span>' +
        '</div>'
    );
};

module.exports = version;
