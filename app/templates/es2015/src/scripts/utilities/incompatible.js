/* eslint key-spacing: 0, comma-spacing: 0 */

import UAParser from 'ua-parser-js';

var uaParser = new UAParser(),
    incompatible = {};

incompatible.uaResult = uaParser.getResult();

/**
 * Check browser compatibility
 *
 * @return {Boolean} - for uncompatible browser return 'true', otherwise 'false'
 */
incompatible.isIncompatibleBrowser = function () {
    var listOfSupported = [
            { browser: 'Chrome'       , version: 43 },
            { browser: 'Firefox'      , version: 38 },
            { browser: 'Safari'       , version:  7 },
            { browser: 'Mobile Safari', version:  7 },
            { browser: 'IE'           , version: 11 },
            { browser: 'Edge'         , version: 12 },
            { browser: 'IEMobile'     , version: 11 }
        ],
        incomp = true,
        i;

    for (i = 0; i < listOfSupported.length; i++) {
        if (listOfSupported[i].browser === incompatible.uaResult.browser.name &&
            listOfSupported[i].version <= parseInt(incompatible.uaResult.browser.major))  {
            incomp = false;
        }
    }

    return incomp;
};

export default incompatible;
