const { spawn } = require('child_process');
const exec = require('util').promisify(require('child_process').exec);
const barChart = require('bar-charts');
const BLANK = '⠀'; // braille blank emoji (because jstrace-bars removes leading spaces)
const fileName = require('./lib/file-name.js');
const DEFAULT_FRAMERATE = 10;
const DEFAULT_DELAY = 10; // delay between frames
const DEFAULT_WIDTH = 260;

async function mkgif(argv) {
  const unnamedArgs = argv._;
  if (unnamedArgs.length === 0) throw new Error('No input file provided');
  const inputFileName = unnamedArgs[0];
  const inputName = fileName(inputFileName);

  const outputFileName = unnamedArgs.length > 1 ? unnamedArgs[1] : `${inputName.fileWithoutExtension}.gif`;

  const framerate = Number(argv.fps || argv.framerate || DEFAULT_FRAMERATE);
  const delay = Number(argv.delay || DEFAULT_DELAY);
  const width = Number(argv.width || DEFAULT_WIDTH);

  const ffmpegCommand = `ffmpeg -i ${inputFileName} -vf scale=${width}:-1 -r ${framerate} -f image2pipe -vcodec ppm - | convert -delay ${delay} -layers Optimize -loop 0 - ${outputFileName}`;
  const args = ffmpegCommand.split(' ').slice(1);
  console.log(ffmpegCommand);
  const duration = await getVideoDuration(inputFileName);
  try {
    console.log();
    const ffmpeg = spawn('ffmpeg', args, {shell: true});
    ffmpeg.stderr.on('data', data => {
      const text = data.toString('utf8');
      const regexArr = text.match(/frame=\s+(\d+)\sfps=\s?(\d+\.?\d*)\sq=(-?\d+\.?\d*)\ssize=\s+(\d+)kB\stime=(\d{2}:\d{2}:\d{2}\.\d{2})\sbitrate=\s*((N\/A)|(\d+\.?\d*))(kbits\/s)?\sdup=(\d+)\sdrop=(\d+)\sspeed=\s*(\d\.?\d*e?-?\d*)x?/);
      if (regexArr) {
        const [, frame, fps, q, size, time] = regexArr;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        const count = frame / (duration * framerate) * 100;
        const output = barChart([{label: `Frame: ${frame}/${parseInt(duration * framerate, 10)}`, count}], {percentages: true});
        process.stdout.write(output); // end the line
      }
    });

    ffmpeg.stdout.on('end', data => {
     data && console.log('end', data);
    });
    ffmpeg.on('exit', function(code) {
      if (code != 0) console.error('Error code: ' + code);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.log(`created '${outputFileName}'`);
    });
  } catch (e) {
    console.error(e);
  }
}

async function getVideoDuration(fileName) {
  const output = await exec(`ffprobe ${fileName}`);
  const [, timestamp, hour, minute, second] = output.stderr.match(/Duration\s*:\s((\d+):(\d+):(\d+.?\d*))/i);
  duration = (Number(hour) * 60 * 60) + (Number(minute) * 60) + Number(second);
  return duration;
}

module.exports = mkgif;
