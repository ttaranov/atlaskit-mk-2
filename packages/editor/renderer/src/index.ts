import {
  defaultSchema,
  getValidDocument,
  getValidNode,
  ADNode,
  ADFStage,
  ParsedADNode,
  convertToValidatedDoc,
  validateNode,
} from '@atlaskit/editor-common';
import { Node as PMNode, Schema, Fragment } from 'prosemirror-model';

import { Serializer } from './serializer';

export { default as ReactSerializer, BreakoutProvider } from './react';
export { default as TextSerializer } from './text';
export { default as EmailSerializer } from './email';

export { default as ReactRenderer } from './ui/Renderer';
export { RendererContext } from './react';
export { ADFEncoder } from './utils';

export interface RenderOutput<T> {
  result: T;
  stat: RenderOutputStat;
}

export interface RenderOutputStat {
  buildTreeTime?: number;
  sanitizeTime: number;
  serializeTime?: number;
}

export interface ResultWithTime<T> {
  output: T;
  time: number;
}

export interface DocumentContentError {
  type: 'DocumentContent';
  nodes: ADNode[];
}

export type RendererError = DocumentContentError;

const SUPPORTS_HIRES_TIMER_API = window.performance && performance.now;

const withStopwatch = <T>(cb: () => T): ResultWithTime<T> => {
  const startTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const output = cb();
  const endTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const time = endTime - startTime;

  return { output, time };
};

const collectInvalidNodes = (node: ParsedADNode): ADNode[] => {
  let invalid: ADNode[] = [];
  if (!node.valid && node.originalNode) {
    invalid.push(node.originalNode);
  }

  if (node.content) {
    node.content.forEach(child => {
      invalid = invalid.concat(collectInvalidNodes(child));
    });
  }

  return invalid;
};

export const renderDocument = <T>(
  doc: any,
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
  onValidationError?: (error: DocumentContentError) => void,
): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const { output: validatedDoc, time: sanitizeTime } = withStopwatch(() =>
    convertToValidatedDoc(doc, schema, adfStage),
  );

  // save sanitize time to stats
  stat.sanitizeTime = sanitizeTime;

  // only bother collecting invalid nodes if we have a handler for them
  if (onValidationError) {
    const invalidNodes = collectInvalidNodes(validatedDoc);
    if (invalidNodes.length) {
      onValidationError({
        type: 'DocumentContent',
        nodes: invalidNodes,
      });
    }
  }

  const validDoc = getValidDocument(validatedDoc);
  if (!validDoc) {
    return { stat, result: null };
  }

  const { output: node, time: buildTreeTime } = withStopwatch<PMNode>(() => {
    const pmNode = schema.nodeFromJSON(validDoc);
    pmNode.check();
    return pmNode;
  });

  // save build tree time to stats
  stat.buildTreeTime = buildTreeTime;

  const { output: result, time: serializeTime } = withStopwatch<T | null>(() =>
    serializer.serializeFragment(node.content),
  );

  // save serialize tree time to stats
  stat.serializeTime = serializeTime;

  return { result, stat };
};

export const renderNodes = <T>(
  nodes: ADNode[],
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  target?: any,
  adfStage: ADFStage = 'final',
): T | null => {
  const validNodes = nodes.map(n =>
    getValidNode(validateNode(n, schema, adfStage), true),
  );

  const pmFragment = Fragment.fromJSON(schema, validNodes);

  return serializer.serializeFragment(pmFragment, {}, target, 'node-0');
};

export { Serializer };
