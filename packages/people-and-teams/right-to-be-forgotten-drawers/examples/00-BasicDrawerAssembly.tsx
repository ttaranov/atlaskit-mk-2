import * as React from 'react';
import Button from '@atlaskit/button';

import accessibleSites from '../src/mocks/accessibleSites';
import { catherineHirons } from '../src/mocks/users';

import {
  RightToBeForgottenDrawer,
  OverviewScreen,
  ContentPreviewScreen,
} from '..';

const submitButton = (
  <Button appearance="primary" onClick={() => null}>
    Delete account
  </Button>
);

export default function Example() {
  return (
    <>
      <h1>See code</h1>
      <RightToBeForgottenDrawer
        isOpen={false}
        screens={[
          <OverviewScreen
            accessibleSites={accessibleSites}
            isCurrentUser
            user={catherineHirons}
          />,
          <ContentPreviewScreen user={catherineHirons} />,
        ]}
        submitButton={submitButton}
      />
    </>
  );
}
