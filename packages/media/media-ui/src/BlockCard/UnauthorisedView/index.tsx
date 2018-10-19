import * as React from 'react';
import Button from '@atlaskit/button';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { CollapsedIconTitleDescriptionLayout } from '../CollapsedIconTitleDescriptionLayout';
import { ImageIcon } from '../ImageIcon';

export interface BlockCardUnauthorisedViewProps {
  icon?: string;
  url: string;
  onClick?: () => void;
  onAuthorise?: () => void;
  isSelected?: boolean;
}

export class BlockCardUnauthorisedView extends React.Component<
  BlockCardUnauthorisedViewProps
> {
  handleAuthorise = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      event.preventDefault();
      event.stopPropagation();
      onAuthorise();
    }
  };

  render() {
    const { icon, url, onClick, onAuthorise, isSelected } = this.props;
    return (
      <CollapsedFrame
        isSelected={isSelected}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={onClick}
      >
        <CollapsedIconTitleDescriptionLayout
          icon={<ImageIcon src={icon} size={24} />}
          title={url}
          description="Connect your account to see a link preview"
          other={
            onAuthorise && (
              <Button
                appearance="subtle"
                spacing="compact"
                onClick={this.handleAuthorise as () => void}
              >
                Connect
              </Button>
            )
          }
        />
      </CollapsedFrame>
    );
  }
}
