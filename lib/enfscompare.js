/**
 * @project enfscompare
 * @filename enfscompare.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description enfscompare entry point
 */

"use strict";

const enfscompare = require("enfscompare");

module.exports = enfscompare;

["files", "filesHash", "dir", "dirHash"].forEach((name) => {
    if (name in enfscompare) {
        module.exports[`${name}P`] = function (path1, path2, opt) {
            return new Promise((resolve, reject) => enfscompare[name](path1, path2, opt, (err, result) => err ? reject(err) : resolve(result)));
        }
    }
});

