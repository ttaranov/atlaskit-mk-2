/**
 * Inspired by analytics-web-react
 */

declare namespace merge {

}

import * as last from 'lodash.last';
import * as merge from 'lodash.merge';

import {
  UI_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
  GasPayload,
} from '@atlaskit/analytics-gas-types';

import {
  getSources,
  getActionSubject,
  getExtraAttributes,
  getPackageInfo,
  getComponents,
} from './extract-data-from-event';
import { EventNextType } from '../types';
import Logger from '../helpers/logger';
import { version as listenerVersion } from '../../package.json';

const NAVIGATION_TAG = 'navigation';

/**
 * This util exists to convert the analytics-next event format into the analytics platform format.
 *
 * Analytics-next event format:
 * event {
 *      payload: {
 *          ...attributesFromLowestPointInTheTree
 *      },
 *      context: [{
 *          ...attributesFromHighestPointInTheTree
 *      }, {
 *          ...attributesFromSecondHighestPointInTheTree
 *      }]
 * }
 *
 * Analytics platform event format:
 *  event {
 *      type: @atlaskit/analytics-gas-types.EventType
 *      payload {
 *          ...mandatoryAttributesBasedOnEventType
 *          attributes: {
 *              ...arbitraryAttributes
 *          }
 *      }
 *  }
 */

export default (event: EventNextType, logger: Logger): GasPayload | null => {
  const sources = getSources(event);
  const source = last(sources) || 'unknown';
  const extraAttributes = getExtraAttributes(event);
  const components = getComponents(event);

  const packages = getPackageInfo(event);
  const { packageName, packageVersion } =
    last(getPackageInfo(event)) || ({} as any);
  const packageHierarchy = packages.map(
    p =>
      p.packageVersion ? `${p.packageName}@${p.packageVersion}` : p.packageName,
  );

  const {
    eventType = UI_EVENT_TYPE,
    action,
    actionSubjectId,
    attributes: payloadAttributes,
  } = event.payload;
  const attributes = {
    listenerVersion,
    sourceHierarchy: sources.join('.') || undefined,
    componentHierarchy: components.join('.') || undefined,
    packageHierarchy: packageHierarchy.join(',') || undefined,
    ...{ packageName, packageVersion },
    ...merge(extraAttributes, payloadAttributes),
  };
  // Ensure navigation tag is not duplicated by using Set
  const tags: Set<string> = new Set(event.payload.tags || []);
  tags.add(NAVIGATION_TAG);

  if (event.payload) {
    if (eventType === UI_EVENT_TYPE) {
      return {
        eventType,
        source,
        actionSubject: getActionSubject(event),
        action,
        actionSubjectId,
        attributes,
        tags: Array.from(tags),
      } as any;
    }

    if (
      eventType === TRACK_EVENT_TYPE ||
      eventType === OPERATIONAL_EVENT_TYPE ||
      eventType === SCREEN_EVENT_TYPE
    ) {
      logger.error(
        'Track, screen and operational events are currently not supported for navigation events',
      );
    } else {
      logger.error('Invalid event type', eventType);
    }
  }

  return null;
};
