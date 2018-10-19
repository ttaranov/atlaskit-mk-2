import * as React from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next-types';

export type Props = {
  render: (
    createAnalyticsEvent?: CreateUIAnalyticsEventSignature,
  ) => React.ReactNode;
};

export const WithCreateAnalyticsEvent: React.ComponentClass<
  Props
> = withAnalyticsEvents()(
  class WithCreateAnalyticsEvent extends React.Component<
    Props & WithAnalyticsEventProps
  > {
    render() {
      const { render, createAnalyticsEvent } = this.props;
      return render(createAnalyticsEvent);
    }
  },
);
