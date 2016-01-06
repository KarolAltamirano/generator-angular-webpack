/* eslint strict: [2, "function"] */

(function () {
    'use strict';

    if (window.app.incompatible.isIncompatibleBrowser()) {
        // if browser is incompatible
        document.documentElement.className = 'incompatible ' + document.documentElement.className;
    }

})();
