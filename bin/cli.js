#!/usr/bin/env node
const mkgif = require('../mkgif.js');
const argv = require('minimist')(process.argv.slice(2));

async function init() {
  if (process.argv.length >= 3) {
    try {
      await mkgif(argv);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error('Not enough arguments\nUsage:\n\tmkgif in-file.mov [outfile.gif]');
  }
}

init();
