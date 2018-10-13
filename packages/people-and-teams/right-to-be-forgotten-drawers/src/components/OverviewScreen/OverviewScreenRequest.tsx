import * as React from 'react';
import Request from '../Request';
import OverviewScreen from './OverviewScreen';

import { getAvailableSites } from '../../__temp_mocks__';

export default props => (
  <Request fireOnMount request={getAvailableSites}>
    {({ data, loading }, getAvailableSites) => (
      <OverviewScreen
        {...props}
        accessibleSites={data}
        isLoading={loading}
        getAccessibleSites={getAvailableSites}
      />
    )}
  </Request>
);
