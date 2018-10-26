//@flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { PAGINATION_ANALYTICS_EVENT_CONTEXT } from '../../util/constants';
import type { PagePropsType } from '../../types';

class Page extends Component<PagePropsType> {
  onClick = (event: SyntheticEvent<>) => {
    const analyticsEvent = createAndFireEvent('atlaskit')({
      action: 'clicked',
      actionSubject: 'pageNumber',
      attributes: {
        ...PAGINATION_ANALYTICS_EVENT_CONTEXT,
      },
    })(this.props.createAnalyticsEvent);

    if (this.props.onClick) {
      this.props.onClick(event, analyticsEvent);
    }
  };
  render() {
    return (
      <Button {...this.props} onClick={this.onClick} appearance="subtle" />
    );
  }
}

export default withAnalyticsContext(PAGINATION_ANALYTICS_EVENT_CONTEXT)(
  withAnalyticsEvents()(Page),
);
