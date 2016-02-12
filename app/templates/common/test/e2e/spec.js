/* eslint-env protractor */

'use strict';

describe('HOME PAGE', function () {
    beforeEach(function () {
        browser.get('');
    });

    it('Should have title', function () {
        expect(browser.getTitle()).toEqual(jasmine.any(String));
    });
});
