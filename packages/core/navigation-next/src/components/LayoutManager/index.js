// @flow

import React, { Component } from 'react';

import { withNavigationUIController } from '../../ui-controller';
import LayoutManager from './LayoutManager';
import type { ConnectedLayoutManagerProps } from './types';

const LayoutManagerWithNavigationUI = withNavigationUIController(LayoutManager);

export default class ConnectedLayoutManager extends Component<
  ConnectedLayoutManagerProps,
> {
  render() {
    return <LayoutManagerWithNavigationUI {...this.props} />;
  }
}
