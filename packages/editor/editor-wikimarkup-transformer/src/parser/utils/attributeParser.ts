import { parse as parseQuery } from 'querystring';

export function parseAttrs(
  str: string,
  seperator = '|',
): { [key: string]: string } {
  const output = parseQuery(str, seperator);

  // take only first value of the same keys
  Object.keys(output).forEach(key => {
    if (Array.isArray(output[key])) {
      output[key] = output[key][0];
    }
  });

  return output as { [key: string]: string };
}
