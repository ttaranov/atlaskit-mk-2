// @flow

import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';

export default () => (
  <Banner
    icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
    isOpen
  >
    Your license is about to expire. Click{' '}
    <a href="http://atlassian.com">here</a> to renew it.
  </Banner>
);
