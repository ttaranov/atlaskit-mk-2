// @flow

import type { ComponentType } from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';

import { navigationChannel } from '../common/constants';

const getDisplayName = component =>
  component ? component.displayName || component.name : undefined;

export const navigationItemClicked = (
  Component: ComponentType<any>,
  componentName: string,
) => {
  return withAnalyticsContext({
    componentName,
  })(
    withAnalyticsEvents({
      onClick: (createAnalyticsEvent, props) => {
        const event = createAnalyticsEvent({
          action: 'clicked',
          actionSubject: 'navigationItem',
          actionSubjectId: props.id,
          attributes: {
            componentName,
            iconSource:
              getDisplayName(props.icon) || getDisplayName(props.before),
            navigationItemIndex: props.index,
          },
        });

        event.fire(navigationChannel);

        return null;
      },
    })(Component),
  );
};
