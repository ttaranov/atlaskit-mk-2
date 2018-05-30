import { Token } from './';

export function quadrupleDashSymbol(input: string): Token {
  return {
    type: 'text',
    text: '----',
    length: 4,
  };
}
