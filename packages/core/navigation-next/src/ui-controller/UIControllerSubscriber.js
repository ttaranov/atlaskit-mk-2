// @flow

import React from 'react';
import { Subscribe } from 'unstated';

import UIController from './UIController';
import type { UIControllerSubscriberProps } from './types';

export default ({ children }: UIControllerSubscriberProps) => (
  <Subscribe to={[UIController]}>{children}</Subscribe>
);
