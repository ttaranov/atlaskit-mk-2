import * as React from 'react';
import { colors } from '@atlaskit/theme';
import LockIcon from '@atlaskit/icon/glyph/lock-filled';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

export interface ForbiddenViewProps {
  url: string;
  onClick?: () => void;
  onAuthorise?: () => void;
}

export class ForbiddenView extends React.Component<ForbiddenViewProps> {
  handleRetry = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      event.preventDefault();
      event.stopPropagation();
      onAuthorise();
    }
  };

  render() {
    const { url, onClick } = this.props;
    return (
      <Frame onClick={onClick}>
        <IconAndTitleLayout
          icon={
            <LockIcon label="error" size="medium" primaryColor={colors.B400} />
          }
          title={
            truncateUrlForErrorView(url) +
            " - You don't have permissions to view"
          }
        />{' '}
        <Button spacing="none" appearance="link" onClick={this.handleRetry}>
          Try another account
        </Button>
      </Frame>
    );
  }
}
