import { Schema } from 'prosemirror-model';
import { Token, TokenErrCallback } from './';

export interface MacroOption {
  /** The opening symbol regex */
  opening: RegExp;
  /** The closing symbol regex, can be optional */
  closing?: RegExp;
  /** This function will be called with the rawAttrs and rawContent */
  rawContentProcessor: (
    rawAttrs: string,
    rawContent: string,
    length: number,
    schema: Schema,
    tokenErrCallback?: TokenErrCallback,
  ) => Token;
  /** Token Error Callback */
  tokenErrCallback?: TokenErrCallback;
}

export function commonMacro(
  input: string,
  schema: Schema,
  opt: MacroOption,
): Token {
  const matchOpening = input.match(opt.opening);

  if (!matchOpening) {
    return fallback(input);
  }

  const [, rawAttrs] = matchOpening;
  const openingLength = matchOpening[0].length;

  if (!opt.closing) {
    /**
     * Some macros do not have a closing symbol, for example
     * {anchor:here} {loremipsum}
     */
    return opt.rawContentProcessor(
      rawAttrs,
      '',
      openingLength,
      schema,
      opt.tokenErrCallback,
    );
  }

  const matchClosing = opt.closing.exec(input.substring(openingLength));

  let rawContent = '';
  if (matchClosing) {
    rawContent = input.substring(
      openingLength,
      openingLength + matchClosing.index,
    );
  }

  const length = matchClosing
    ? openingLength + matchClosing.index + matchClosing[0].length
    : openingLength;

  return opt.rawContentProcessor(
    rawAttrs,
    rawContent,
    length,
    schema,
    opt.tokenErrCallback,
  );
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
