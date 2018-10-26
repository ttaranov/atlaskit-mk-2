//@flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import type { PagePropsType } from '../../types';

class Page extends Component<PagePropsType> {
  render() {
    return <Button {...this.props} appearance="subtle" />;
  }
}

export { Page as PageWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'pagination',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'pageNumber',

      attributes: {
        componentName: 'pagination',
        packageName,
        packageVersion,
      },
    }),
  })(Page),
);
