const exec = require('util').promisify(require('child_process').exec);
const fs = require('fs');
const assert = require('assert');
const mkgif = require('../mkgif.js');

function test(inputArgs) {
    return new Promise(async function (resolve, reject) {
        const outputFileName = 'test/temp-water.gif';
        const inputFileName = 'test/water.mp4';
        const {stdout, stderr} = await mkgif([inputFileName, outputFileName]);
        fs.stat(outputFileName, function (err, stats) {
            assert(stats.size > 100000); // must be greater than 100 thousand
            fs.unlink(outputFileName, (err) => { // delete temp output file
                if (err) reject(err);
                resolve({stdout, stderr});
            });
        });
    });
};

function testScale(inputArgs) {
    return new Promise(async function (resolve, reject) {
        const outputFileName = 'test/temp-water.gif';
        const inputFileName = 'test/water.mp4';
        const {stdout, stderr} = await mkgif(['-s', '64:64', inputFileName, outputFileName]);
        fs.stat(outputFileName, function (err, stats) {
            assert(stats.size > 100000); // must be greater than 100 thousand
            fs.unlink(outputFileName, (err) => { // delete temp output file
                if (err) reject(err);
                resolve({stdout, stderr});
            });
        });
    });
}

test().then(obj => {
    console.log('dunzo');
    testScale().then(() => {
        console.log('success');
    }).catch(err => console.log(err));
}).catch(err => {
    console.error(err);
});
