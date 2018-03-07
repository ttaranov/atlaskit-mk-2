//@flow
import React from 'react';
import AkNPS from '../src/NPS';

const DEFAULT_PROPS = {
  isDismissable: true,
  canOptOut: true,
  product: 'Stride',
};

export class NPSExample extends React.Component<any, any> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = {
      rating: null,
      comment: null,
      role: null,
      canContact: false,
      feedbackSubmission: null,
    };
  }

  onRatingSelect = (rating: any) => {
    this.setState({ rating });
  };

  onCommentChange = (comment: any) => {
    this.setState({ comment });
  };

  onFeedbackSubmit = (result: any) => {
    this.setState({
      feedbackSubmission: result,
    });
  };

  render() {
    return (
      <div>
        <AkNPS
          {...this.props}
          onRatingSelect={this.onRatingSelect}
          onCommentChange={this.onCommentChange}
          onFeedbackSubmit={this.onFeedbackSubmit}
        />
        <h3>Received Values</h3>
        <table>
          <tr>
            <td>Rating</td>
            <td>{this.state.rating}</td>
          </tr>
          <tr>
            <td>Comment</td>
            <td>{this.state.comment}</td>
          </tr>
          <tr>
            <td>Feedback Submission</td>
            <td>{JSON.stringify(this.state.feedbackSubmission)} </td>
          </tr>
        </table>
      </div>
    );
  }
}

export function getNPSExample(overrides?: Object) {
  return () => <NPSExample {...DEFAULT_PROPS} {...overrides} />;
}
