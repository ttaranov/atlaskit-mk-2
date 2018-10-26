//@flow
import React, { Component } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { PAGINATION_ANALYTICS_EVENT_CONTEXT } from '../../util/constants';
import Navigator from './navigator';
import type { NavigatorPropsType } from '../../types';

class LeftNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'previous',
    children: <ChevronLeftLargeIcon />,
    isDisabled: false,
  };

  onClick = (event: SyntheticEvent<>) => {
    const analyticsEvent = createAndFireEvent('atlaskit')({
      action: 'clicked',
      actionSubject: 'previousPage',
      attributes: {
        ...PAGINATION_ANALYTICS_EVENT_CONTEXT,
      },
    })(this.props.createAnalyticsEvent);

    if (this.props.onClick) {
      this.props.onClick(event, analyticsEvent);
    }
  };

  render() {
    return <Navigator {...this.props} onClick={this.onClick} />;
  }
}

export default withAnalyticsContext(PAGINATION_ANALYTICS_EVENT_CONTEXT)(
  withAnalyticsEvents()(LeftNavigator),
);
