import * as React from 'react';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { CollapsedIconTitleDescriptionLayout } from '../CollapsedIconTitleDescriptionLayout';
import { IconBackground } from './styled';

export interface ForbiddenViewProps {
  url: string;
  onClick?: () => void;
  onAuthorise?: () => void;
}

export class ForbiddenView extends React.Component<ForbiddenViewProps> {
  handleAuthorise = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      event.preventDefault();
      event.stopPropagation();
      onAuthorise();
    }
  };

  render() {
    const { url, onClick, onAuthorise } = this.props;
    return (
      <CollapsedFrame minWidth={minWidth} maxWidth={maxWidth} onClick={onClick}>
        <CollapsedIconTitleDescriptionLayout
          icon={
            <IconBackground>
              <LockFilledIcon
                label="forbidden"
                size="medium"
                primaryColor={colors.N0}
              />
            </IconBackground>
          }
          title={url}
          description={
            <>
              You don't have permission to view this.{' '}
              {onAuthorise && (
                <Button
                  appearance="link"
                  spacing="none"
                  onClick={this.handleAuthorise as () => void}
                >
                  Try another account
                </Button>
              )}
            </>
          }
        />
      </CollapsedFrame>
    );
  }
}
