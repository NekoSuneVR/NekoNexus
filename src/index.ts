import ParadiseService from '@/ParadiseService';
import seedrandom from 'seedrandom';

const r = seedrandom(String(new Date().getTime()));

// eslint-disable-next-line no-extend-native
Array.prototype.WriteTo = function (stream) {
  for (const _ of this) {
    stream.push(_);
  }
};

Math.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

Math.randomInt = function (min = 1, max = 2147483647) {
  return Math.floor(r() * (max - min) + min);
};

(async () => {
  process.stdout.write('\x1bc');
  ParadiseService.Instance.Run();
})();
