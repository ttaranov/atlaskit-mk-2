// @flow

import React from 'react';
import { Subscribe } from 'unstated';

import NavigationState from './NavigationState';
import type { NavigationSubscriberProps } from './types';

export default ({ children }: NavigationSubscriberProps) => (
  <Subscribe to={[NavigationState]}>{children}</Subscribe>
);
