import { Node as PMNode, Schema } from 'prosemirror-model';
import { createParagraphNodeFromInlineNodes } from '../nodes/paragraph';
import { parseWhitespace } from '../tokenize/whitespace';

export function normalizePMNodes(nodes: PMNode[], schema: Schema): PMNode[] {
  const output: PMNode[] = [];
  let inlineNodeBuffer: PMNode[] = [];
  for (const node of nodes) {
    if (!node.isBlock) {
      inlineNodeBuffer.push(node);
      continue;
    }
    if (inlineNodeBuffer.length > 0) {
      output.push(
        createParagraphNodeFromInlineNodes(
          trimInlineNodes(inlineNodeBuffer),
          schema,
        ),
      );
      inlineNodeBuffer = []; // clear buffer
    }
    output.push(node);
  }
  if (inlineNodeBuffer.length > 0) {
    output.push(
      createParagraphNodeFromInlineNodes(
        trimInlineNodes(inlineNodeBuffer),
        schema,
      ),
    );
  }
  if (nodes.length === 0) {
    return [createParagraphNodeFromInlineNodes([], schema)];
  }
  return output;
}

/**
 * Remove leading and trailing hardBreak
 */
function trimInlineNodes(nodes: PMNode[]) {
  let leadingNode = nodes.shift();
  while (leadingNode) {
    if (leadingNode.type.name !== 'hardBreak') {
      nodes.unshift(leadingNode);
      break;
    }
    leadingNode = nodes.shift();
  }

  let trailingNode = nodes.pop();
  while (trailingNode) {
    if (trailingNode.type.name !== 'hardBreak') {
      nodes.push(trailingNode);
      break;
    }
    trailingNode = nodes.pop();
  }

  return nodes;
}

export function isNextLineEmpty(input: string) {
  let index = 0;
  while (index < input.length) {
    const length = parseWhitespace(input);

    if (parseWhitespace(input) === 0) {
      return false;
    }
    if (parseWhitespace(input, true)) {
      return true;
    }

    index += length;
  }
  return true;
}
