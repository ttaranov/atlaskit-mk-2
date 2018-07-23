// @flow
import React from 'react';
import { profiles } from '../mock-helpers/index';
import { AkProfilecard } from '../src';

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
  return (
    <AkProfilecard
      avatarUrl={avatarImage}
      fullName="Rosalyn Frankling"
      meta="Manager"
      nickname="rfranklin"
      email="rfranklin@acme.com"
      timestring="18:45"
      location="Somewhere, World"
      presence="busy"
      presenceMessage="In a meeting"
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
