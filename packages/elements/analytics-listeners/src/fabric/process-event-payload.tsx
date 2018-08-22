import * as merge from 'lodash.merge';
import { ELEMENTS_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { GasPayload } from '@atlaskit/analytics-gas-types';

// merge all context objects from left to right. In case of attribute conflict the right one takes precedence
const processContext = (contexts: Array<{}>) =>
  contexts
    .filter(ctx => !!ctx[ELEMENTS_CONTEXT])
    .map(ctx => ctx[ELEMENTS_CONTEXT])
    .reduce((result, item) => merge(result || {}, item), {});

const updatePayloadWithContext = (event: {
  payload: GasPayload;
  context: Array<{}>;
}) => {
  if (event.context.length === 0) {
    return event.payload;
  }
  const mergedContext: any = processContext(event.context);
  event.payload.attributes = merge(
    mergedContext,
    event.payload.attributes || {},
  );
  return event.payload;
};

const addTag = (tag: string, originalTags?: string[]): string[] => {
  const tags = new Set(originalTags || []);
  tags.add(tag);
  return Array.from(tags);
};

export const processEventPayload = (event, tag) => {
  return {
    ...updatePayloadWithContext(event),
    tags: addTag(tag, event.payload.tags),
  };
};
