import {
  DEFAULT_SOURCE,
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { ELEMENTS_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import {
  ObjectType,
  UIAnalyticsEventInterface,
} from '@atlaskit/analytics-next-types';
import * as merge from 'lodash.merge';

const extractFieldsFromContext = (fieldsToPick: string[]) => (
  contexts: Array<ObjectType>,
) =>
  contexts
    .map(ctx =>
      fieldsToPick.reduce(
        (result, key) =>
          ctx[key] ? merge(result, { [key]: ctx[key] }) : result,
        {},
      ),
    )
    .reduce((result, item) => merge(result, item), {});

const fieldExtractor = extractFieldsFromContext([
  'source',
  'objectType',
  'objectId',
  'containerType',
  'containerId',
  ELEMENTS_CONTEXT,
]);

const updatePayloadWithContext = (
  event: UIAnalyticsEventInterface,
): GasPayload | GasScreenEventPayload => {
  if (event.context.length === 0) {
    return { source: DEFAULT_SOURCE, ...event.payload } as
      | GasPayload
      | GasScreenEventPayload;
  }
  const {
    [ELEMENTS_CONTEXT]: attributes,
    ...fields
  }: ObjectType = fieldExtractor(event.context);

  if (attributes) {
    event.payload.attributes = merge(
      attributes,
      event.payload.attributes || {},
    );
  }
  return { source: DEFAULT_SOURCE, ...fields, ...event.payload } as
    | GasPayload
    | GasScreenEventPayload;
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
