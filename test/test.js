const exec = require('util').promisify(require('child_process').exec);
const fs = require('fs');
const assert = require('assert');
const mkgif = require('../mkgif.js');
const DELETE_TEMP_FILE = false;

function test(inputArgs) {
  return new Promise(async function(resolve, reject) {
    const inputFileName = 'test/test.m4v';
    const outputFileName = 'test/temp-test.gif';
    await mkgif({ _: [ inputFileName, outputFileName ] });
    fs.stat(outputFileName, function (err, stats) {
      assert(stats.size > 100000); // must be greater than 100 thousand
      if (DELETE_TEMP_FILE) {
        fs.unlink(outputFileName, (err) => { // delete temp output file
          if (err) reject(err);
          resolve(stats.size);
        });
      } else resolve(stats.size);
    });
  });
};

test().then(obj => {
  console.log('dunzo');
  // console.log(obj.stdout);
  // console.log(obj.stderr);
}).catch(err => {
  console.error(err);
});
