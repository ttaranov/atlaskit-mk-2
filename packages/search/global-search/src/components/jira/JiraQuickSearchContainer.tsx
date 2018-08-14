import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics } from '@atlaskit/analytics';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn;
}

export interface State {}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  render() {
    return null;
  }
}

export default injectIntl<Props>(
  withAnalyticsEvents()(withAnalytics(JiraQuickSearchContainer, {}, {})),
);
