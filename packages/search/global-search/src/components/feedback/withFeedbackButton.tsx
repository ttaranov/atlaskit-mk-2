import * as React from 'react';
import { ComponentType } from 'react';
import FeedbackButton from './FeedbackButton';

export interface WithFeedbackButtonProps {
  /**
   * The ID for the feedback collector. See: https://jira.atlassian.com/secure/ViewCollectors!default.jspa?projectKey=FEEDBACK.
   */
  feedbackCollectorId: string;
}

export default function withFeedbackButton<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P & WithFeedbackButtonProps> {
  return class WithFeedbackButton extends React.Component<
    P & WithFeedbackButtonProps
  > {
    static displayName = `WithFeedbackButton(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      const { feedbackCollectorId, ...props } = this
        .props as WithFeedbackButtonProps;

      return (
        <>
          <FeedbackButton collectorId={this.props.feedbackCollectorId} />
          <WrappedComponent {...props} />
        </>
      );
    }
  };
}
