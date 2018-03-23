import { Node as PMNode, Schema } from 'prosemirror-model';
import ListBuilder from './list-builder';

import { MacroName, RichInterval } from '../interfaces';
import { findTextAndEmoji } from './text';
import { getCodeLanguage } from './code-language';
import {
  getResolvedMacroIntervals,
  getResolvedTextIntervals,
} from './intervals';
import { isSpecialMacro } from './special';

const BLOCKQUOTE_LINE_REGEXP = /^bq\.\s(.+)/;
const HEADING_REGEXP = /^h([1|2|3|4|5|6]+)\.\s(.+)/;
const HORIZONTAL_RULE = '----';
const LIST_REGEXP = /^([*|-]+)\s+(.+)/;
const NEWLINE = '\n';
const DOUBLE_BACKSLASH = '\\\\';

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
    const textIntervals = getResolvedMacroIntervals(this.wikiMarkup);

    return textIntervals.map(({ macros, text }) => {
      const simpleMacro = macros.pop();
      const treatChildrenAsText = Boolean(
        simpleMacro && isSpecialMacro(simpleMacro.macro),
      );

      return {
        text,
        macro: simpleMacro,
        content: this.getTextNodes(text, treatChildrenAsText),
      };
    });
  }

  getTextWithMarks(text: string): PMNode[] {
    const intervals = getResolvedTextIntervals(text);
    const output: PMNode[] = [];

    for (const { effects, text } of intervals) {
      const textWithLineBreaks = text.split(DOUBLE_BACKSLASH);

      textWithLineBreaks.forEach((chunk, i) => {
        const inlineNodes = findTextAndEmoji(this.schema, chunk, effects);
        output.push(...inlineNodes);

        if (i + 1 < textWithLineBreaks.length) {
          const hardBreakNode = this.schema.nodes.hardBreak.createChecked();
          output.push(hardBreakNode);
        }
      });
    }

    return output;
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
      const textNodes = this.getTextWithMarks(line);
      output.push(...textNodes);

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
  private getTextNodes(str: string, treatChildrenAsText: boolean): PMNode[] {
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

    // Flag if currently processing a list
    let isProcessingList: boolean = false;
    let listBuilder: ListBuilder | null = null;
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
          this.getTextWithMarks(headingMatches[2]),
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
          this.getTextWithMarks(lineBlockQuoteMatches[1]),
        );
        const blockquoteNode = blockquote.createChecked({}, paragraphNode);

        output.push(blockquoteNode);
        continue;
      }

      // @TODO split ol/ul
      const listMatches = lineUpdated.match(LIST_REGEXP);
      if (listMatches) {
        const [, /* discard */ bullets, content] = listMatches;
        isProcessingList = true;

        if (!listBuilder) {
          listBuilder = new ListBuilder(this.schema, bullets);
        }

        const contentNode = this.getTextNodes(content, false);
        listBuilder.add(bullets, contentNode);
        continue;
      }

      // If it's not a match, but the last loop was a list, add the processed list and delete the builder
      if (isProcessingList) {
        isProcessingList = false;
        output.push(listBuilder!.buildPMNode());
        listBuilder = null;
      }

      // TODO process tables
      // TODO process images/attachments
      // TODO process {color} macro
      // TODO process \\ hardBreak
      // TODO process text effects and links

      textContainer.push(lineUpdated);
    }

    // If the list was the last item, make sure to push it
    if (isProcessingList) {
      output.push(listBuilder!.buildPMNode());
    }

    // there can be some text stored after processing
    processAndEmptyStoredText();

    return output;
  }
}
