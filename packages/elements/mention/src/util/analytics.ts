import {
  UIAnalyticsEventInterface,
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next-types';
import { GasPayload } from '@atlaskit/analytics-gas-types';

import { ELEMENTS_CHANNEL } from '../constants';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import { isSpecialMentionText } from '../types';

export const fireAnalyticsMentionTypeaheadEvent = (
  props: WithAnalyticsEventProps,
) => (
  action: string,
  duration: number,
  userIds: string[] = [],
  query?: string,
): void => {
  if (props.createAnalyticsEvent) {
    const eventPayload: GasPayload = {
      action,
      actionSubject: 'mentionTypeahead',
      attributes: {
        packageName,
        packageVersion,
        componentName: 'mention',
        duration: Math.round(duration),
        userIds,
        query,
      },
      eventType: 'operational',
    };
    const analyticsEvent: UIAnalyticsEventInterface = props.createAnalyticsEvent(
      eventPayload,
    );
    analyticsEvent.fire(ELEMENTS_CHANNEL);
  }
};

export const fireAnalyticsMentionEvent = (
  createEvent: CreateUIAnalyticsEventSignature,
) => (
  actionSubject: string,
  action: string,
  text: string,
  id: string,
  accessLevel?: string,
): UIAnalyticsEventInterface => {
  const payload: GasPayload = {
    action,
    actionSubject,
    eventType: 'ui',
    attributes: {
      packageName,
      packageVersion,
      componentName: 'mention',
      accessLevel,
      isSpecial: isSpecialMentionText(text),
      userId: id,
    },
  };
  const event = createEvent(payload);
  event.fire(ELEMENTS_CHANNEL);
  return event;
};

// OLD Analytics
const MENTION_ANALYTICS_PREFIX = 'atlassian.fabric.mention';

export const fireAnalytics = (firePrivateAnalyticsEvent?: Function) => (
  eventName: string,
  text: string,
  accessLevel?: string,
) => {
  if (firePrivateAnalyticsEvent) {
    firePrivateAnalyticsEvent(`${MENTION_ANALYTICS_PREFIX}.${eventName}`, {
      accessLevel,
      isSpecial: isSpecialMentionText(text),
    });
  }
};
