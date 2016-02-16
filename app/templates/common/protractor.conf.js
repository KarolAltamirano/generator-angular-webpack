'use strict';

exports.config = {

    baseUrl: 'http://localhost:3000',

    directConnect: true,

    specs: ['test/e2e/spec.js'],

    jasmineNodeOpts: {
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 30000
    }

};
