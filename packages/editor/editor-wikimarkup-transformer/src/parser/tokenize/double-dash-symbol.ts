import { Token } from './';

export function doubleDashSymbol(input: string): Token {
  return {
    type: 'text',
    text: '–',
    length: 2,
  };
}
