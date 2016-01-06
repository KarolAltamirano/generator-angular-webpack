/* eslint strict: [2, "function"] */

(function () {
    'use strict';

    /**
     *
     * enable  logs -> debug.enable('*');
     * disable logs -> debug.disable();
     *
     */

    var app = window.app || (window.app = {});

    app.isProduction = function () {
        var host = window.location.hostname;

        if (host === 'localhost') { // localhost
            return false;
        }

        return true;
    };

    app.isNotProduction = function () {
        return !app.isProduction();
    };

})();
