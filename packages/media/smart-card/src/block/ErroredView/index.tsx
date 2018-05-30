import * as React from 'react';
import Button from '@atlaskit/button';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { colors } from '@atlaskit/theme';
import { SingleLineLayout } from '../SingleLineLayout';

export interface ErroredViewProps {
  message: string;
  onRetry?: () => void;
  onDismis?: () => void;
}

export class ErroredView extends React.Component<ErroredViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry();
    }
  };

  handleDismis = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onDismis } = this.props;
    if (onDismis) {
      onDismis();
    }
  };

  renderLeft() {
    return (
      <WarningIcon label="error" size="small" primaryColor={colors.Y300} />
    );
  }

  renderMiddle() {
    const { message } = this.props;
    return message;
  }

  renderRight() {
    const { onRetry, onDismis } = this.props;
    return (
      <>
        {onRetry && (
          <Button appearance="link" onClick={this.handleRetry as () => void}>
            Try again
          </Button>
        )}
        {onDismis && (
          <Button
            appearance="subtle"
            iconBefore={
              <CrossIcon
                label="dismis"
                size="small"
                primaryColor={colors.N500}
              />
            }
            onClick={this.handleDismis as () => void}
          />
        )}
      </>
    );
  }

  render() {
    return (
      <SingleLineLayout
        left={this.renderLeft()}
        middle={this.renderMiddle()}
        right={this.renderRight()}
      />
    );
  }
}
