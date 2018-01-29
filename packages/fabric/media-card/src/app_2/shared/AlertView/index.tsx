import * as React from 'react';
import { Wrapper } from './styled';

export interface AlertViewProps {
  type: 'success' | 'failure';
  message?: string;
  onTryAgain: () => void;
  onCancel: () => void;
  style?: {};
}

export default class AlertView extends React.Component<AlertViewProps> {
  handleTryAgain = () => {
    const { onTryAgain } = this.props;
    if (onTryAgain) {
      onTryAgain();
    }
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  renderContent() {
    const { type, message } = this.props;
    if (type === 'success') {
      return <span>{message}</span>;
    } else {
      return (
        <span>
          Something went wrong. <a onClick={this.handleTryAgain}>Try again</a>{' '}
          or <a onClick={this.handleCancel}>cancel</a>.
        </span>
      );
    }
  }

  render() {
    const { type, style } = this.props;
    return (
      <Wrapper type={type} style={style}>
        {this.renderContent()}
      </Wrapper>
    );
  }
}
