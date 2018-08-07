// @flow

import React, { PureComponent } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
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

export default withAnalyticsEvents({
  onClick: (createAnalyticsEvent, props) => {
    const event = createAnalyticsEvent({
      action: 'clicked',
      actionSubject: 'navigationItem',
      actionSubjectId: props.actionSubjectId,
      attributes: {
        componentName: 'globalNavigation',
        imageSource: props.icon && props.icon.name,
        navigationItemIndex: props.index,
        packageName,
        packageVersion,
      },
    });

    event.clone().fire('atlaskit');

    return event;
  },
})(GlobalItem);

export type { GlobalItemProps } from './types';
