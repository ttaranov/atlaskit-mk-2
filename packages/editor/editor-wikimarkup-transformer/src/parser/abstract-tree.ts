import { Node as PMNode, Schema, NodeType } from 'prosemirror-model';

import { Builder } from './builder/builder';
import ListBuilder from './builder/list-builder';
import TableBuilder, { AddCellArgs } from './builder/table-builder';

import { MacroName, RichInterval } from '../interfaces';
import { getProseMirrorNodeTypeForMacro } from './macros';
import { getCodeLanguage } from './code-language';
import { getResolvedMacroIntervals } from './intervals';
import { isSpecialMacro } from './special';
import { getTextWithMarks } from './text';
import { TEXT_COLOR_GREY } from './effects';

import getHeadingNodeView from './nodes/heading';
import getMediaNodeView from './nodes/media';
import getRuleNodeView from './nodes/rule';

// E.g. bq. foo -> [ "foo" ]
const BLOCKQUOTE_LINE_REGEXP = /^bq\.\s(.+)/;

// E.g. h1. foo -> [ "1", "foo" ]
const HEADING_REGEXP = /^h([1|2|3|4|5|6]+)\.\s(.+)/;

// E.g. !image.png! and !image.png|attrs!
const ATTACHMENTS_REGEXP = /^!(.+?)(\|(.+))?!$/;

// E.g. * foo -> [ "*", "foo" ]
const LIST_REGEXP = /^\s*([*\-#]+)\s+(.+)/;

// E.g. | foo -> [ "|" ] (line STARTS WITH table)
const TABLE_REGEXP = /^\s*[|]+/;

// E.g. || foo || bar -> [ "|| foo", "||", "foo" ] (invoke multiple times with .exec)
const TABLE_CELL_REGEXP = /([|]+)([^|]*)/g;

// E.g. foo || -> [ "foo ||", "foo " ] - Match content from a multiline row up to the cell line
const NEWLINE_CELL_REGEXP = /^([^|]*)[|]/;

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
      const hasMultipleMacros = macros.length > 1;
      const simpleMacro = macros.shift();

      const treatChildrenAsText = Boolean(
        simpleMacro && isSpecialMacro(simpleMacro.macro),
      );

      const containerNodeType = simpleMacro
        ? getProseMirrorNodeTypeForMacro(this.schema, simpleMacro.macro)
        : null;

      return {
        text,
        macro: simpleMacro,
        content: this.getTextNodes(
          text,
          treatChildrenAsText,
          containerNodeType,
          hasMultipleMacros,
        ),
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
  private getProseMirrorMacroNodes(
    macro: MacroName,
    attrs: { [key: string]: string },
    content: PMNode[],
  ): PMNode[] {
    const output: PMNode[] = [];
    const nodeType = getProseMirrorNodeTypeForMacro(this.schema, macro);
    const nodeAttrs: { [key: string]: any } = {};
    const isPanelWithTitle = macro === 'panel' && attrs.title;

    if (macro === 'code') {
      nodeAttrs.language = getCodeLanguage(attrs);
    } else if (macro === 'panel') {
      nodeAttrs.panelType = 'info';
    }

    if (isPanelWithTitle) {
      const headingNode = this.schema.nodes.heading.createChecked(
        { level: 1 },
        this.getTextWithMarks(attrs.title, false),
      );

      output.push(headingNode);
    }

    output.push(nodeType.createChecked(nodeAttrs, content));
    return output;
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
        const macroPMNodes = this.getProseMirrorMacroNodes(
          macroName,
          attrs,
          content,
        );

        output.push(...macroPMNodes);
      } else {
        output.push(...content);
      }
    }

    return output;
  }

  /**
   * Combine text nodes with hardBreaks between them
   */
  private buildTextNodes(lines: string[], useGreyText: boolean): PMNode[] {
    const { hardBreak } = this.schema.nodes;
    const output: PMNode[] = [];

    lines.forEach((line, index) => {
      const textNodes = this.getTextWithMarks(line, useGreyText);
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
  private getTextNodes(
    str: string,
    treatChildrenAsText: boolean,
    containerNodeType: NodeType | null,
    useGreyText: boolean,
  ): PMNode[] {
    const { blockquote, paragraph } = this.schema.nodes;
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
          this.buildTextNodes(textContainer, useGreyText),
        );
        output.push(paragraphNode);

        textContainer = [];
      }
    };

    // Flag if currently processing a block of content
    let isBuilding = false;
    let builders: Array<Builder> = [];
    for (const line of lines) {
      // convert HORIZONTAL_RULE to rule
      if (line === HORIZONTAL_RULE) {
        processAndEmptyStoredText();

        const hrNode = getRuleNodeView(this.schema, containerNodeType);
        output.push(hrNode);

        continue;
      }

      // empty line means the end of the paragraph
      if (!line.length) {
        processAndEmptyStoredText();

        // Close out any active builders
        if (isBuilding) {
          let builder: Builder | undefined;

          while ((builder = builders.pop())) {
            output.push(builder.buildPMNode());
          }

          isBuilding = false;
        }

        continue;
      }

      const lineUpdated = line.replace(/---/g, '—').replace(/--/g, '–');

      // search for headings
      const headingMatches = lineUpdated.match(HEADING_REGEXP);
      if (headingMatches) {
        processAndEmptyStoredText();

        const headingNode = getHeadingNodeView(
          this.schema,
          containerNodeType,
          { level: headingMatches[1] },
          headingMatches[2],
          useGreyText,
        );

        output.push(headingNode);
        continue;
      }

      // search for images/attachments
      const mediaMatches = lineUpdated.match(ATTACHMENTS_REGEXP);
      if (mediaMatches && mediaMatches[1].includes('.')) {
        processAndEmptyStoredText();

        const [, /* skip */ filename] = mediaMatches;
        if (
          !containerNodeType &&
          filename.includes('.') &&
          !/^https?:\/\//.test(filename)
        ) {
          const mediaNode = getMediaNodeView(this.schema, filename);
          output.push(mediaNode);

          continue;
        }
      }

      // search for blockquote line
      const lineBlockQuoteMatches = lineUpdated.match(BLOCKQUOTE_LINE_REGEXP);
      if (lineBlockQuoteMatches) {
        processAndEmptyStoredText();

        const paragraphNode = paragraph.createChecked(
          {},
          this.getTextWithMarks(lineBlockQuoteMatches[1], useGreyText),
        );
        const blockquoteNode = blockquote.createChecked({}, paragraphNode);

        output.push(blockquoteNode);
        continue;
      }

      // search for lists
      const listMatches = lineUpdated.match(LIST_REGEXP);
      if (listMatches) {
        const [, /* discard */ style, content] = listMatches;
        let builder = builders.pop();
        isBuilding = true;

        // If the current builder is a table, push it back on and start a new builder to nest in it
        if (builder && builder.type === 'table') {
          builders.push(builder);
          builder = undefined;
        }

        if (!builder) {
          builder = new ListBuilder(this.schema, style);
        } else {
          const type = ListBuilder.getType(style);

          // If it's top level and doesn't match, create a new list
          if (type !== builder.type && style.length === 1) {
            output.push(builder.buildPMNode());
            builder = new ListBuilder(this.schema, style);
          }
        }

        const contentNode = this.getTextWithMarks(content, useGreyText);
        builder.add([{ style, content: contentNode }]);
        builders.push(builder);
        continue;
      }

      // search for tables
      const tableMatches = lineUpdated.match(TABLE_REGEXP);
      if (tableMatches) {
        let builder = builders.pop();
        isBuilding = true;

        if (!builder) {
          builder = new TableBuilder(this.schema);
        } else {
          // If the current builder isn't a table, close it and add it to the last cell
          if (builder.type !== 'table') {
            const contentNode = builder.buildPMNode();
            builder = builders.pop() || new TableBuilder(this.schema);
            builder.add([{ style: null, content: [contentNode] }]);
          }
        }

        // Iterate over the cells
        builder.add(this.getTableCells(lineUpdated, useGreyText));
        builders.push(builder);
        continue;
      }

      // If it's not a match, but the last loop was part of a block, continue adding to it
      if (isBuilding) {
        const builder = builders.pop();
        let content: string;
        let additionalFields: any[] = [];

        if (builder instanceof TableBuilder) {
          const matches = lineUpdated.match(NEWLINE_CELL_REGEXP);
          // If it doesn't have a closing cell line, the whole line is part of the content
          content = (matches && matches[1]) || lineUpdated;

          // Get the other cells if any
          additionalFields = this.getTableCells(lineUpdated, useGreyText);
        } else {
          content = lineUpdated;
        }

        const contentNode = this.getTextWithMarks(content!, useGreyText);
        builder!.add([
          { style: null, content: contentNode },
          ...additionalFields,
        ]);
        builders.push(builder!);
        continue;
      }

      textContainer.push(lineUpdated);
    }

    // If a block of content was the last item, make sure to push it
    if (isBuilding) {
      let builder: Builder | undefined;

      while ((builder = builders.pop())) {
        output.push(builder.buildPMNode());
      }
    }

    // there can be some text stored after processing
    processAndEmptyStoredText();

    return output;
  }

  /**
   * Parse a line and split it into table cell args
   * @param {string} line
   * @returns {AddCellArgs[]}
   */
  private getTableCells(line: string, useGreyText: boolean): AddCellArgs[] {
    let match;
    const cells: AddCellArgs[] = [];
    while ((match = TABLE_CELL_REGEXP.exec(line)) !== null) {
      const [, /* discard */ style, content] = match;
      const contentNode = this.getTextWithMarks(content, useGreyText);
      cells.push({ style, content: contentNode });
    }
    return cells;
  }

  private getTextWithMarks(text: string, useGreyText: boolean) {
    const extraEffects = useGreyText ? [TEXT_COLOR_GREY] : [];
    return getTextWithMarks(this.schema, text, extraEffects);
  }
}
