import * as assert from 'assert';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { parse as parseQuery } from 'querystring';

import {
  MacroName,
  MacroMatch,
  MacrosMatchPosition,
  SimpleInterval,
  TreeNode,
  TreeNodeRoot,
  TreeNodeText,
} from '../interfaces';

const HEADING_REGEXP = /^h([1|2|3|4|5|6]+)\.\s(.+)/;
const NEWLINE = '\n';

const KNOWN_MACRO: MacroName[] = ['code', 'noformat', 'panel', 'quote'];

function isStartPositionSorted(matches: MacroMatch[]): boolean {
  for (let i = 1; i < matches.length; i++) {
    const currentMatch = matches[i];
    const prevMatch = matches[i - 1];

    if (currentMatch.startPos.outer < prevMatch.startPos.outer) {
      return false;
    }
  }

  return true;
}

export default class AbstractTree {
  private schema: Schema;
  private wikiMarkup: string;
  private macrosStructure: TreeNodeRoot;

  constructor(schema: Schema, wikiMarkup: string) {
    this.schema = schema;
    this.wikiMarkup = wikiMarkup;
  }

  getMacrosStructure(): TreeNodeRoot {
    if (!this.macrosStructure) {
      this.macrosStructure = {
        type: 'root',
        content: this.getTreeNodes(0, this.wikiMarkup.length, false),
      };
    }

    return this.macrosStructure;
  }

  reduceMacrosStructure(root: TreeNodeRoot): TreeNodeRoot {
    return root;
  }

  getProseMirrorModel(): PMNode {
    const root = this.getMacrosStructure();
    const flatMacros = this.reduceMacrosStructure(root);

    return this.schema.nodes.doc.createChecked(
      {},
      this.getProseMirrorNodes(flatMacros),
    );
  }

  private getProseMirrorNodes(root: TreeNode): PMNode[] {
    const output: PMNode[] = [];

    for (const node of root.content) {
      if (node.type === 'macro') {
        const content = this.getProseMirrorNodes(node);
        output.push(this.schema.nodes.blockquote.createChecked({}, content));
      } else {
        output.push(this.schema.nodes.paragraph.createChecked({}));
      }
    }

    return output;
  }

  private getTreeNodes(
    left: number,
    right: number,
    treatChildrenAsText: boolean,
  ): TreeNode[] {
    const chunk = this.wikiMarkup.substring(left, right);
    const macros = this.findMacros(chunk);
    const sortedMacros = this.cleanMatches(macros);

    const topLevelMacros = treatChildrenAsText
      ? []
      : this.findUpperLevelMacros(
          { left: 0, right: chunk.length },
          sortedMacros,
        );

    const intervals = this.calcIntervals(chunk, sortedMacros);
    const output: TreeNode[] = [];
    let position = 0;

    while (position < chunk.length) {
      const intervalAtPosition = intervals.find(
        interval => interval.left === position,
      );
      assert(intervalAtPosition, `No interval found at position ${position}`);

      const macroAtPosition = topLevelMacros.find(
        macro => macro.startPos.outer === position,
      );

      if (macroAtPosition) {
        const { macro, attrs } = macroAtPosition;
        const startFrom = macroAtPosition.startPos.inner + left;
        const endAt = macroAtPosition.endPos.inner + left;
        const treatChildrenAsText = this.shouldTreatChildrenAsText(macro);

        output.push({
          type: 'macro',
          macro,
          attrs,
          startPos: {
            inner: startFrom,
            outer: macroAtPosition.startPos.outer + left,
          },
          endPos: {
            inner: endAt,
            outer: macroAtPosition.endPos.outer + left,
          },
          content: this.getTreeNodes(startFrom, endAt, treatChildrenAsText),
        });

        position = macroAtPosition.endPos.outer;
      } else {
        const textContent = chunk.substring(
          intervalAtPosition!.left,
          intervalAtPosition!.right,
        );
        const internalNodes = this.getTextNodes(
          textContent,
          treatChildrenAsText,
        );
        output.push(...internalNodes);

        position = intervalAtPosition!.right;
      }
    }

    return output;
  }

  private buildTextNodes(lines: string[]): TreeNodeText[] {
    const output: TreeNodeText[] = [];

    lines.forEach((line, index) => {
      output.push({
        type: 'text',
        text: line,
      });

      if (index + 1 < lines.length) {
        output.push({
          type: 'hardBreak',
        });
      }
    });

    return output;
  }

  /**
   * Parse text which doesn't contain macros
   */
  private getTextNodes(str: string, treatChildrenAsText): TreeNodeText[] {
    const output: TreeNodeText[] = [];

    if (treatChildrenAsText) {
      output.push({
        type: 'text',
        text: str,
      });

      return output;
    }

    const lines = str.split(NEWLINE);
    let textContainer: string[] = [];

    const processAndEmptyStoredText = () => {
      if (textContainer.length) {
        output.push({
          type: 'paragraph',
          content: this.buildTextNodes(textContainer),
        });

        textContainer = [];
      }
    };

    for (const line of lines) {
      // search for headings
      const headingMatches = line.match(HEADING_REGEXP);
      if (headingMatches) {
        processAndEmptyStoredText();

        output.push({
          type: 'heading',
          attrs: { level: headingMatches[1] },
          text: headingMatches[2],
        });

        continue;
      }

      if (line === '----') {
        processAndEmptyStoredText();

        output.push({ type: 'rule' });
        continue;
      }

      if (!line.length) {
        processAndEmptyStoredText();
        continue;
      }

      // TODO all other things

      textContainer.push(line);
    }

    // there can be some text stored after processing
    processAndEmptyStoredText();

    return output;
  }

  /**
   * Regex search for macro in the string
   */
  private findMacros(str: string): MacroMatch[] {
    const output: MacroMatch[] = [];

    for (const macro of KNOWN_MACRO) {
      // search for {macro} and {macro:with=attributes|etc}
      const regex = new RegExp(`{${macro}(:([^{]*?))?}`, 'g');
      let matches: RegExpExecArray | null;
      let matchCount = 0;
      let startPos: MacrosMatchPosition | undefined;
      let attrs: { [key: string]: string } | undefined;

      while ((matches = regex.exec(str)) !== null) {
        const position = matches.index;
        const attrsSerialized = matches[2] || '';
        const isOpeningMacros = matchCount % 2 === 0;

        if (isOpeningMacros) {
          startPos = {
            outer: position,
            inner: position + matches[0].length,
          };

          attrs = this.parseAttrs(attrsSerialized);
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

  /**
   * Convert wiki markup attrs into key->value pairs
   * @example "title=Sparta|color=red" -> {title: Sparta, color: red}
   */
  private parseAttrs(str: string) {
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
   * Remove matches which cannot belong to outer matches
   * For instance remove all inner matches for "code" macros
   */
  private cleanMatches(matches: MacroMatch[]): MacroMatch[] {
    // searching in ordered list is faster + it's easier
    const output = [...matches]
      .sort((a, b) => a.startPos.outer - b.startPos.outer) // sort by start position
      .filter(a => a.startPos.outer !== a.endPos.outer); // remove bodyless macro

    for (let i = 0; i < output.length; i++) {
      const match = output[i];
      const { macro } = match;

      if (macro !== 'code' && macro !== 'noformat') {
        continue;
      }

      // remove internal macro
      const removeItems = this.calcRemoveMatches(
        output,
        match.startPos.outer,
        match.endPos.outer,
        i,
      );
      output.splice(i + 1, removeItems);
    }

    return output;
  }

  /**
   * Calculate number of macro matches between aPos and bPos
   */
  private calcRemoveMatches(
    matches: MacroMatch[],
    aPos: number,
    bPos: number,
    index: number,
  ): number {
    let output = 0;

    for (let i = index + 1; i < matches.length; i++) {
      const match = matches[i];

      if (match.startPos.outer > aPos && match.endPos.outer < bPos) {
        output++;
      }
    }

    return output;
  }

  /**
   * Calculate all intervals that we have in the string
   * All these intervals should be converted to ADF
   */
  private calcIntervals(str: string, macro: MacroMatch[]): SimpleInterval[] {
    const output: SimpleInterval[] = [];
    const positions: Set<number> = new Set([0, str.length]);

    for (const macros of macro) {
      positions.add(macros.startPos.outer);
      positions.add(macros.endPos.outer);
    }

    const positionsArr = Array.from(positions).sort((a, b) => a - b);
    for (let i = 1; i < positionsArr.length; i++) {
      const currentIndex = positionsArr[i];
      const prevIndex = positionsArr[i - 1];
      output.push({ left: prevIndex, right: currentIndex });
    }

    return output;
  }

  /**
   * Find upper level macros which live inside current macro
   * For instance if we have "AD" macro which has "BD" and "CD" macros inside then
   * upper level macros wil be ["BD"]
   */
  private findUpperLevelMacros(
    interval: SimpleInterval,
    allMatches: MacroMatch[],
  ): MacroMatch[] {
    // assume all matches are sorted by starting position
    assert(
      isStartPositionSorted(allMatches),
      'Macros matches are not sorted by starting position',
    );

    const output: MacroMatch[] = [];
    let position = interval.left;

    while (position < interval.right) {
      // find macro which starts max close to current
      // we don't have intersecting macros
      const nearestStartingMacros = this.findMacrosStartingCloseTo(
        allMatches,
        position,
        interval.right,
      );

      if (!nearestStartingMacros.length) {
        break;
      }

      const longestMacro = this.findLongestMacro(nearestStartingMacros);

      output.push(longestMacro);
      position = longestMacro.endPos.outer;
    }

    return output;
  }

  /**
   * Find macros which start close to current (startPos is used for it)
   * For instance if we have "AE" with "BC" and "BD" and "DE" in it, it should
   * return "BC" and "BD" if startPos is "A"
   */
  private findMacrosStartingCloseTo(
    macros: MacroMatch[],
    left: number,
    right: number,
  ): MacroMatch[] {
    // assume all matches are sorted by starting position
    assert(
      isStartPositionSorted(macros),
      'Macros matches are not sorted by starting position',
    );

    const output: MacroMatch[] = [];
    let closestPosition: number | undefined;

    for (const macro of macros) {
      // skip previous macros
      if (macro.startPos.outer < left) {
        continue;
      }

      // don't need macros which start after current macro
      if (macro.startPos.outer > right) {
        break;
      }

      if (!closestPosition) {
        closestPosition = macro.startPos.outer;
        output.push(macro);
      } else if (macro.startPos.outer === closestPosition) {
        output.push(macro);
      }
    }

    return output;
  }

  private findLongestMacro(macros: MacroMatch[]): MacroMatch {
    assert(macros.length, 'Macros matches list is empty');

    const output = macros.reduce((memo: MacroMatch | null, macro) => {
      if (!memo) {
        return macro;
      }

      const outputLength = memo.endPos.inner - memo.startPos.inner;
      const currentMacroLength = macro.endPos.inner - macro.startPos.inner;

      return currentMacroLength > outputLength ? macro : memo;
    }, null);

    return output!;
  }

  private shouldTreatChildrenAsText(macro: MacroName): boolean {
    return macro === 'code' || macro === 'noformat';
  }
}
