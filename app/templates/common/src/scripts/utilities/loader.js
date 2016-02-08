'use strict';

var loaderData = require('./loaderData'),
    appCopy = require('../data/appCopy.json'),
    _loader;

// create spy loader for tests
var _createSpyLoader = function (value) {
    return {
        getResult: function () { return value; }
    };
};

var createLoader = function (progressCb, completeCb) {
    _loader = new createjs.LoadQueue(true);
<% if (soundjs) { %>
    createjs.Sound.alternateExtensions = ['mp3'];
    _loader.installPlugin(createjs.Sound);
<% } %>
    _loader.addEventListener('progress', progressCb);
    _loader.addEventListener('complete', completeCb);

    _loader.loadManifest(loaderData);
};

var getLoader = function () {
    if (!_loader) {
        console.log(appCopy.loader.spy);
        return _createSpyLoader(appCopy.loader.spyValue);
    }
    return _loader;
};

module.exports = {
    createLoader: createLoader,
    getLoader: getLoader
};
