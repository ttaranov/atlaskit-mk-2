// @flow

import { md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`
  The Mobile Header is a way to render a header that hides the Navigation and Sidebar
  from smaller screens and allows the user to view them by tapping/clicking icons.

  ${(
    <Props
      heading="Mobile Header Props"
      props={require('!!extract-react-types-loader!../src/components/MobileHeader')}
    />
  )}
`;
