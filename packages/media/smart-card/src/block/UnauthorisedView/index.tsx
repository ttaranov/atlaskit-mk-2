import * as React from 'react';
import Button from '@atlaskit/button';
import { IconAndDetailLayout } from '../utils/IconAndDetailLayout';
import { icon } from './icons';
import { Icon, Title, Description, ButtonGroup } from './styled';

export interface UnauthorisedViewProps {
  service: string;
  onAuthenticate?: () => void;
}

export class UnauthorisedView extends React.Component<UnauthorisedViewProps> {
  render() {
    const { service, onAuthenticate } = this.props;
    return (
      <IconAndDetailLayout
        left={<Icon src={icon} />}
        right={
          <div>
            <Title>Get more out of your links</Title>
            <Description>
              Make these link previews 18% more breathtaking by connecting{' '}
              {service} to your Atlassian products.
            </Description>
            <ButtonGroup>
              <Button
                appearance="primary"
                spacing="compact"
                onClick={onAuthenticate}
              >
                Connect
              </Button>
            </ButtonGroup>
          </div>
        }
      />
    );
  }
}
