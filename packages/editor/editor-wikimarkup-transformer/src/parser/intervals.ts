import * as assert from 'assert';

import {
  FatInterval,
  MacroInterval,
  MacroMatch,
  SimpleInterval,
} from '../interfaces';

import { findMacros } from './macros';
import { isSpecialMacro } from './special';

export function containsInterval(
  match: FatInterval,
  interval: SimpleInterval,
): boolean {
  return (
    match.startPos.inner <= interval.left &&
    match.endPos.inner >= interval.right
  );
}

function hasIntersectionWithInterval(
  macro: MacroMatch,
  interval: SimpleInterval,
): boolean {
  const isLeftIntervalBorderInsideMacro =
    interval.left >= macro.startPos.inner &&
    interval.left <= macro.endPos.inner;

  const isRightIntervalBorderInsideMacro =
    interval.right >= macro.startPos.inner &&
    interval.right <= macro.endPos.inner;

  return isLeftIntervalBorderInsideMacro || isRightIntervalBorderInsideMacro;
}

function calcIntersectingMacros(
  macros: MacroMatch[],
  startIndex: number,
): number {
  const macro = macros[startIndex];
  assert(macro, `Macro position is out of range: ${startIndex}`);

  return macros.reduce((memo, currentMacro, index) => {
    if (index <= startIndex) {
      return memo;
    }

    const currentMacroInterval: SimpleInterval = {
      left: currentMacro.startPos.outer,
      right: currentMacro.endPos.outer,
    };

    return hasIntersectionWithInterval(macro, currentMacroInterval)
      ? memo + 1
      : memo;
  }, 0);
}

/**
 * Remove intersecting/containing macros inside "code" and "noformat" macros
 */
function filterValidMacros(macros: MacroMatch[]): MacroMatch[] {
  const output = [...macros].sort(
    (a, b) => a.startPos.outer - b.startPos.outer,
  );
  let i = 0;

  // Array.prototype.filter() looks much cleaner here
  // however array can change inside the callback function
  // which makes the code awkward, so ¯\_(ツ)_/¯
  while (i < output.length) {
    const macro = output[i];

    if (isSpecialMacro(macro.macro)) {
      const intersectingMacrosNum = calcIntersectingMacros(output, i);
      output.splice(i + 1, intersectingMacrosNum);
    }

    i++;
  }

  return output;
}

/**
 * Calculate all text intervals in the string
 * For instance in this string:
 * "This is a {quote}quote with a {panel}panel{panel} inside{quote}"
 * intervals will be "This is a ", "quote with a ", "panel" and " inside"
 * So the output will be their positions in a string
 */
export function calcTextIntervals(
  text: string,
  macros: FatInterval[],
): SimpleInterval[] {
  const output: SimpleInterval[] = [];
  const positions: Set<number> = new Set([0, text.length]);

  // meta intervals are intervals of data which are not used in sting formation
  // for instance we can have a string which looks like this:
  // "This is a {panel:foo=bar|bar=baz}panel with some text{panel}"
  // In this string useful intervals are "This is a " and "panel with some text"
  // while "{panel:foo=bar|bar=baz}" and "{panel}" are meta intervals
  const metaIntervals: SimpleInterval[] = [];

  for (const macro of macros) {
    positions.add(macro.startPos.outer);
    positions.add(macro.startPos.inner);
    positions.add(macro.endPos.outer);
    positions.add(macro.endPos.inner);

    metaIntervals.push({
      left: macro.startPos.outer,
      right: macro.startPos.inner,
    });
    metaIntervals.push({ left: macro.endPos.inner, right: macro.endPos.outer });
  }

  // sort positions
  const positionsArr = Array.from(positions).sort((a, b) => a - b);

  // build all intervals
  for (let i = 1; i < positionsArr.length; i++) {
    const currentIndex = positionsArr[i];
    const prevIndex = positionsArr[i - 1];

    const isMetaInterval = metaIntervals.some(({ left, right }) => {
      return left === prevIndex && right === currentIndex;
    });

    if (!isMetaInterval) {
      output.push({ left: prevIndex, right: currentIndex });
    }
  }

  return output;
}

/**
 * Splits the string into intervals of text with macro elements
 * which should be applied to them. Macro elements are sorted
 * by outer->inner. For instance this string:
 * "This is a {quote}quote with a {panel}foobar{panel} inside{quote}"
 * foobar text chunk will have 2 macros: [quote, panel]
 */
export function getResolvedMacroIntervals(wikiMarkup: string): MacroInterval[] {
  const macros = findMacros(wikiMarkup);
  const validMacros = filterValidMacros(macros);

  // calculate all intervals taking outer borders of macros
  const intervals = calcTextIntervals(wikiMarkup, validMacros);

  // create output list with empty macros in its elements
  const output: MacroInterval[] = intervals.map(({ left, right }) => {
    return {
      macros: [],
      text: wikiMarkup.substring(left, right),
    };
  });

  // iterate existing macros and put them into the output list
  for (const macro of validMacros) {
    intervals.map((interval, i) => {
      if (containsInterval(macro, interval)) {
        output[i].macros.push({
          macro: macro.macro,
          attrs: macro.attrs,
        });
      }
    });
  }

  return output;
}
