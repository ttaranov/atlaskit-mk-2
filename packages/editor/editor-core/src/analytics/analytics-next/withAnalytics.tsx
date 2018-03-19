import * as React from 'react';
import * as PropTypes from 'prop-types';

const withAnalyticsNext = WrappedComponent =>
  class WithAnalyticsNext extends React.Component {
    static displayName = `WithAnalyticsNext(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    static contextTypes = {
      getAtlaskitAnalyticsEventHandlers: PropTypes.func,
      getAtlaskitAnalyticsContext: PropTypes.func,
    };

    constructor(props: any) {
      super(props);
    }

    render() {
      return (
        <WrappedComponent {...this.props} analyticsNextContext={this.context} />
      );
    }
  };

export default withAnalyticsNext;
