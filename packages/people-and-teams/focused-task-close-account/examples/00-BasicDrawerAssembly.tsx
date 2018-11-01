import * as React from 'react';
import Button from '@atlaskit/button';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';

import {
  FocusedTaskCloseAccount,
  DeleteUserOverviewScreen,
  DeleteUserContentPreviewScreen,
} from '../src';

const submitButton = (
  <Button appearance="primary" onClick={() => null}>
    Delete account
  </Button>
);

export default function Example() {
  return (
    <>
      <h1>See code</h1>
      <FocusedTaskCloseAccount
        onClose={() => {}}
        isOpen={false}
        screens={[
          <DeleteUserOverviewScreen
            accessibleSites={accessibleSites}
            isCurrentUser
            user={catherineHirons}
          />,
          <DeleteUserContentPreviewScreen user={catherineHirons} />,
        ]}
        submitButton={submitButton}
        learnMoreLink={''}
      />
    </>
  );
}
