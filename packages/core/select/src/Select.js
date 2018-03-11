// @flow

import Select from 'react-select';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import createSelect from './createSelect';

const SelectWithoutAnalytics = createSelect(Select);
export { SelectWithoutAnalytics as Select };

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  component: 'select',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'change',
    }),

    onKeyDown: createAndFireEventOnAtlaskit({
      action: 'keydown',
    }),
  })(SelectWithoutAnalytics),
);
