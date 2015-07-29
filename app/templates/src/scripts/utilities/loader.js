'use strict';

var loaderData = require('./loaderData');

var loader = (function () {
    var _progressCb,
        _completeCb,
        _loader;

    var setProgressCb = function (cb) {
        _progressCb = cb;
    };

    var setCompleteCb = function (cb) {
        _completeCb = cb;
    };

    var createLoader = function () {
        _loader = new createjs.LoadQueue(true);
<% if (soundjs) { %>
        createjs.Sound.alternateExtensions = ['mp3'];
        _loader.installPlugin(createjs.Sound);
<% } %>
        _loader.addEventListener('progress', _progressCb);
        _loader.addEventListener('complete', _completeCb);

        _loader.loadManifest(loaderData);
    };

    var getLoader = function () {
        return _loader;
    };

    // create spy for tests
    var createSpyLoader = function (value) {
        _loader = {
            getResult: function () { return value; }
        };
    };

    return {
        setProgressCb: setProgressCb,
        setCompleteCb: setCompleteCb,
        createLoader:  createLoader,
        getLoader: getLoader,
        createSpyLoader: createSpyLoader
    };
})();

module.exports = loader;
