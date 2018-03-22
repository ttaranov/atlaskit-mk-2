import { parse as parseQuery } from 'querystring';
import { Interval, MacroName, MacroMatch } from '../interfaces';

const KNOWN_MACRO: MacroName[] = [
  'code',
  'color',
  'noformat',
  'panel',
  'quote',
];

/**
 * Convert wiki markup attrs into key->value pairs
 * @example "title=Sparta|color=red" -> {title: Sparta, color: red}
 */
export function parseAttrs(str: string) {
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
export function findMacros(str: string): MacroMatch[] {
  const output: MacroMatch[] = [];

  for (const macro of KNOWN_MACRO) {
    // search for {macro} and {macro:with=attributes|etc}
    const regex = new RegExp(`{${macro}(:([^{]*?))?}`, 'g');
    let matches: RegExpExecArray | null;
    let matchCount = 0;
    let macrosMatch: MacroMatch;

    while ((matches = regex.exec(str)) !== null) {
      const position = matches.index;
      const attrsSerialized = matches[2] || '';
      const isOpeningMacros = matchCount % 2 === 0;

      if (isOpeningMacros) {
        macrosMatch = {
          macro,
          startPos: position + matches[0].length,
          attrs: parseAttrs(attrsSerialized),
          endPos: 0,
        };
      } else {
        macrosMatch!.endPos = position;
        output.push(macrosMatch!);
      }

      matchCount++;
    }
  }

  return output;
}

/**
 * TODO: Mutate matches positions to match opening/closing positions
 * For instance: {bold}{italic}text{bold}{italic} -> {bold}{italic}text{italic}{bold}
 */
export function mutateMatchesOrder(matches: MacroMatch[]): MacroMatch[] {
  return [...matches];
}

/**
 * Calculate number of macro matches between aPos and bPos
 */
export function calcRemoveMatches(
  matches: MacroMatch[],
  aPos: number,
  bPos: number,
  index: number,
): number {
  let output = 0;

  for (let i = index + 1; i < matches.length; i++) {
    const match = matches[i];

    if (match.startPos > aPos && match.endPos < bPos) {
      output++;
    }
  }

  return output;
}

/**
 * Remove matches which cannot belong to outer matches
 * For instance remove all inner matches for "code" macros
 */
export function cleanMatches(matches: MacroMatch[]): MacroMatch[] {
  // searching in ordered list is faster + it's easier
  const output = [...matches]
    .sort((a, b) => a.startPos - b.startPos) // sort by start position
    .filter(a => a.startPos !== a.endPos); // remove bodyless macro

  for (let i = 0; i < output.length; i++) {
    const match = output[i];
    const { macro } = match;

    if (macro !== 'code' && macro !== 'noformat') {
      continue;
    }

    // remove internal macro
    const removeItems = calcRemoveMatches(
      output,
      match.startPos,
      match.endPos,
      i,
    );
    output.splice(i + 1, removeItems);
  }

  return output;
}

export function scanMacro(str: string): MacroMatch[] {
  const macroMatches = findMacros(str);
  const matchesOrdered = mutateMatchesOrder(macroMatches);

  return cleanMatches(matchesOrdered);
}

/**
 * Calculate all intervals that we have in the string
 * All these intervals should be converted to ADF
 */
export function calcIntervals(str: string, macro: MacroMatch[]): Interval[] {
  const output: Interval[] = [];
  const positions: Set<number> = new Set([0, str.length]);

  for (const macros of macro) {
    positions.add(macros.startPos);
    positions.add(macros.endPos);
  }

  const positionsArr = Array.from(positions).sort((a, b) => a - b);
  for (let i = 1; i < positionsArr.length; i++) {
    const currentIndex = positionsArr[i];
    const prevIndex = positionsArr[i - 1];
    output.push({ left: prevIndex, right: currentIndex });
  }

  return output;
}
