'use strict';

var loaderData = require('./loaderData');

var loader = (function () {
    var _loader;

    // create spy for tests
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
            console.log('Loader was not created. Using spy loader instead.');
            return _createSpyLoader('spy-data-string');
        }
        return _loader;
    };

    return {
        createLoader: createLoader,
        getLoader: getLoader
    };
})();

module.exports = loader;