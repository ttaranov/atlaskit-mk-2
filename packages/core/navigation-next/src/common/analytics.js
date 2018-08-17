// @flow

import type { ComponentType } from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import type { ViewLayer } from '../view-controller/types';

const getDisplayName = component =>
  component ? component.displayName || component.name : undefined;

export const navigationChannel = 'navigation';

export const navigationItemClicked = (
  Component: ComponentType<any>,
  componentName: string,
): ComponentType<any> => {
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

export const navigationUILoaded = (
  createAnalyticsEvent: $PropertyType<
    WithAnalyticsEventsProps,
    'createAnalyticsEvent',
  >,
  { layer }: { layer: ViewLayer },
) =>
  createAnalyticsEvent({
    action: 'initialised',
    actionSubject: 'navigationUI',
    actionSubjectId: layer,
  }).fire(navigationChannel);
