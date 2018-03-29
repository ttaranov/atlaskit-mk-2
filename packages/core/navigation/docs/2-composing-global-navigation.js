// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation"
      props={require('!!extract-react-types-loader!../src/components/js/GlobalNavigation.js')}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="Global Navigation Item"
      props={require('!!extract-react-types-loader!../src/components/js/GlobalItem.js')}
    />
  )}
`;
