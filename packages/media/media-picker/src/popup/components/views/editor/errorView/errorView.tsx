import * as React from 'react';
import { Component } from 'react';
// import Button from '@atlaskit/button';

import { EscHelper } from '../escHelper';
import {
  errorHintRetry,
  errorHintCritical,
  errorButtonRetry,
  errorButtonCancel,
  errorButtonClose,
} from '../phrases';
import { CenterView } from '../styles';
import {
  ErrorPopup,
  ErrorIconWrapper,
  ErrorMessage,
  ErrorHint,
  ErrorButton,
} from './styles';

import { errorIcon } from '../../../../../icons';

export interface ErrorViewProps {
  readonly message: string;
  readonly onCancel: () => void;
  readonly onRetry?: () => void;
}

export class ErrorView extends Component<ErrorViewProps> {
  private escHelper?: EscHelper;

  componentDidMount() {
    this.escHelper = new EscHelper(this.props.onCancel);
  }

  componentWillUnmount() {
    if (this.escHelper) {
      this.escHelper.teardown();
    }
  }

  render(): JSX.Element {
    return (
      <CenterView>
        <ErrorPopup>
          <ErrorIconWrapper>{errorIcon}</ErrorIconWrapper>
          <ErrorMessage>{this.props.message}</ErrorMessage>
          <ErrorHint>{this.renderHint()}</ErrorHint>
          {this.renderTryAgainButton()}
          {this.renderCancelButton()}
        </ErrorPopup>
      </CenterView>
    );
  }

  private renderHint(): JSX.Element {
    const { onRetry } = this.props;
    if (onRetry) {
      return <span>{errorHintRetry}</span>;
    }

    return <span>{errorHintCritical}</span>;
  }

  private renderTryAgainButton(): JSX.Element | null {
    const { onRetry } = this.props;
    if (onRetry) {
      return (
        <ErrorButton appearance="primary" onClick={onRetry}>
          {errorButtonRetry}
        </ErrorButton>
      );
    }

    return null;
  }

  private renderCancelButton(): JSX.Element {
    const { onCancel, onRetry } = this.props;
    return (
      <ErrorButton appearance="subtle" onClick={onCancel}>
        {onRetry ? errorButtonCancel : errorButtonClose}
      </ErrorButton>
    );
  }
}
