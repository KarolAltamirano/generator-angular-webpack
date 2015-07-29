(function () {
    'use strict';

    var uaParser = new UAParser(),
        incompatible = {},
        app = window.app || (window.app = {});

    /**
     *   custom user agent for debugging
     */

    // android 4.4.2
    // uaParser.setUA('Mozilla/5.0 (Linux; Android 4.4.2; Nexus 5 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36/4.05d.1002.m7');

    // iOS 7.0
    // uaParser.setUA('Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25 (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)');

    // windows (vista, xp, 7)
    // uaParser.setUA('Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0)');
    // uaParser.setUA('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; chromeframe/13.0.782.218; chromeframe; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729)');
    // uaParser.setUA('Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)');

    // macOS 10.10
    // uaParser.setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10) AppleWebKit/538.34.48 (KHTML, like Gecko) Version/8.0 Safari/538.35.8');

    /**
     *  end custom user agent for debugging
     */

    incompatible.uaResult = uaParser.getResult();

    incompatible.isIncompatibleBrowser = function () {
        var listOfSupported = [
                { browser: 'Chrome'       , version: 39 },
                { browser: 'Firefox'      , version: 35 },
                { browser: 'Safari'       , version:  7 },
                { browser: 'Mobile Safari', version:  7 },
                { browser: 'IE'           , version:  8 },
                { browser: 'IEMobile'     , version: 11 }
            ],
            incomp = true;

        listOfSupported.forEach(function (elem) {
            if (elem.browser === incompatible.uaResult.browser.name &&
                elem.version <= parseInt(incompatible.uaResult.browser.major)) {
                incomp = false;
            }
        });

        return incomp;
    };

    incompatible.isIncompatibleOs = function () {
        var listOfSupported = {
                android : { major:  4, subv: 4 },
                iOS     : { major:  7          },
                windows : { major:  7          },
                macOS   : { major: 10, subv: 7 }
            },
            incomp    = true,
            osName    = incompatible.uaResult.os.name,
            osVersion = incompatible.uaResult.os.version;

        if (osName === 'Android') {
            osVersion = osVersion.split('.');
            if (osVersion[0] >= listOfSupported.android.major && osVersion[1] >= listOfSupported.android.subv) {
                incomp = false;
            }
        }

        if (osName === 'iOS') {
            osVersion = osVersion.split('.');
            if (osVersion[0] >= listOfSupported.iOS.major) {
                incomp = false;
            }
        }

        if (osName === 'Windows') {
            if (osVersion !== 'XP' || osVersion !== 'Vista') {
                osVersion = osVersion.split('.');
                if (osVersion[0] >= listOfSupported.windows.major) {
                    incomp = false;
                }
            }
        }

        if (osName === 'Mac OS') {
            osVersion = osVersion.split('.');
            if (osVersion[0] >= listOfSupported.macOS.major && osVersion[1] >= listOfSupported.macOS.subv) {
                incomp = false;
            }
        }

        return incomp;
    };

    app.incompatible = incompatible;

})();
