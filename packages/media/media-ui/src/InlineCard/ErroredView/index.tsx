import * as React from 'react';
import { IconWrapper } from './styled';
import { colors } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';

export interface ErroredViewProps {
  url: string;
  message: string;
  onClick?: () => void;
  onRetry?: () => void;
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

  render() {
    const { url, message, onClick, onRetry } = this.props;
    return (
      <Frame onClick={onClick}>
        <IconWrapper>
          <WarningIcon label="error" size="medium" primaryColor={colors.Y300} />
        </IconWrapper>
        {truncateUrlForErrorView(url)} - {message.trim() + ' '}
        {onRetry && (
          <Button spacing="none" appearance="link" onClick={this.handleRetry}>
            Try again
          </Button>
        )}
      </Frame>
    );
  }
}
