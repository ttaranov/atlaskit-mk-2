import * as React from 'react';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';

const getAnalyticsComponent = (screenCounter, searchSessionId, analyticsKey) =>
  screenCounter ? (
    <AnalyticsEventFiredOnMount
      key={analyticsKey}
      onEventFired={() => screenCounter.increment()}
      payloadProvider={() =>
        buildScreenEvent(
          Screen.POST_QUERY,
          screenCounter.getCount(),
          searchSessionId,
        )
      }
    />
  ) : null;

export const PreQueryAnalyticsComponent = ({
  screenCounter,
  searchSessionId,
}) =>
  getAnalyticsComponent(screenCounter, searchSessionId, 'preQueryScreenEvent');

export const PostQueryAnalyticsComponent = ({
  screenCounter,
  searchSessionId,
}) =>
  getAnalyticsComponent(screenCounter, searchSessionId, 'postQueryScreenEvent');
