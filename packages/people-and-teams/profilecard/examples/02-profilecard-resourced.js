// @flow
import React from 'react';
import AkProfilecardResourced from '../src';
import { getMockProfileClient } from './helper/util';

const mockClient = getMockProfileClient(10, 0);
// With a real client this would look like:
// const client = new AkProfileClient({ url: 'http://api/endpoint' });

export default function Example() {
  return (
    <AkProfilecardResourced
      userId="1"
      cloudId="dummy-cloud"
      resourceClient={mockClient}
      actions={[
        {
          label: 'View profile',
          id: 'view-profile',
          callback: () => {},
        },
      ]}
    />
  );
}
