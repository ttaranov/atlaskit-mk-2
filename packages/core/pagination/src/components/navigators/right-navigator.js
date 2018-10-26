//@flow
import React, { Component } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
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

class RightNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'next',
    children: <ChevronRightLargeIcon />,
    isDisabled: false,
  };
  render() {
    return <Navigator {...this.props} />;
  }
}

export { RightNavigator as RightNavigatorWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'pagination',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'rightNavigator',

      attributes: {
        componentName: 'pagination',
        packageName,
        packageVersion,
      },
    }),
  })(RightNavigator),
);
