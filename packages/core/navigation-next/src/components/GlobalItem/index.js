// @flow

import React, { PureComponent } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

class GlobalItem extends PureComponent<GlobalItemProps> {
  static defaultProps = {
    size: 'large',
    styles: styleReducerNoOp,
  };

  renderItem = (state: *) => <GlobalItemPrimitive {...state} {...this.props} />;

  render() {
    return <InteractionStateManager>{this.renderItem}</InteractionStateManager>;
  }
}

export default withAnalyticsEvents({
  onClick: {
    action: 'clicked',
    actionSubject: 'globalItem',
    eventType: 'ui',
  },
})(GlobalItem);

export type { GlobalItemProps } from './types';
