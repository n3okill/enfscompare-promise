/**
 * @project enfscompare
 * @filename file.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016  Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 08-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description tests for file comparison
 */

/* global describe, it*/

"use strict";

const nodePath = require("path");
const comparator = require("../");


describe("enfscompare", function () {
    describe("> dir", function () {
        describe("> async", function () {
            describe("> hash", function () {
                it("should compare two equal directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    return comparator.dirHashP(path1, path2).should.be.fulfilled(true);
                });
                it("should fail to compare two different directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    return comparator.dirHashP(path1, path2).should.be.fulfilled(false);
                });
            });
            describe("> byte to byte", function () {
                it("should compare two equal directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    return comparator.dirP(path1, path2).should.be.fulfilled(true);
                });
                it("should fail to compare two different directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    return comparator.dirP(path1, path2).should.be.fulfilled(false);
                });
            });
        });
    });
});
