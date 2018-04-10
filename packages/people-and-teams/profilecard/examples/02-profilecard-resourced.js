// @flow
import React from 'react';
import { profilecard as profilecardUtils } from '@atlaskit/util-data-test';
import AkProfilecardResourced, { modifyResponse } from '../src';

const { profiles } = profilecardUtils;

class MockClient {
  getProfile = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const profileData = modifyResponse(profiles[1]);
        profileData.isCensored = false;
        resolve(profileData);
      }, 1500);
    });
  };
}

const client = new MockClient();
// With a real client this would look like:
// const client = new AkProfileClient({ url: 'http://api/endpoint' });

export default function Example() {
  return (
    <AkProfilecardResourced
      userId="dummy-user"
      cloudId="dummy-cloud"
      actions={[
        {
          label: 'View profile',
          id: 'view-profile',
          callback: () => {},
        },
      ]}
      resourceClient={client}
    />
  );
}
