// @flow

import React, { PureComponent } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';

import InteractionStateManager from '../InteractionStateManager';
import { styleReducerNoOp } from '../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

class GlobalItem extends PureComponent<GlobalItemProps> {
  static defaultProps = {
    label: '',
    size: 'large',
    styles: styleReducerNoOp,
  };
  renderItem = (state: *) => <GlobalItemPrimitive {...state} {...this.props} />;

  render() {
    return <InteractionStateManager>{this.renderItem}</InteractionStateManager>;
  }
}

export default withAnalyticsContext({
  componentName: 'globalItem',
})(
  withAnalyticsEvents({
    onClick: (createAnalyticsEvent, props) => {
      const event = createAnalyticsEvent({
        action: 'clicked',
        actionSubject: 'navigationItem',
        actionSubjectId: props.actionSubjectId,
        attributes: {
          componentName: 'globalItem',
          imageSource: props.icon && props.icon.name,
          navigationItemIndex: props.index,
        },
      });

      event.clone().fire('atlaskit');

      return event;
    },
  })(GlobalItem),
);

export type { GlobalItemProps } from './types';
