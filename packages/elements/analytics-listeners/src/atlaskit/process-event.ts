/**
 * Copied largely from analytics-web-react
 */
// @ts-ignore
import * as last from 'lodash.last';
import {
  UI_EVENT_TYPE,
  SCREEN_EVENT_TYPE,
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';

import {
  getSources,
  getActionSubject,
  getExtraAttributes,
  getPackageInfo,
} from './extract-data-from-event';

/**
 * This util exists to convert the Atlaskit event format into the analytics platform format.
 *
 * Atlaskit event format:
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
 *      type: <"TRACK"|"SCREEN"|"UI"|"OPERATIONAL">
 *      payload {
 *          ...mandatoryAttributesBasedOnEventType
 *          attributes: {
 *              ...arbirtaryAttributes
 *          }
 *      }
 *  }
 */

export default event => {
  const sources = getSources(event);
  const source = last(sources);
  const extraAttributes = getExtraAttributes(event);
  const { packageName, packageVersion } = last(getPackageInfo(event)) as any;

  const {
    eventType,
    name,
    action,
    actionSubject,
    actionSubjectId,
    ...payloadToSend
  } = event.payload;
  const attributes = {
    namespaces: sources.join('.'),
    ...{ packageName, packageVersion },
    ...extraAttributes,
    ...payloadToSend,
  };

  if (event.payload) {
    if (eventType === UI_EVENT_TYPE) {
      return {
        eventType: eventType,
        source,
        actionSubject: getActionSubject(event),
        action,
        actionSubjectId: actionSubjectId,
        attributes,
      };
    }

    if (
      eventType === TRACK_EVENT_TYPE ||
      eventType === OPERATIONAL_EVENT_TYPE ||
      eventType === SCREEN_EVENT_TYPE
    ) {
      console.error(
        'Track, screen and operational events are currently not supported for atlaskit events',
      );
    }
  }

  return {
    source,
    action,
    actionSubject,
    attributes,
    eventType: undefined,
  };
};
