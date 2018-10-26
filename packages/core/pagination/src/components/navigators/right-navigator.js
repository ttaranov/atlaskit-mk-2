//@flow
import React, { Component } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { PAGINATION_ANALYTICS_EVENT_CONTEXT } from '../../util/constants';
import Navigator from './navigator';
import type { NavigatorPropsType } from '../../types';

class RightNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'next',
    children: <ChevronRightLargeIcon />,
    isDisabled: false,
  };

  onClick = (event: SyntheticEvent<>) => {
    const analyticsEvent = createAndFireEvent('atlaskit')({
      action: 'clicked',
      actionSubject: 'nextPage',
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
  withAnalyticsEvents()(RightNavigator),
);
