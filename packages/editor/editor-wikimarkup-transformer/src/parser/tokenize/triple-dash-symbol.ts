import { Token } from './';

export function tripleDashSymbol(input: string): Token {
  return {
    type: 'text',
    text: '——',
    length: 3,
  };
}
