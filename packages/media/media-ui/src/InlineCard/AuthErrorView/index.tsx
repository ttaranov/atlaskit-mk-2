import * as React from 'react';
import { IconWrapper } from './styled';
import { colors } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';

export interface AuthErrorViewProps {
  url: string;
  onClick?: () => void;
  onRetry?: () => void;
}

export class AuthErrorView extends React.Component<AuthErrorViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry();
    }
  };

  render() {
    const { url, onClick } = this.props;
    return (
      <Frame onClick={onClick}>
        <IconWrapper>
          <WarningIcon label="error" size="medium" primaryColor={colors.Y300} />
        </IconWrapper>
        {truncateUrlForErrorView(url)} - We were unable to authenticate.{' '}
        <Button spacing="none" appearance="link" onClick={this.handleRetry}>
          Try again
        </Button>
      </Frame>
    );
  }
}
