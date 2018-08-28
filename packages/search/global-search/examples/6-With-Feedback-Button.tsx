import * as React from 'react';
import { withFeedbackButton } from '../src/index';
import { GlobalQuickSearch } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchWithFeedbackInNavigation = withNavigation(
  withFeedbackButton(GlobalQuickSearch),
);

// nothing is working except for the feedback button
export default class extends React.Component {
  render() {
    return (
      // @ts-ignore - feedback button props not recognised
      <GlobalQuickSearchWithFeedbackInNavigation feedbackCollectorId="a0d6de4d" />
    );
  }
}
