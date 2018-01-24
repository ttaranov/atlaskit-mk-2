// @flow

import React from 'react';

import { Paragraph, Icon, Avatar } from '../src';
import { ComponentDisplay, Gap } from './util';

export default () => (
  <ComponentDisplay>
    <div>
      <Avatar appearance="square" size="small" />
      <Gap />
      <Avatar appearance="circle" size="medium" />
      <Gap />
      <Avatar appearance="square" size="large" />
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
