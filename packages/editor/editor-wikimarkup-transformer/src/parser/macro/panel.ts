import { Node as PMNode, Schema } from 'prosemirror-model';
import { parseString } from '../text';
import { normalizePMNodes } from '../utils/normalize';
import { title } from '../utils/title';

import { getPanelType } from './panel-type';
import { TokenErrCallback } from '../tokenize';

const allowedNodeType = ['paragraph', 'heading', 'orderedList', 'bulletList'];

export function panelMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
  tokenErrCallback?: TokenErrCallback,
): PMNode[] {
  const output: PMNode[] = [];

  const nodeAttrs = {
    ...attrs,
    panelType: getPanelType(attrs),
  };

  if (attrs.title) {
    output.push(title(attrs.title, schema));
  }

  const content = parseString(rawContent, schema, [], tokenErrCallback);
  const normalizedContent = normalizePMNodes(content, schema);
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

  return output.length ? output : [emptyPanel(schema)];
}

function emptyPanel(schema: Schema) {
  const p = schema.nodes.paragraph.createChecked();
  return schema.nodes.panel.createChecked({}, p);
}
