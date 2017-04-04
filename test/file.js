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

/* global describe, it, before, after*/

"use strict";

const nodeCrypto = require("crypto");
const nodeOs = require("os");
const nodePath = require("path");
const enfs = require("enfspatch-promise");
const comparator = require("../");
const rimraf = require("rimraf");

const MbSize = 10;


function prepareFiles(tmpPath, file, fileDiff, done) {
    let end1, end2;
    end1 = false;
    end2 = false;

    function ended() {
        if (end1 === true && end2 === true) {
            enfs.stat(file, done);
        }
    }

    function createFiles() {
        const stream1 = enfs.createWriteStream(file);
        const stream2 = enfs.createWriteStream(fileDiff);

        stream1.on("finish", () => {
            end1 = true;
            ended();
        });
        stream2.on("finish", () => {
            end2 = true;
            ended();
        });

        stream1.on("error", (err) => {
            stream2.destroy();
            done(err);
        });
        stream2.on("error", (err) => {
            stream1.destroy();
            done(err);
        });

        const size = 1024 * 1024; //Mb
        const steps = MbSize; // 10Mb
        const random1 = nodeCrypto.randomBytes(size);
        const random2 = nodeCrypto.randomBytes(size);

        let i = steps;
        while (i-- > 1) {
            stream1.write(random1);
            stream2.write(random1);
        }
        stream1.write(random1);
        stream2.write(random2);

        stream1.end();
        stream2.end();

    }

    enfs.mkdir(tmpPath, (err) => {
        if (err) {
            if (err.code === "EEXIST") {
                return rimraf(tmpPath + nodePath.sep + "*", (err) => {
                    if (err) {
                        return done(err);
                    }
                    createFiles();
                });
            }
            return done(err);
        }
        createFiles();
    });
}


describe("enfscompare-promise", function () {
    describe("> file", function () {
        const tmpPath = nodePath.join(nodeOs.tmpDir(), "async_file");
        const file = nodePath.join(tmpPath, "file");
        const fileDiff = nodePath.join(tmpPath, "fileDiff");
        before(function (done) {
            //this.timeout = 5000;
            prepareFiles(tmpPath, file, fileDiff, done);
        });
        after(function (done) {
            rimraf(tmpPath, done);
        });
        describe("> async", function () {
            describe("> hash", function () {
                it("should compare two equal files", function () {
                    const file1 = nodePath.join(__dirname, "..", "index.js");
                    const file2 = nodePath.join(__dirname, "..", "index.js");
                    return comparator.filesHashP(file1, file2).should.be.fulfilled(true);
                });
                it("should fail to compare two different files", function () {
                    const file1 = nodePath.join(__dirname, "..", "index.js");
                    const file2 = nodePath.join(__dirname, "..", "package.json");
                    return comparator.filesHashP(file1, file2).should.be.fulfilled(false);
                });
                describe("> big files", function () {
                    it("should compare two equal files", function () {
                        return comparator.filesHashP(file, file).should.be.fulfilled(true);
                    });
                    it("should fail to compare two different files", function () {
                        return comparator.filesHashP(file, fileDiff).should.be.fulfilled(false);
                    });
                });
            });
            describe("> byte to byte", function () {
                it("should compare two equal files", function () {
                    const file1 = nodePath.join(__dirname, "..", "index.js");
                    const file2 = nodePath.join(__dirname, "..", "index.js");
                    return comparator.filesP(file1, file2).should.be.fulfilled(true);
                });
                it("should fail to compare two different files", function () {
                    const file1 = nodePath.join(__dirname, "..", "index.js");
                    const file2 = nodePath.join(__dirname, "..", "package.json");
                    return comparator.filesP(file1, file2).should.be.fulfilled(false);
                });
                describe("> big files", function () {
                    it("should compare two equal files", function () {
                        return comparator.filesP(file, file).should.be.fulfilled(true);
                    });
                    it("should fail to compare two different files", function () {
                        return comparator.filesP(file, fileDiff).should.be.fulfilled(false);
                    });
                });
            });
        });
    });
});

