'use strict';

var createjs = require('createjs'),
    loaderData = require('./loaderData');

var app = global.app || (global.app = {});

app.loader = app.loader || (app.loader = {});

/**
 * Create loader
 *
 * @param  {string}   id         - id of new loader
 * @param  {function} progressCb - callback function during loading
 * @param  {function} completeCb - callback function when loading is completed
 */
var createLoader = function (id, progressCb, completeCb) {
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

/**
 * Create spy loader for unit tests
 *
 * @param  {string} id    - id of a loaderData
 * @param  {string} value - return value of the new loaderData
 */
var createSpyLoader = function (id, value) {
    if (app.loader[id] != null) {
        throw new Error('Loader with id: ' + id + ' already exists.');
    }

    app.loader[id] = {
        getResult: function () { return value; }
    };
};

/**
 * Get loader by its id
 *
 * @param  {string} id - id of a loaderData
 */
var getLoader = function (id) {
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
