'use strict';

/**
 * Get instance of angular module. If module doesn't exist create one.
 * @param  {string} moduleId name of the module
 * @return {object}          angular module
 */
var getModuleInstance = function (moduleId, dependencies) {
    var app = global.app || (global.app = {});

    app.angular = global.app.angular || (global.app.angular = {});

    if (typeof moduleId !== 'string') {
        throw new Error('ModuleId should be a string');
    }

    if (dependencies != null && Object.prototype.toString.call(dependencies) !== '[object Array]') {
        throw new Error('Dependencies should be an Array');
    }

    dependencies = dependencies || [];

    if (app.angular[moduleId] == null) {
        app.angular[moduleId] = angular.module(moduleId, dependencies);
    }

    return app.angular[moduleId];
};

module.exports = getModuleInstance;
