import * as merge from 'lodash.merge';
import { ELEMENTS_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import {
  ObjectType,
  UIAnalyticsEventInterface,
} from '@atlaskit/analytics-next-types';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

// merge all context objects from left to right. In case of attribute conflict the right one takes precedence
const processContext = (contexts: Array<ObjectType>) =>
  contexts
    .filter(ctx => !!ctx[ELEMENTS_CONTEXT])
    .map(ctx => ctx[ELEMENTS_CONTEXT])
    .reduce((result, item) => merge(result || {}, item), {});

const updatePayloadWithContext = (
  event: UIAnalyticsEventInterface,
): GasPayload | GasScreenEventPayload => {
  if (event.context.length === 0) {
    return event.payload as GasPayload | GasScreenEventPayload;
  }
  const mergedContext: any = processContext(event.context);
  event.payload.attributes = merge(
    mergedContext,
    event.payload.attributes || {},
  );
  return event.payload as GasPayload | GasScreenEventPayload;
};

const addTag = (tag: string, originalTags?: string[]): string[] => {
  const tags = new Set(originalTags || []);
  tags.add(tag);
  return Array.from(tags);
};

export const processEventPayload = (
  event: UIAnalyticsEventInterface,
  tag: string,
): GasPayload | GasScreenEventPayload => {
  return {
    ...updatePayloadWithContext(event),
    tags: addTag(tag, event.payload.tags),
  };
};
