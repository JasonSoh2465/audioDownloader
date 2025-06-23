import { resolve, join } from 'node:path';
import { accessSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { YtDlp, VideoProgress } from 'ytdlp-nodejs';

const yt = new YtDlp();
const root = resolve(process.env.NODE_ENV ?? '');

async function downloadAudio(url: string) {
  const audioDir = join(root, 'audio');
  const audioFilename = randomUUID();
  // const getAudioFilename = (audioRoot: string) => {
  //   const dataFile = join(root, 'data.json');
  //   const { last_id } = JSON.parse(readFileSync(dataFile, { encoding: 'utf8' }));
  //   const current_id = last_id + 1;
  //   let audioFilename = `${current_id}.%(ext)s`;
  //   let isPresent = true;

  //   try {
  //     accessSync(join(audioDir, audioFilename));
  //   } catch (err) {
  //     isPresent = false;
  //   }

  //   if (isPresent) {
  //     return join(audioRoot, `${current_id + 1}.%(ext)s`);
  //   }

  //   return join(audioRoot, audioFilename);
  // }

  try {
    accessSync(audioDir);
  } catch (err) {
    mkdirSync(audioDir);
  }

  const opt = {
    filter: {
      format: 'audioonly',
      type: 'mp3',
    },
    onProgress(progress: VideoProgress) {
      console.log(progress.percentage_str);
    },
    output: `${audioDir}/${audioFilename}.%(ext)s`,
  };
  const output = await yt.downloadAsync(url, opt);

  const logger = (log: string) => {
    const logFile = join(root, 'download.txt');

    writeFileSync(logFile, log, { encoding: 'utf8' });
    console.log(`Successfully written download log to ${logFile}.`);
  };

  logger(output);
  console.log(`Succesfully downloaded audio file ${audioFilename}.`);
}

async function main() {
  const urls = [
    'https://soundgasm.net/u/LeyLeyVA/Your-Sisters-Best-Friend-Has-A-Thing-For-Shy-Nerdy-Boys-Like-You',
  ];

  for (const url of urls) {
    await downloadAudio(url);
  }
}

main();
