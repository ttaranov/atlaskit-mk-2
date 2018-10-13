import * as React from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';

import { RightToBeForgottenDrawer } from '../src';
import { OverviewScreen } from '../src/components/OverviewScreen';
import ContentPreviewScreen from '../src/components/ContentPreviewScreen';
import accessibleSites from '../src/mocks/accessibleSites';

const catherineHirons = {
  id: 'chirons',
  fullName: 'Catherine Hirons',
  email: 'catherine.hirons@acme.com',
};

const Outer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Controls = styled.div`
  background: #5e6c84;
  height: 48px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  padding: 0 8px;

  opacity: 0.5;
  transition: opacity 0.25s;

  :hover {
    opacity: 1;
  }
`;

export default class DeleteUserDrawerExample extends React.Component {
  state = {
    isCurrentUser: false,
    isOpen: true,
  };

  openDrawer = () => this.setState({ isOpen: true });

  closeDrawer = () => this.setState({ isOpen: false });

  toggleIsCurrentUser = event =>
    this.setState({ isCurrentUser: event.target.checked });

  renderOverviewScreen = () => (
    <OverviewScreen
      accessibleSites={accessibleSites}
      isCurrentUser={this.state.isCurrentUser}
      user={catherineHirons}
    />
  );

  renderContentPreviewScreen = () => (
    <ContentPreviewScreen user={catherineHirons} />
  );

  render() {
    return (
      <Outer>
        <Controls>
          <Checkbox
            label="Is current user"
            onChange={this.toggleIsCurrentUser}
            name="toggle-is-current-user"
          />
        </Controls>
        <IntlProvider locale="en">
          <>
            <span>
              <Button onClick={this.openDrawer}>Open drawer</Button>
            </span>
            {this.state.isOpen && (
              <RightToBeForgottenDrawer
                onClose={this.closeDrawer}
                deleteAccount={() => null}
                isOpen
                screens={[
                  this.renderOverviewScreen(),
                  this.renderContentPreviewScreen(),
                ]}
              />
            )}
          </>
        </IntlProvider>
      </Outer>
    );
  }
}
