import * as React from 'react';
import { IconWrapper, ViewWrapper } from './styled';
import { colors } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Button from '@atlaskit/button';
import { truncateUrlForErrorView } from '../utils';

export interface ResolvedViewProps {
  url: string;
  onTryAgain: () => void;
}

export class AuthErrorView extends React.Component<ResolvedViewProps> {
  render() {
    const { url, onTryAgain } = this.props;
    return (
      <ViewWrapper>
        <IconWrapper>
          <WarningIcon label="error" size="medium" primaryColor={colors.Y300} />
        </IconWrapper>
        {truncateUrlForErrorView(url)} - We were unable to authenticate.{' '}
        <Button spacing="none" appearance="link" onClick={onTryAgain}>
          Try again
        </Button>
      </ViewWrapper>
    );
  }
}
