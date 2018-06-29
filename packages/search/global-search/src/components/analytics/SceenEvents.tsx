import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_CHANNEL,
} from '../../util/analytics';

export interface Props {
  searchSessionId: string;
  createAnalyticsEvent: Function;
}

export enum Screen {
  PRE_QUERY = 'globalSearchPreQueryDrawer',
  POST_QUERY = 'globalSearchPostQueryDrawer',
}

function buildScreenEvent(
  screen: Screen,
  timesViewed: number,
  searchSessionId: string,
): GasPayload {
  return {
    action: 'viewed',
    actionSubject: screen,
    eventType: 'screen',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      timesViewed: timesViewed,
      searchSessionId: searchSessionId,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  };
}

// counters for the number of times these events have fired.
// these can't live inside the component because it's reinitialised each time
// and the information is lost.
let preQueryViewCount = 0;
let postQueryViewCount = 0;

class PreQueryScreenEventComponent extends React.Component<Props> {
  componentDidMount() {
    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent();
      const searchSessionId = event.context[0]!.searchSessionId;
      const payload = buildScreenEvent(
        Screen.PRE_QUERY,
        preQueryViewCount,
        searchSessionId,
      );
      event.update(payload).fire(DEFAULT_GAS_CHANNEL);
      preQueryViewCount++;
    }
  }
  render() {
    return null;
  }
}

class PostQueryScreenEventComponent extends React.Component<Props> {
  componentDidMount() {
    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent();
      const searchSessionId = event.context[0]!.searchSessionId;
      const payload = buildScreenEvent(
        Screen.POST_QUERY,
        postQueryViewCount,
        searchSessionId,
      );
      event.update(payload).fire(DEFAULT_GAS_CHANNEL);
      postQueryViewCount++;
    }
  }
  render() {
    return null;
  }
}

export const PreQueryScreenEvent = withAnalyticsEvents()(
  PreQueryScreenEventComponent,
);
export const PostQueryScreenEvent = withAnalyticsEvents()(
  PostQueryScreenEventComponent,
);
