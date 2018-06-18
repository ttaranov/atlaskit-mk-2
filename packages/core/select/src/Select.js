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
  componentName: 'select',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'select',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),

    onKeyDown: createAndFireEventOnAtlaskit({
      action: 'keyDowned',
      actionSubject: 'select',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
  })(SelectWithoutAnalytics),
);
