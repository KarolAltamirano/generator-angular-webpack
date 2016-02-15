'use strict';

var createjs = require('createjs'),
    loaderData = require('./loaderData'),
    _loader = {};
<% if (soundjs) { %>
// initialize SoundJS - use 'createjs' object to work with 'SoundJS'
require('SoundJS');
<% } %><% if (easeljs) { %>
// initialize EaselJS - use 'createjs' object to work with 'EaselJS'
require('EaselJS');
<% } %>
/**
 * Create loader
 *
 * @param  {string}   id         - id of new loader
 * @param  {function} progressCb - callback function during loading
 * @param  {function} completeCb - callback function when loading is completed
 */
var createLoader = function (id, progressCb, completeCb) {
    if (_loader[id] != null) {
        throw new Error('Loader with id: ' + id + ' already exists.');
    }

    _loader[id] = new createjs.LoadQueue(true);
<% if (soundjs) { %>
    createjs.Sound.alternateExtensions = ['mp3'];
    _loader[id].installPlugin(createjs.Sound);
<% } %>
    _loader[id].addEventListener('progress', progressCb);
    _loader[id].addEventListener('complete', completeCb);

    _loader[id].loadManifest(loaderData);
};

/**
 * Create spy loader for unit tests
 *
 * @param  {string} id    - id of a loaderData
 * @param  {string} value - return value of the new loaderData
 */
var createSpyLoader = function (id, value) {
    if (_loader[id] != null) {
        throw new Error('Loader with id: ' + id + ' already exists.');
    }

    _loader[id] = {
        getResult: function () { return value; }
    };
};

/**
 * Get loader by its id
 *
 * @param  {string} id - id of a loaderData
 */
var getLoader = function (id) {
    if (_loader[id] == null) {
        throw new Error('Loader with id: ' + id + ' does not exist.');
    }

    return _loader[id];
};

module.exports = {
    createLoader: createLoader,
    createSpyLoader: createSpyLoader,
    getLoader: getLoader
};
