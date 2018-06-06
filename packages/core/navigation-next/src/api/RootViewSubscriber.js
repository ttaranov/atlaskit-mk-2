// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewState from './ViewState';

type RootViewSubscriberProps = {|
  children: ViewState => Node,
|};

let rootViewState = new ViewState();

export const getRootViewState = () => rootViewState;

// Reset this singleton for SSR.
export const resetRootViewState = () => {
  rootViewState = new ViewState();
};

export default ({ children }: RootViewSubscriberProps) => (
  <Subscribe to={[rootViewState]}>{children}</Subscribe>
);
