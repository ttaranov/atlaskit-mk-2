import * as React from 'react';
import { IconWrapper } from './styled';
import { colors } from '@atlaskit/theme';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';

export interface ForbiddenViewProps {
  url: string;
  onClick?: () => void;
  onAuthorise?: () => void;
}

export class ForbiddenView extends React.Component<ForbiddenViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      onAuthorise();
    }
  };

  render() {
    const { url, onClick } = this.props;
    return (
      <Frame onClick={onClick}>
        <IconWrapper>
          <LockIcon label="error" size="medium" primaryColor={colors.B400} />
        </IconWrapper>
        {truncateUrlForErrorView(url)} - You don't have permissions to view
        this.{' '}
        <Button spacing="none" appearance="link" onClick={this.handleRetry}>
          Try another account
        </Button>
      </Frame>
    );
  }
}
