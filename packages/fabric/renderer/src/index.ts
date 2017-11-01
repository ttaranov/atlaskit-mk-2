import { defaultSchema } from '@atlaskit/editor-common';
import {
  Node as PMNode,
  Schema,
} from 'prosemirror-model';

import {
  getValidDocument,
} from './validator';

import { Serializer } from './serializer';

// export { default as ReactSerializer } from './react';
// export { default as TextSerializer } from './text';
// export { default as ReactRenderer } from '../ui/Renderer';
// export { RendererContext } from './react';

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

export const renderDocument = <T>(doc: any, serializer: Serializer<T>, schema: Schema = defaultSchema): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const {
    output: validDoc,
    time: sanitizeTime,
  } = withStopwatch(() => getValidDocument(doc, schema));

  // save sanitize time to stats
  stat.sanitizeTime = sanitizeTime;

  if (!validDoc) {
    return { stat, result: null };
  }

  const {
    output: node,
    time: buildTreeTime,
  } = withStopwatch<PMNode>(() => schema.nodeFromJSON(validDoc));

  // save build tree time to stats
  stat.buildTreeTime = buildTreeTime;

  const {
    output: result,
    time: serializeTime,
  } = withStopwatch<T | null>(() => serializer.serializeFragment(node.content));

  // save serialize tree time to stats
  stat.serializeTime = serializeTime;

  return { result, stat };
};

export { Serializer };

// TODO remove these exports when React renderer is finally extracted from editor-core
export { getMarksByOrder, isSameMark } from './validator';
