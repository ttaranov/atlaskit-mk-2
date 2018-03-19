import * as React from 'react';
import * as PropTypes from 'prop-types';

const ContextTypes = {
  getAtlaskitAnalyticsEventHandlers: PropTypes.func,
  getAtlaskitAnalyticsContext: PropTypes.func,
};

export interface AnalyticsNextContext {
  getAtlaskitAnalyticsEventHandlers?: () => any;
  getAtlaskitAnalyticsContext?: () => any;
}

export default class AnalyticsDelegate extends React.Component<
  AnalyticsNextContext,
  {}
> {
  static childContextTypes = ContextTypes;

  getChildContext() {
    return {
      getAtlaskitAnalyticsEventHandlers: this.props
        .getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext: this.props.getAtlaskitAnalyticsContext,
    };
  }

  render() {
    const { children } = this.props;
    return React.Children.only(children);
  }
}
