'use strict';

var loaderData = require('./loaderData');

var createLoader = function (id, progressCb, completeCb) {
    var app = global.app || (global.app = {});

    app.loader = global.app.loader || (global.app.loader = {});

    if (app.loader[id] != null) {
        throw new Error('Loader with id: ' + id + ' already exists.');
    }

    app.loader[id] = new createjs.LoadQueue(true);
<% if (soundjs) { %>
    createjs.Sound.alternateExtensions = ['mp3'];
    app.loader[id].installPlugin(createjs.Sound);
<% } %>
    app.loader[id].addEventListener('progress', progressCb);
    app.loader[id].addEventListener('complete', completeCb);

    app.loader[id].loadManifest(loaderData);
};

var createSpyLoader = function (value) {
    return {
        getResult: function () { return value; }
    };
};

var getLoader = function (id) {
    var app = global.app || (global.app = {});

    app.loader = global.app.loader || (global.app.loader = {});

    if (app.loader[id] == null) {
        throw new Error('Loader with id: ' + id + ' does not exist.');
    }

    return app.loader[id];
};

module.exports = {
    createLoader: createLoader,
    createSpyLoader: createSpyLoader,
    getLoader: getLoader
};
