export * from './url';
export * from './uuid';
export * from './confluence/emoji';
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
