import angular from 'angular';

var _modules = {};

/**
 * Get instance of angular module. If module doesn't exist create one.
 *
 * @param  {string} moduleId - name of the module
 * @return {object}          - angular module
 */
var getModuleInstance = function (moduleId, dependencies) {
    if (typeof moduleId !== 'string') {
        throw new Error('ModuleId should be a string');
    }

    if (dependencies != null && Object.prototype.toString.call(dependencies) !== '[object Array]') {
        throw new Error('Dependencies should be an Array');
    }

    dependencies = dependencies || [];

    if (_modules[moduleId] == null) {
        _modules[moduleId] = angular.module(moduleId, dependencies);
    }

    return _modules[moduleId];
};

export default getModuleInstance;
