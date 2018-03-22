import * as assert from 'assert';
import { Node as PMNode, Schema, NodeType } from 'prosemirror-model';
import { parse as parseQuery } from 'querystring';

import {
  MacroName,
  MacroMatch,
  MacrosMatchPosition,
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
   * Build text intervals list from wiki markup
   */
  getTextIntervals(): RichInterval[] {
    const macros = this.findMacros(this.wikiMarkup);
    const textIntervals = getResolvedIntervals(this.wikiMarkup, macros);

    return textIntervals.map(({ macros, text }) => {
      const simpleMacro = macros.pop();
      const treatChildrenAsText = Boolean(
        simpleMacro && this.shouldTreatChildrenAsText(simpleMacro.macro),
      );

      return {
        text,
        macro: simpleMacro,
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
  private getProseMirrorMacroNode(
    macro: MacroName,
    attrs: { [key: string]: string },
    content: PMNode[],
  ): PMNode {
    const { blockquote, codeBlock, panel } = this.schema.nodes;

    if (macro === 'code') {
      return codeBlock.createChecked(
        { language: getCodeLanguage(attrs) },
        content,
      );
    }

    if (macro === 'noformat') {
      return codeBlock.createChecked({}, content);
    }

    if (macro === 'panel') {
      return panel.createChecked({ panelType: 'info' }, content);
    }

    if (macro === 'quote') {
      return blockquote.createChecked({}, content);
    }

    throw new Error(`Unknown macro type: ${macro}`);
  }

  /**
   * Convert macros tree into prosemirror tree
   * Main recursive function
   */
  private getProseMirrorNodes(intervals: RichInterval[]): PMNode[] {
    const output: PMNode[] = [];

    for (const interval of intervals) {
      const { macro, content } = interval;

      if (macro) {
        const { attrs, macro: macroName } = macro;
        const macroPMNode = this.getProseMirrorMacroNode(
          macroName,
          attrs,
          content,
        );

        output.push(macroPMNode);
      } else {
        output.push(...content);
      }
    }

    return output;
  }

  /**
   * Combine text nodes with hardBreaks between them
   */
  private buildTextNodes(lines: string[]): PMNode[] {
    const { hardBreak } = this.schema.nodes;
    const output: PMNode[] = [];

    lines.forEach((line, index) => {
      const textNode = this.schema.text(line);
      output.push(textNode);

      if (index + 1 < lines.length) {
        const brNode = hardBreak.createChecked();
        output.push(brNode);
      }
    });

    return output;
  }

  /**
   * Parse text which doesn't contain macros
   */
  private getTextNodes(str: string, treatChildrenAsText): PMNode[] {
    const { blockquote, heading, paragraph, rule } = this.schema.nodes;
    const output: PMNode[] = [];

    if (treatChildrenAsText) {
      const textNode = this.schema.text(str);
      output.push(textNode);

      return output;
    }

    const lines = str.split(NEWLINE);
    let textContainer: string[] = [];

    const processAndEmptyStoredText = () => {
      if (textContainer.length) {
        const paragraphNode = paragraph.createChecked(
          {},
          this.buildTextNodes(textContainer),
        );
        output.push(paragraphNode);

        textContainer = [];
      }
    };

    for (const line of lines) {
      // convert HORIZONTAL_RULE to rule
      if (line === HORIZONTAL_RULE) {
        processAndEmptyStoredText();

        const hrNode = rule.createChecked();
        output.push(hrNode);

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

        const headingNode = heading.createChecked(
          { level: headingMatches[1] },
          this.schema.text(headingMatches[2]),
        );

        output.push(headingNode);
        continue;
      }

      // search for blockquote line
      const lineBlockQuoteMatches = lineUpdated.match(BLOCKQUOTE_LINE_REGEXP);
      if (lineBlockQuoteMatches) {
        processAndEmptyStoredText();

        const paragraphNode = paragraph.createChecked(
          {},
          this.schema.text(lineBlockQuoteMatches[1]),
        );
        const blockquoteNode = blockquote.createChecked({}, paragraphNode);

        output.push(blockquoteNode);
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
