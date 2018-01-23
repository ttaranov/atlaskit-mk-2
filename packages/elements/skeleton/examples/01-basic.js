// @flow

import React from 'react';

import { Paragraph, Icon, Avatar } from '../src';
import { ComponentDisplay, Gap } from './util';

export default () => (
  <ComponentDisplay>
    <div>
      <Avatar size="small" />
      <Gap />
      <Avatar size="medium" />
      <Gap />
      <Avatar size="large" />
    </div>
    <div>
      <Icon />
      <Gap />
      <Icon size="large" />
      <Gap />
      <Icon size="xlarge" />
    </div>
    <div>
      <Paragraph />
      <Paragraph />
    </div>
  </ComponentDisplay>
);
