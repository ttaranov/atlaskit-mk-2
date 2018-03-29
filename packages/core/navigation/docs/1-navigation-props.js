// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
  ${(
    <Props
      shouldCollapseProps
      heading="Navigation Component Props"
      props={require('!!extract-react-types-loader!../src/components/js/Navigation.js')}
    />
  )}
`;
