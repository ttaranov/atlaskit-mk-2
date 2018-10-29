import * as React from 'react';
import { IntlProvider } from 'react-intl';
import Button from '@atlaskit/button';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';
import { FocusedTaskCloseAccount, DeleteUserOverviewScreen } from '../src';

const submitButton = (
  <Button appearance="primary" onClick={() => null}>
    Delete account
  </Button>
);

const deleteUserOverviewScreen = (
  <DeleteUserOverviewScreen
    accessibleSites={accessibleSites}
    isCurrentUser
    user={catherineHirons}
  />
);

export default class SingleScreenDrawerExample extends React.Component {
  state = {
    isOpen: false,
  };

  openDrawer = () => this.setState({ isOpen: true });

  closeDrawer = () => this.setState({ isOpen: false });

  render() {
    return (
      <IntlProvider locale="en">
        <>
          <span>
            <Button onClick={this.openDrawer}>Open drawer</Button>
          </span>
          {this.state.isOpen && (
            <FocusedTaskCloseAccount
              onClose={this.closeDrawer}
              isOpen
              screens={[deleteUserOverviewScreen]}
              submitButton={submitButton}
              learnMoreLink={'https://hello.atlassian.net'}
            />
          )}
        </>
      </IntlProvider>
    );
  }
}
