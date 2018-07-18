// @flow

import React from 'react';
import { Subscribe } from 'unstated';

import UIState from './UIState';
import type { UIStateSubscriberProps } from './types';

export default ({ children }: UIStateSubscriberProps) => (
  <Subscribe to={[UIState]}>{children}</Subscribe>
);
