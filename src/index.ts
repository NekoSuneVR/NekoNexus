import packageJson from '@/../package.json';
import ParadiseService from '@/ParadiseService';
import { program } from 'commander';
import path from 'path';
import seedrandom from 'seedrandom';
import { FallbackUpdateGenerator, UpdateGenerator } from './utils';

const r = seedrandom(String(new Date().getTime()));

// eslint-disable-next-line no-extend-native
Array.prototype.WriteTo = function (stream: number[]) {
  for (const _ of this) {
    stream.push(_);
  }
};

Math.clamp = function (value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
};

Math.randomInt = function (min = 1, max = 2147483647) {
  return Math.floor(r() * (max - min) + min);
};

program
  .name('paradise')
  .description(packageJson.description)
  .version(packageJson.version)
  .helpOption('--help', 'Displays this help text')
  .helpCommand(false)
  .addHelpText('afterAll', '\nRun without any parameters to launch the Web Services.')
  .action(async () => {
    process.stdout.write('\x1bc');
    ParadiseService.Instance.Run();
  });

program
  .command('gen-updates')
  .description('Generates YAML definitions for automatic game updates')
  .option('--fallback', 'Generate fallback definitions for pre-v2 update clients')
  .action((options, command) => {
    if (!options.fallback) {
      UpdateGenerator.generate(path.join(process.cwd(), 'wwwroot/updates/v2'));
    } else {
      FallbackUpdateGenerator.generate(path.join(process.cwd(), 'wwwroot/updates/'));
    }
  });

program.parse();
