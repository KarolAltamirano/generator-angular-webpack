'use strict';

var load = require.context('./', false, /^[^_]+\.js$/);

load.keys().forEach(load);

module.exports = 'mServices';
