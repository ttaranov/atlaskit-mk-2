// @flow

import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';

import { navigationChannel } from '../common/constants';

export const navigationItemClicked = (
  Component,
  componentName,
  staticProps,
) => {
  return withAnalyticsContext({
    componentName,
  })(
    withAnalyticsEvents({
      onClick: (createAnalyticsEvent, componentProps) => {
        // If we aren't wrapping an actual Item component and instead wrapping a div
        // wrapper, we will want to use static props if they exist.
        // Otherwise, use component props.
        const props = staticProps || componentProps;
        const event = createAnalyticsEvent({
          action: 'clicked',
          actionSubject: 'navigationItem',
          actionSubjectId: props.id,
          attributes: {
            componentName,
            iconSource: props.icon && props.icon.name,
            navigationItemIndex: props.index,
          },
        });

        event.fire(navigationChannel);

        return null;
      },
    })(Component),
  );
};
