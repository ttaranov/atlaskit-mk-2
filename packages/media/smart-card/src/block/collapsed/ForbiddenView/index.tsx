import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { IconTitleDescriptionLayout } from '../IconTitleDescriptionLayout';

export interface ForbiddenViewProps {
  icon?: string;
  onAuthorise?: () => void;
}

export class ForbiddenView extends React.Component<ForbiddenViewProps> {
  handleAuthorise = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      onAuthorise();
    }
  };

  renderRight() {
    return (
      <Button
        appearance="subtle"
        iconBefore={
          <ShortcutIcon label="open" size="small" primaryColor={colors.N500} />
        }
        onClick={this.handleAuthorise as () => void}
      />
    );
  }

  render() {
    const { icon } = this.props;
    return (
      <IconTitleDescriptionLayout
        icon={icon}
        title="You don't have permission to view this"
        description="Request access or try another account to see this preview"
        right={this.renderRight()}
      />
    );
  }
}
