//@flow

import React from 'react';

export class WithDataDisplay extends React.Component<any, any> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = {
      rating: null,
      comment: null,
      role: null,
      canContact: null,
      feedbackSubmission: null,
      followupSubmission: null,
      finishSubmission: null,
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

  onFinish = (finishSubmission: any) => {
    this.setState({ finishSubmission });
  };

  render() {
    return (
      <div>
        {this.props.children({
          onRatingSelect: this.onRatingSelect,
          onCommentChange: this.onCommentChange,
          onFeedbackSubmit: this.onFeedbackSubmit,
          onRoleSelect: this.onRoleSelect,
          onCanContactChange: this.onCanContactChange,
          onFollowupSubmit: this.onFollowupSubmit,
          onFinish: this.onFinish,
        })}
        <br /> <br /> <br />
        <h5>Received Values</h5>
        <table>
          <tr>
            <td>Rating</td>
            {this.state.rating !== null ? (
              <td>{String(this.state.rating)}</td>
            ) : null}
          </tr>
          <tr>
            <td>Comment</td>
            {this.state.comment ? <td>{String(this.state.comment)}</td> : null}
          </tr>
          <tr>
            <td>Feedback Submission</td>
            {this.state.feedbackSubmission ? (
              <td>{JSON.stringify(this.state.feedbackSubmission)} </td>
            ) : null}
          </tr>
          <tr>
            <td>Role</td>
            {this.state.role ? <td>{String(this.state.role)}</td> : null}
          </tr>
          <tr>
            <td>Can Contact</td>
            {this.state.canContact ? (
              <td>{String(this.state.canContact)}</td>
            ) : null}
          </tr>
          <tr>
            <td>Followup Submission</td>
            {this.state.followupSubmission ? (
              <td>{JSON.stringify(this.state.followupSubmission)} </td>
            ) : null}
          </tr>
          <tr>
            <td>Finish Submission</td>
            {this.state.finishSubmission ? (
              <td>{JSON.stringify(this.state.finishSubmission)} </td>
            ) : null}
          </tr>
        </table>
      </div>
    );
  }
}
