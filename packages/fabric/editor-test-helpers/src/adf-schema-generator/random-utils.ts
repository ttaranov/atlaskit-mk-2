import * as Chance from 'chance';
import { randexp } from 'randexp';

randexp.defaultRange.add(0, 65535); // Increase the character range

const generator = new Chance();

export const string = () => {
  let result = '';
  for (let i = 0; i < 100; i++) {
    result += String.fromCharCode(generator.natural({ max: 65535 }));
  }
  return result;
};

export const boolean = () => {
  return generator.bool();
};

export const naturalNumber = (min = 0, max = Number.MAX_VALUE) => {
  return generator.natural({ min, max });
};

export const floating = (min?: number, max?: number) => {
  return generator.floating({ min, max });
};

export const itemFromList = <T>(list: T[]): T => {
  return generator.pickone(list);
};

export const stringFromPattern = (pattern: string) => {
  if (pattern.indexOf('$') >= 0) {
    return randexp(pattern);
  }
  // pad end of string, if regex does not specify end match
  return randexp(pattern) + generator.string();
};

export const decimalFromZeroToOne = () => {
  return Math.random();
};
