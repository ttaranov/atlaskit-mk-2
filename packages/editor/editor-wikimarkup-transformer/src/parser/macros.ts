import { NodeType, Schema } from 'prosemirror-model';
import { parse as parseQuery } from 'querystring';
import { MacroMatch, MacroName, MatchPosition } from '../interfaces';

const KNOWN_MACRO: MacroName[] = ['code', 'noformat', 'panel', 'quote'];

/**
 * Convert wiki markup attrs into key->value pairs
 * @example "title=Sparta|color=red" -> {title: Sparta, color: red}
 */
function parseAttrs(str: string) {
  const output = parseQuery(str, '|');

  // take only first value of the same keys
  Object.keys(output).forEach(key => {
    if (Array.isArray(output[key])) {
      output[key] = output[key][0];
    }
  });

  return output;
}

/**
 * Regex search for macro in the string
 */
export function findMacros(
  wikiMarkup: string,
  searchMacros = KNOWN_MACRO,
): MacroMatch[] {
  const output: MacroMatch[] = [];

  for (const macro of searchMacros) {
    // search for {macro} and {macro:with=attributes|etc}
    const regex = new RegExp(`{${macro}(:([^{]*?))?}`, 'g');
    let matches: RegExpExecArray | null;
    let matchCount = 0;
    let startPos: MatchPosition | undefined;
    let attrs: { [key: string]: string } | undefined;

    while ((matches = regex.exec(wikiMarkup)) !== null) {
      const position = matches.index;
      const attrsSerialized = matches[2] || '';
      const isOpeningMacros = matchCount % 2 === 0;

      if (isOpeningMacros) {
        startPos = {
          outer: position,
          inner: position + matches[0].length,
        };

        attrs = parseAttrs(attrsSerialized);
      } else {
        output.push({
          macro,
          attrs: attrs!,
          startPos: startPos!,
          endPos: {
            inner: position,
            outer: position + matches[0].length,
          },
        });
      }

      matchCount++;
    }
  }

  return output;
}

export function getProseMirrorNodeTypeForMacro(
  schema: Schema,
  macro: MacroName,
): NodeType {
  const { blockquote, codeBlock, panel } = schema.nodes;

  switch (macro) {
    case 'code':
    case 'noformat':
      return codeBlock;

    case 'panel':
      return panel;

    case 'quote':
      return blockquote;

    default:
      throw new Error(`Unknown macro type: ${macro}`);
  }
}
