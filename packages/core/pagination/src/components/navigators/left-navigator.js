//@flow
import React, { Component } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import Navigator from './navigator';
import type { NavigatorPropsType } from '../../types';

class LeftNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'previous',
    children: <ChevronLeftLargeIcon />,
    isDisabled: false,
  };
  render() {
    return <Navigator {...this.props} />;
  }
}

export { LeftNavigator as LeftNavigatorWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'pagination',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'leftNavigator',

      attributes: {
        componentName: 'pagination',
        packageName,
        packageVersion,
      },
    }),
  })(LeftNavigator),
);
