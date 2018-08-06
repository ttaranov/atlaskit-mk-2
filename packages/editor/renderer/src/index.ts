import {
  defaultSchema,
  getValidDocument,
  getValidNode,
  ADNode,
  ADFStage,
} from '@atlaskit/editor-common';
import { Node as PMNode, Schema, Fragment, Slice } from 'prosemirror-model';
import { defaultSchema as schema } from '@atlaskit/editor-common';

import { Serializer } from './serializer';
import { InlineCommentLocator } from '../../editor-test-helpers/node_modules/@atlaskit/editor-core/src/types';

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

const SUPPORTS_HIRES_TIMER_API = window.performance && performance.now;

const withStopwatch = <T>(cb: () => T): ResultWithTime<T> => {
  const startTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const output = cb();
  const endTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const time = endTime - startTime;

  return { output, time };
};

/**
 * fake getInlineComments, inlineCommentProvider is a promise and can't be bothered to handle promises right now for the spike
 */
const FakeInlineCommentProvider = {
  getInlineComments(): InlineCommentLocator[] {
    return [
      {
        from: 124,
        to: 171,
      },
    ];
  },
};

export const renderDocument = <T>(
  doc: any,
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
  dataProviders: any,
): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const { output: validDoc, time: sanitizeTime } = withStopwatch(() =>
    getValidDocument(doc, schema, adfStage),
  );

  // save sanitize time to stats
  stat.sanitizeTime = sanitizeTime;

  if (!validDoc) {
    return { stat, result: null };
  }

  let { output: node, time: buildTreeTime } = withStopwatch<PMNode>(() => {
    const pmNode = schema.nodeFromJSON(validDoc);
    pmNode.check();
    return pmNode;
  });

  const getString = (doc, from, to) => {
    const position = doc.resolve(from);

    const nodeString = position.node().content.content[
      position.path[
        position.path.findIndex(node => node === position.node()) + 1
      ]
    ].text;
    if (to - from > position.textOffset) {
      // If the target is bigger than this node grab the whole string.
      return {
        theString: nodeString.substring(position.textOffset, nodeString.length),
        endOfStringPos: from + (nodeString.length - position.textOffset),
        strLength: nodeString.length,
      };
    }

    return [position.textOffset];
  };

  const injectIC = (doc, from, to, conversationId) => {
    const end = doc.resolve(to);

    // Would need to loop from start till end of the start pos node
    // Then replace that with a inline blcok node
    // continue with next pos + node all the way till we get to end
    const stringInfo = getString(doc, from, to);

    // const replaceResult = doc.replace(from, (stringInfo as any).endOfStringPos, new Slice(Fragment.empty, 0, 2))
    // console.log(replaceResult);
    console.log(getString(doc, from, to));

    return doc;
  };

  node = injectIC(node, 124, 171, 'abc');

  debugger;

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
  const validNodes = nodes.map(n => getValidNode(n, schema, adfStage));

  const pmFragment = Fragment.fromJSON(schema, validNodes);

  return serializer.serializeFragment(pmFragment, {}, target, 'node-0');
};

export { Serializer };
