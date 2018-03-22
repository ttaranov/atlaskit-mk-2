import * as assert from 'assert';
import { Node as PMNode, Schema, NodeType } from 'prosemirror-model';
import { parse as parseQuery } from 'querystring';

import {
  MacroName,
  MacroMatch,
  MacrosMatchPosition,
  NodeText,
  RichInterval,
} from '../interfaces';

import { getCodeLanguage } from './code-language';
import { getResolvedIntervals } from './intervals';

const BLOCKQUOTE_LINE_REGEXP = /^bq\.\s(.+)/;
const HEADING_REGEXP = /^h([1|2|3|4|5|6]+)\.\s(.+)/;
const HORIZONTAL_RULE = '----';
const KNOWN_MACRO: MacroName[] = ['code', 'noformat', 'panel', 'quote'];
const NEWLINE = '\n';

export default class AbstractTree {
  private schema: Schema;
  private wikiMarkup: string;

  constructor(schema: Schema, wikiMarkup: string) {
    this.schema = schema;
    this.wikiMarkup = wikiMarkup;
  }

  /**
   * Build raw (not reduced) macros tree from wiki markup
   */
  getTextIntervals(): RichInterval[] {
    const macros = this.findMacros(this.wikiMarkup);
    const textIntervals = getResolvedIntervals(this.wikiMarkup, macros);

    return textIntervals.map(({ macros, text }) => {
      const treatChildrenAsText =
        macros.length &&
        this.shouldTreatChildrenAsText(macros[macros.length - 1].macro);

      return {
        macros,
        text,
        content: this.getTextNodes(text, treatChildrenAsText),
      };
    });
  }

  /**
   * Convert reduced macros tree into prosemirror model tree
   */
  getProseMirrorModel(): PMNode {
    const textIntervals = this.getTextIntervals();

    return this.schema.nodes.doc.createChecked(
      {},
      this.getProseMirrorNodes(textIntervals),
    );
  }

  /**
   * Creates prosemirror node from macro
   */
  // private getProseMirrorMacroNode(node: TreeNodeMacro): PMNode {
  //   const { blockquote, codeBlock, panel } = this.schema.nodes;
  //   const content = this.getProseMirrorNodes(node);

  //   if (node.macro === 'code') {
  //     return codeBlock.createChecked(
  //       { language: getCodeLanguage(node.attrs) },
  //       content,
  //     );
  //   }

  //   if (node.macro === 'noformat') {
  //     return codeBlock.createChecked({}, content);
  //   }

  //   if (node.macro === 'panel') {
  //     return panel.createChecked({ panelType: 'info' }, content);
  //   }

  //   if (node.macro === 'quote') {
  //     return blockquote.createChecked({}, content);
  //   }

  //   throw new Error(`Unknown macro type: ${node.macro}`);
  // }

  /**
   * Convert macros tree into prosemirror tree
   * Main recursive function
   */
  private getProseMirrorNodes(intervals: RichInterval[]): PMNode[] {
    const output: PMNode[] = [];
    // assert(root.content!.length, 'Node content property is absent');

    // for (const node of root.content!) {
    //   const pmNode =
    //     node.type === 'macro'
    //       ? this.getProseMirrorMacroNode(node)
    //       : this.schema.nodeFromJSON(node);

    //   output.push(pmNode);
    // }

    return output;
  }

  /**
   * Combine text nodes with hardBreaks between them
   */
  private buildTextNodes(lines: string[]): NodeText[] {
    const output: NodeText[] = [];

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
  private getTextNodes(str: string, treatChildrenAsText): NodeText[] {
    const output: NodeText[] = [];

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
      // convert HORIZONTAL_RULE to rule
      if (line === HORIZONTAL_RULE) {
        processAndEmptyStoredText();

        output.push({ type: 'rule' });
        continue;
      }

      // empty line means the end of the paragraph
      if (!line.length) {
        processAndEmptyStoredText();
        continue;
      }

      let lineUpdated = line.replace(/---/g, '—').replace(/--/g, '–');

      // search for headings
      const headingMatches = lineUpdated.match(HEADING_REGEXP);
      if (headingMatches) {
        processAndEmptyStoredText();

        output.push({
          type: 'heading',
          attrs: { level: headingMatches[1] },
          content: [
            {
              type: 'text',
              text: headingMatches[2],
            },
          ],
        });

        continue;
      }

      // search for blockquote line
      const lineBlockQuoteMatches = lineUpdated.match(BLOCKQUOTE_LINE_REGEXP);
      if (lineBlockQuoteMatches) {
        processAndEmptyStoredText();

        output.push({
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: lineBlockQuoteMatches[1],
                },
              ],
            },
          ],
        });

        continue;
      }

      // TODO process lists
      // TODO process tables
      // TODO process images/attachments
      // TODO process {color} macro
      // TODO process \\ hardBreak
      // TODO process text effects and links

      textContainer.push(lineUpdated);
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

  private shouldTreatChildrenAsText(macro: MacroName): boolean {
    return macro === 'code' || macro === 'noformat';
  }
}
