const exec = require('util').promisify(require('child_process').exec);

async function mkgif(inputArgs) {
  const width = inputArgs[0] === '-s' ? Number(inputArgs[1].split(':')[0]) : 240;
  const height = inputArgs[0] === '-s' ? Number(inputArgs[1].split(':')[1]) : 240;

  const inputFileName = inputArgs[0] === '-s' ? inputArgs[2] : inputArgs[0];
  const inputFileNameNoBase = inputFileName.substr(inputFileName.lastIndexOf('/') + 1, inputFileName.length);
  const outputFileName = (inputArgs[0] === '-s' ? inputArgs[3] : inputArgs[1]) || inputFileNameNoBase.substr(0,inputFileNameNoBase.lastIndexOf('.')) + '.gif';
  const fps = 10;
  const outputObj = await exec(`ffmpeg -i ${inputFileName} -vf scale=${width}:${height} -r ${fps} -f image2pipe -vcodec ppm - | convert -delay ${fps} -layers Optimize -loop 0 - ${outputFileName}`);
  return outputObj;
};

module.exports = mkgif;
