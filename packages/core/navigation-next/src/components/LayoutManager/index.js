// @flow

import React, { Component } from 'react';

import { withNavigationUI } from '../../ui-state';
import LayoutManager from './LayoutManager';
import type { ConnectedLayoutManagerProps } from './types';

const LayoutManagerWithNavigationUI = withNavigationUI(LayoutManager);

export default class ConnectedLayoutManager extends Component<
  ConnectedLayoutManagerProps,
> {
  render() {
    return <LayoutManagerWithNavigationUI {...this.props} />;
  }
}
