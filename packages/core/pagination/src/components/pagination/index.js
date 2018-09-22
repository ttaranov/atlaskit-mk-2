//@flow
import React, { Component, Fragment } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Link from '../link';
import { LeftNavigator, RightNavigator } from '../navigators';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';

type Props = {
  children: Function,
};

class Pagination extends Component<Props> {
  render() {
    const { children } = this.props;
    return children ? children(LeftNavigator, Link, RightNavigator) : null;
  }
}

export { Pagination as PaginationWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'pagination',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'pageNumber',

      attributes: {
        componentName: 'pagination',
        packageName,
        packageVersion,
      },
    }),
  })(Pagination),
);
