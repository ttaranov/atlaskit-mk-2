// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';

import ViewState from './ViewState';

type ContainerViewSubscriberProps = {|
  children: ViewState => Node,
|};

let containerViewState = new ViewState();

export const getContainerViewState = () => containerViewState;

// Reset this singleton for SSR.
export const resetContainerViewState = () => {
  containerViewState = new ViewState();
};

export default ({ children }: ContainerViewSubscriberProps) => (
  <Subscribe to={[containerViewState]}>{children}</Subscribe>
);
