// @flow

import React, { Component } from 'react';

import { UIStateSubscriber } from '../../ui-state';
import LayoutManager from './LayoutManager';
import type { ConnectedLayoutManagerProps } from './types';

export default class ConnectedLayoutManager extends Component<
  ConnectedLayoutManagerProps,
> {
  render() {
    return (
      <UIStateSubscriber>
        {navigationUI => (
          <LayoutManager navigationUI={navigationUI} {...this.props} />
        )}
      </UIStateSubscriber>
    );
  }
}
