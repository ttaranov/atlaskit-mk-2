import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { IconTitleDescriptionLayout } from '../IconTitleDescriptionLayout';

export interface UnauthorisedViewProps {
  icon?: string;
  service: string;
  onAuthorise?: () => void;
}

export class UnauthorisedView extends React.Component<UnauthorisedViewProps> {
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
    const { icon, service } = this.props;
    return (
      <IconTitleDescriptionLayout
        icon={icon}
        title={`Click the button to connect your ${service} account.`}
        description="This lets us show you information about the link."
        right={this.renderRight()}
      />
    );
  }
}
