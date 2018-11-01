import * as React from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';
import StatefulInlineDialog from '../src/components/StatefulInlineDialog';
import {
  FocusedTaskCloseAccount,
  DeleteUserOverviewScreen,
  DeleteUserContentPreviewScreen,
} from '../src';

const Controls = styled.div`
  display: flex;
  align-items: center;
  > {
    padding-right: 4px;
  }
`;

const submitButton = (
  <Button appearance="primary" onClick={() => null}>
    Delete account
  </Button>
);

export default class DeleteUserDrawerExample extends React.Component {
  state = {
    isCurrentUser: false,
    isOpen: false,
  };

  openDrawer = () => this.setState({ isOpen: true });

  closeDrawer = () => this.setState({ isOpen: false });

  handleDeactivateUser = () => <></>;

  toggleIsCurrentUser = event =>
    this.setState({ isCurrentUser: event.target.checked });

  renderDeleteUserOverviewScreen = () => (
    <DeleteUserOverviewScreen
      accessibleSites={accessibleSites}
      isCurrentUser={this.state.isCurrentUser}
      user={catherineHirons}
      deactivateUserHandler={this.handleDeactivateUser}
    />
  );

  renderDeleteUserContentPreviewScreen = () => (
    <DeleteUserContentPreviewScreen user={catherineHirons} />
  );

  render() {
    return (
      <IntlProvider locale="en">
        <>
          <Controls>
            <Button onClick={this.openDrawer}>Open drawer</Button>
            <Checkbox
              label={
                <StatefulInlineDialog
                  placement="right"
                  content="Toggles between 2nd and 3rd person text."
                >
                  Is current user
                </StatefulInlineDialog>
              }
              onChange={this.toggleIsCurrentUser}
              name="toggle-is-current-user"
            />
          </Controls>
          {this.state.isOpen && (
            <FocusedTaskCloseAccount
              onClose={this.closeDrawer}
              isOpen
              screens={[
                this.renderDeleteUserOverviewScreen(),
                this.renderDeleteUserContentPreviewScreen(),
              ]}
              submitButton={submitButton}
              learnMoreLink={'https://hello.atlassian.net'}
            />
          )}
        </>
      </IntlProvider>
    );
  }
}
