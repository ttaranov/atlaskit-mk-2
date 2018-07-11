import * as React from 'react';
import { colors } from '@atlaskit/theme';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

export interface ErroredViewProps {
  url: string;
  message: string;
  onClick?: () => void;
  onRetry?: () => void;
}

export class ErroredView extends React.Component<ErroredViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onRetry } = this.props;
    if (onRetry) {
      event.preventDefault();
      event.stopPropagation();
      onRetry();
    }
  };

  render() {
    const { url, message, onClick, onRetry } = this.props;
    return (
      <Frame onClick={onClick}>
        <IconAndTitleLayout
          icon={
            <ErrorIcon label="error" size="medium" primaryColor={colors.R300} />
          }
          title={
            <span style={{ color: colors.R300 }}>
              {truncateUrlForErrorView(url) + ' - ' + message.trim()}
            </span>
          }
        />{' '}
        {onRetry && (
          <Button spacing="none" appearance="link" onClick={this.handleRetry}>
            Try again
          </Button>
        )}
      </Frame>
    );
  }
}
