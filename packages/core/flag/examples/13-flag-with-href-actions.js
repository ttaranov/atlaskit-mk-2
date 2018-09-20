// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import Flag from '../src';

export default () => (
  <Flag
    actions={[
      { content: 'with onClick', onClick: () => {} },
      {
        content: 'with href',
        href: 'https://atlaskit.atlassian.com/',
        target: '_blank',
      },
    ]}
    icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
    description="We got fun an games. We got everything you want honey, we know the names."
    id="1"
    key="1"
    title="Welcome to the jungle"
  />
);
