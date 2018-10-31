import { Node as PMNode, Schema } from 'prosemirror-model';
import { Token, TokenErrCallback } from '.';
import { commonMacro } from './common-macro';
import { parseString } from '../text';
import { parseAttrs } from '../utils/attrs';
import { normalizePMNodes } from '../utils/normalize';
import { getPanelType } from '../utils/panel-type';
import { title } from '../utils/title';

const allowedNodeType = ['paragraph', 'heading', 'orderedList', 'bulletList'];

export function panelMacro(
  input: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token {
  return commonMacro(input, schema, {
    opening: /^\{panel(?::([^\{\n\}]*))?\}/,
    closing: /\{panel\}/,
    rawContentProcessor,
    tokenErrCallback,
  });
}

const rawContentProcessor = (
  rawAttrs: string,
  rawContent: string,
  length: number,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): Token => {
  const output: PMNode[] = [];
  const parsedAttrs = parseAttrs(rawAttrs);
  const nodeAttrs = {
    ...parsedAttrs,
    panelType: getPanelType(parsedAttrs),
  };

  if (parsedAttrs.title) {
    output.push(title(parsedAttrs.title, schema));
  }

  const parsedContent = parseString(rawContent, schema, [], tokenErrCallback);

  const normalizedContent = normalizePMNodes(parsedContent, schema);
  let contentBuffer: PMNode[] = [];

  for (const n of normalizedContent) {
    if (allowedNodeType.indexOf(n.type.name) !== -1) {
      contentBuffer.push(n);
    } else {
      const panelNode = schema.nodes.panel.createChecked(
        nodeAttrs,
        contentBuffer.length
          ? contentBuffer
          : schema.nodes.paragraph.createChecked(),
      );
      contentBuffer = [];
      output.push(panelNode);
      output.push(n);
    }
  }

  if (contentBuffer.length > 0) {
    const panelNode = schema.nodes.panel.createChecked(
      nodeAttrs,
      contentBuffer,
    );
    output.push(panelNode);
  }

  return {
    type: 'pmnode',
    nodes: output.length ? output : [emptyPanel(schema)],
    length,
  };
};

function emptyPanel(schema: Schema) {
  const p = schema.nodes.paragraph.createChecked();
  return schema.nodes.panel.createChecked({}, p);
}
