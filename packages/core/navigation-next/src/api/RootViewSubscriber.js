// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewState from './ViewState';

type RootViewSubscriberProps = {|
  children: ViewState => Node,
|};

export const rootViewState = new ViewState();

export default ({ children }: RootViewSubscriberProps) => (
  <Subscribe to={[rootViewState]}>{children}</Subscribe>
);
