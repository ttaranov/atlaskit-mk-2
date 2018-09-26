// @flow

import { md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`
  The Commit List is a React component that renders a commit panel with a list of commits. The Commit Selector renders a 
  list of commits with checkboxes to select and individual commit.

  ${(
    <div>
      <Props
        heading="Commit List Props"
        props={require('!!extract-react-types-loader!../src/components/commit-list')}
      />
      <Props
        heading="Commit Selector Props"
        props={require('!!extract-react-types-loader!../src/components/commit-selector')}
      />
    </div>
  )}
`;
