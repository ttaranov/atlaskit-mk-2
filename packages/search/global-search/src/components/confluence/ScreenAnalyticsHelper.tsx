import * as React from 'react';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';

const getAnalyticsComponent = (
  subscreen: Screen,
  screenCounter,
  searchSessionId,
  analyticsKey,
  referralContextIdentifiers,
) =>
  screenCounter ? (
    <AnalyticsEventFiredOnMount
      key={analyticsKey}
      onEventFired={() => screenCounter.increment()}
      payloadProvider={() =>
        buildScreenEvent(
          subscreen,
          screenCounter.getCount(),
          searchSessionId,
          referralContextIdentifiers,
        )
      }
    />
  ) : null;

export const PreQueryAnalyticsComponent = ({
  screenCounter,
  searchSessionId,
  referralContextIdentifiers,
}) =>
  getAnalyticsComponent(
    Screen.PRE_QUERY,
    screenCounter,
    searchSessionId,
    'preQueryScreenEvent',
    referralContextIdentifiers,
  );

export const PostQueryAnalyticsComponent = ({
  screenCounter,
  searchSessionId,
  referralContextIdentifiers,
}) =>
  getAnalyticsComponent(
    Screen.POST_QUERY,
    screenCounter,
    searchSessionId,
    'postQueryScreenEvent',
    referralContextIdentifiers,
  );
