// @flow

import React from 'react';
import { akGridSizeUnitless as marginTop } from '@atlaskit/util-shared-styles';
import Flag from '../src';
import { getIcon } from './example-utils/utils';

const actions = [
  { content: 'Understood', onClick: () => {} },
  { content: 'No Way!', onClick: () => {} },
];
const appearances = {
  error: {
    description: 'You need to take action, something has gone terribly wrong!',
    title: 'Uh oh!',
  },
  info: {
    description:
      "This alert needs your attention, but it's not super important.",
    title: 'Hey, did you know...',
  },
  success: {
    description: 'Nothing to worry about, everything is going great!',
    title: 'Good news, everyone',
  },
  warning: {
    description: 'Pay attention to me, things are not going according to plan.',
    title: 'Heads up!',
  },
};

export default () => (
  <div>
    {Object.keys(appearances).map((type, idx) => (
      <div key={type} style={idx ? { marginTop } : null}>
        <Flag
          actions={actions}
          appearance={type}
          description={appearances[type].description}
          icon={getIcon(type, 'currentColor')}
          id={type}
          isDismissAllowed
          key={type}
          title={appearances[type].title}
        />
      </div>
    ))}
  </div>
);
