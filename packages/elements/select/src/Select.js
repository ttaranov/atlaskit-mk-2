// @flow

import Select from 'react-select';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import createSelect from './createSelect';

const SelectWithoutAnalytics = createSelect(Select);
export { SelectWithoutAnalytics as Select };

export default withAnalyticsContext({
  component: 'select',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onKeyDown: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'keydown',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(SelectWithoutAnalytics),
);
