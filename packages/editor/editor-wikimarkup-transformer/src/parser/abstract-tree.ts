import { Mark, Node as PMNode, Schema } from 'prosemirror-model';

import { MacroName, RichInterval } from '../interfaces';

import { getCodeLanguage } from './code-language';
import {
  getResolvedMacroIntervals,
  getResolvedTextIntervals,
} from './intervals';
import { isSpecialMacro } from './special';

const BLOCKQUOTE_LINE_REGEXP = /^bq\.\s(.+)/;
const HEADING_REGEXP = /^h([1|2|3|4|5|6]+)\.\s(.+)/;
const HORIZONTAL_RULE = '----';

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
    const {
      code,
      em,
      strike,
      strong,
      subsup,
      textColor,
      underline,
    } = this.schema.marks;
    const intervals = getResolvedTextIntervals(text);

    return intervals.map(({ effects, text }) => {
      const marks: Mark[] = effects.map(({ name, attrs }) => {
        switch (name) {
          case 'color':
            return textColor.create(attrs);

          case 'emphasis':
          case 'citation':
            return em.create();

          case 'deleted':
            return strike.create();

          case 'strong':
            return strong.create();

          case 'inserted':
            return underline.create();
          case 'superscript':
            return subsup.create({ type: 'sup' });
          case 'subscript':
            return subsup.create({ type: 'sub' });
          case 'monospaced':
            return code.create();

          default:
            throw new Error(`Unknown effect: ${name}`);
        }
      });

      // some marks cannot be used together with others
      // for instance "code" cannot be used with "bold" or "textColor"
      // addToSet() takes care of these rules
      const marksSet = marks.length ? marks[0].addToSet(marks.slice(1)) : [];
      return this.schema.text(text, marksSet);
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
}
