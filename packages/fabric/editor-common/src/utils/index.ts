export * from './url';
export * from './uuid';
export * from './confluence';
export * from './languageList';
export { default as browser } from './browser';
export {
    default as ErrorReporter,
    ErrorReportingHandler,
} from './error-reporter';

export const rgbToHex = (value: string): string | undefined => {
  const matches = value.match(/(0?\.?\d{1,3})%?\b/g);
  if (matches && matches.length >= 3) {
    const [red, green, blue] = matches.map(Number);
    // tslint:disable-next-line:no-bitwise
    return '#' + ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
  }
};

/**
 * A replacement for `String.repeat` until it becomes widely available.
 */
export const stringRepeat = (text: string, length: number): string => {
  let result = '';
  for (let x = 0; x < length; x++) {
    result += text;
  }
  return result;
};
