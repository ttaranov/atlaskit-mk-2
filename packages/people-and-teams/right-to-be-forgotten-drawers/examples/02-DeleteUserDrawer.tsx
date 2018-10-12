import React from 'react';
import { IntlProvider } from 'react-intl';
import { DeleteUserDrawer } from '../src';

const catherineHirons = {
  id: 'chirons',
  fullName: 'Catherine Hirons',
  email: 'catherine.hirons@acme.com',
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <DeleteUserDrawer
        user={catherineHirons}
        onClose={() => null}
        deleteAccount={() => null}
        isOpen
        currentUserId="chirons"
      />
    </IntlProvider>
  );
}
