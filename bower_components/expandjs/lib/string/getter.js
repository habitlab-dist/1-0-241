/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    var assertArgument = require('../assert/assertArgument'),
        camelCase      = require('../string/camelCase'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Returns the getter for the specified property.
     * A second parameter can be passed to specify if the getter should be prefixed with `_`.
     *
     * ```js
     * XP.getter('zip-code');
     * // => 'getZipCode'
     *
     * XP.getter('zip-code', true);
     * // => '_getZipCode'
     * ```
     *
     * @function getter
     * @param {string} [string = ""] The property to set.
     * @param {boolean} [underscore = false] Specify if the getter should be prefixed with `_`.
     * @returns {string} Returns the property's getter.
     * @hot
     */
    module.exports = function getter(string, underscore) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? (underscore ? '_' : '') + camelCase('get-' + string) : '';
    };

}());
