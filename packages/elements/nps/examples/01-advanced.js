//@flow
import React from 'react';
import NPS, {
  FeedbackPage,
  FollowupPage,
  ThankyouPage,
  getDefaultMessages,
} from '../src';

export default class extends React.Component<any, any> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = {
      rating: null,
      comment: null,
      role: null,
      canContact: null,
      feedbackSubmission: null,
      followupSubmission: null,
    };
  }

  onRatingSelect = (rating: any) => {
    this.setState({ rating });
  };

  onCommentChange = (comment: any) => {
    this.setState({ comment });
  };

  onFeedbackSubmit = (feedbackSubmission: any) => {
    this.setState({ feedbackSubmission });
  };

  onRoleSelect = (role: any) => {
    this.setState({ role });
  };

  onCanContactChange = (canContact: any) => {
    this.setState({ canContact });
  };

  onFollowupSubmit = (followupSubmission: any) => {
    this.setState({ followupSubmission });
  };

  render() {
    const defaultMessages = getDefaultMessages('Stride');
    return (
      <div>
        <NPS
          isDismissible
          canOptOut={false}
          onRatingSelect={this.onRatingSelect}
          onCommentChange={this.onCommentChange}
          onFeedbackSubmit={this.onFeedbackSubmit}
          onRoleSelect={this.onRoleSelect}
          onCanContactChange={this.onCanContactChange}
          onFollowupSubmit={this.onFollowupSubmit}
          renderFeedback={props => (
            <FeedbackPage
              {...props}
              messages={{
                title: 'Custom Title',
                description: 'Custom description',
                optOut: <b>Custom Opt out</b>,
                scaleLow: 'sucks',
                scaleHigh: 'pretty great',
                commentPlaceholder: 'Put your comment here',
                done: 'Submit',
              }}
            />
          )}
          renderFollowup={props => (
            <FollowupPage
              {...props}
              messages={{
                ...defaultMessages,
                title: defaultMessages.followupTitle,
                description: defaultMessages.followupDescription,
              }}
              roles={['Some job', 'Some other job', 'Some other other job']}
            />
          )}
          renderThankyou={props => (
            <ThankyouPage
              {...props}
              messages={{
                ...defaultMessages,
                title: defaultMessages.thankyouTitle,
                description: defaultMessages.thankyouDescription,
              }}
            />
          )}
        />
        <h3>Received Values</h3>
        <table>
          <tr>
            <td>Rating</td>
            <td>{String(this.state.rating)}</td>
          </tr>
          <tr>
            <td>Comment</td>
            <td>{String(this.state.comment)}</td>
          </tr>
          <tr>
            <td>Feedback Submission</td>
            <td>{JSON.stringify(this.state.feedbackSubmission)} </td>
          </tr>
          <tr>
            <td>Role</td>
            <td>{String(this.state.role)}</td>
          </tr>
          <tr>
            <td>Can Contact</td>
            <td>{String(this.state.canContact)}</td>
          </tr>
          <tr>
            <td>Followup Submission</td>
            <td>{JSON.stringify(this.state.followupSubmission)} </td>
          </tr>
        </table>
      </div>
    );
  }
}
