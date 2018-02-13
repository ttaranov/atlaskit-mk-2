// @flow
import React, { PureComponent } from 'react';
import {
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import ResizerButtonInner from '../styled/ResizerButtonInner';

type Props = {
  isPointingRight?: boolean,
  isVisible?: boolean,
  onClick?: (Event, UIAnalyticsEvent) => void,
};

class ResizerButton extends PureComponent<Props> {
  static defaultProps = {
    isPointingRight: false,
    isVisible: false,
  };
  // Note: we always render the ResizerButtonInner here (instead of returning null immediately
  // when isVisible = false) because we want the user to be able to tab to the button always.
  render() {
    return (
      <ResizerButtonInner
        aria-expanded={!this.props.isPointingRight}
        isPointingRight={this.props.isPointingRight}
        onClick={this.props.onClick}
        isVisible={this.props.isVisible}
        onMouseDown={e => e.preventDefault()}
      />
    );
  }
}

export default withAnalyticsContext({ component: 'resizer-button' })(
  withAnalyticsEvents({ onClick: { action: 'click' } })(ResizerButton),
);
