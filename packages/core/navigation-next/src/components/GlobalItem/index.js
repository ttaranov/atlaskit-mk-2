// @flow

import React, { PureComponent } from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import { ANALYTICS_CHANNEL } from '../../common/constants';
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

const createAndFire = createAndFireEvent(ANALYTICS_CHANNEL);

export default withAnalyticsEvents({
  onClick: (createEvent, props) =>
    createAndFire({
      action: 'clicked',
      actionSubject: 'globalItem',
      actionSubjectId: props.label,
      eventType: 'ui',
    })(createEvent),
})(GlobalItem);

export type { GlobalItemProps } from './types';
