#!/usr/bin/env node
const mkgif = require('../mkgif.js');

async function init() {
  if (process.argv.length >= 3) {
    try {
      const inputArgs = process.argv.slice(2);
      const {stdout, stderr} = await mkgif(inputArgs);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error('Not enough arguments\nUsage:\n\tmkgif in-file.mov [outfile.gif]');
  }
}

init();
