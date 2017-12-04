// @flow

import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';

const Icon = <WarningIcon label="Warning icon" secondaryColor="inherit" />;

export default ({ isOpen = true }: { isOpen: boolean }) => (
  <Banner icon={Icon} isOpen={isOpen} appearance="warning">
    This is an warning banner
  </Banner>
);
