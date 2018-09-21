import * as React from 'react';
import ModalPromise from './ModalWrapper';
import FieldTextArea from '@atlaskit/field-text-area';
import sendFeedback from './feedback-client';

export interface Props {
  collectorId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default class FeedbackDialog extends React.Component<Props> {
  state = {
    isInvalid: false,
    feedbackText: '',
    Modal: null,
  };

  submit = () => {
    const { feedbackText } = this.state;

    // validate text input
    if (!feedbackText || feedbackText.length === 0) {
      this.setState({
        isInvalid: true,
      });
      return;
    }

    // don't wait for the feedback request to return since it may take a while
    sendFeedback(feedbackText, this.props.collectorId);
    this.props.onSubmit();
  };

  handleTextAreaChange = e => {
    this.setState({
      feedbackText: e.target.value.trim(),
      isInvalid: false,
    });
  };

  componentDidMount() {
    ModalPromise.then(Modal => this.setState({ Modal }));
  }

  renderDialog(Modal: new () => React.Component<any, any>) {
    const actions = [
      { text: 'Submit feedback', onClick: this.submit },
      { text: 'Cancel', onClick: this.props.onClose },
    ];

    return (
      <Modal
        actions={actions}
        width="small"
        onClose={this.props.onClose}
        heading="Tell us what you think"
        autoFocus
      >
        <p>
          Thank you for taking the time to write about your Confluence search
          experience. We guarantee we’ll read all feedback and consider it
          carefully!
        </p>
        <FieldTextArea
          autoFocus
          value=""
          label="Share your feedback"
          shouldFitContainer
          minimumRows={4}
          isInvalid={this.state.isInvalid}
          onChange={this.handleTextAreaChange}
        />
      </Modal>
    );
  }

  render() {
    const { Modal } = this.state;
    return Modal ? this.renderDialog(Modal) : null;
  }
}
