'use strict';

/**
 * Create animations module
 */

var getModuleInstance = require('../utilities/getModuleInstance'),
    ngAnimate = require('angular-animate');

var mAnimations = getModuleInstance('mAnimations', [ngAnimate]);

module.exports = mAnimations;
