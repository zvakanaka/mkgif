const exec = require('util').promisify(require('child_process').exec);

async function mkgif(inputArgs) {
  const inputFileName = inputArgs[0];
  const inputFileNameNoBase = inputFileName.substr(inputFileName.lastIndexOf('/') + 1, inputFileName.length);
  const outputFileName = inputArgs[1] || inputFileNameNoBase.substr(0,inputFileNameNoBase.lastIndexOf('.')) + '.gif';
  const width = 260;
  const fps = 10;
  const outputObj = await exec(`ffmpeg -i ${inputFileName} -vf scale=${width}:-1 -r ${fps} -f image2pipe -vcodec ppm - | convert -delay ${fps} -layers Optimize -loop 0 - ${outputFileName}`);
  return outputObj;
};

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
