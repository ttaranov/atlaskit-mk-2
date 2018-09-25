import { Node as PMNode, Schema } from 'prosemirror-model';
import { blockquoteMacro } from '../macro/blockQuote';
import { codeBlockMacro } from '../macro/codeBlock';
import { colorMacro } from '../macro/color';
import { panelMacro } from '../macro/panel';
import { adfMacro } from '../macro/adf';
import { unknownMacro } from '../macro/unknown';
import { Token } from './';
import { parseAttrs } from '../utils/attrs';

// {panel:bgColor=red}This is a panel{panel}
const MACRO_REGEXP_OPENING = /^{(\w+)(?::([^{\n]*))?}/;

export function macro(input: string, schema: Schema): Token {
  const matchOpening = input.match(MACRO_REGEXP_OPENING);

  if (!matchOpening) {
    return fallback(input);
  }

  const [, macroName, rawAttrs] = matchOpening;

  const closingRegex = new RegExp(`{${macroName}}`, 'g');
  closingRegex.lastIndex = matchOpening[0].length;
  const matchClosing = closingRegex.exec(input);

  let rawContent = '';
  if (matchClosing) {
    rawContent = input.substring(matchOpening[0].length, matchClosing.index);
  }

  let nodes: PMNode[] = [];
  const attrs = parseAttrs(rawAttrs);

  switch (macroName) {
    case 'panel':
      nodes = panelMacro(attrs, rawContent, schema);
      break;
    case 'code':
    case 'noformat':
      nodes = codeBlockMacro(attrs, rawContent, schema);
      break;
    case 'quote':
      nodes = blockquoteMacro(attrs, rawContent, schema);
      break;
    case 'color':
      nodes = colorMacro(attrs, rawContent, schema);
      break;
    case 'adf':
      nodes = adfMacro(attrs, rawContent, schema);
      break;
    default:
      nodes = unknownMacro(macroName, rawAttrs, rawContent, schema);
      break;
  }

  const length = matchClosing
    ? matchClosing.index + matchClosing[0].length
    : matchOpening[0].length;

  return {
    type: 'pmnode',
    nodes,
    length,
  };
}

function fallback(input: string): Token {
  return {
    type: 'text',
    text: input.substr(0, 1),
    length: 1,
  };
}
