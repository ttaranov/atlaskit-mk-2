// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  This package provides component used for pagination. It truncates the total
  number of pages and shows ellipsis when needed.

  Depending on whether the \`defaultCurrent\` or \`current\` prop are specified,
  the current page value will be uncontrolled or controlled. See the example
  below for a more detailed explaination on the difference.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Pagination')}
    />
  )}

  ## Basic example

  In this example, the \`defaultCurrent\` prop is passed to \`Pagination\`. This
  means that \`Pagination\` keeps track of the current page and notifies the
  consumer when the page changes through the \`onSetPage\` prop. When \`defaultCurrent\`
  is specified, the current page value is uncontrolled.

  ${(
    <Example
      Component={require('../examples/01-uncontrolled').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/01-uncontrolled')}
    />
  )}

  ## Migrating to version 4

  In version 4 we have simplified the package to export a single component.
  This section describes the changes in version 4.

  ### Removal of Stateless component

  This export has been removed from the package. The value of the current page
  value can be controlled by using the \`current\` prop from the default import.

  Before version 4:

  ${code`
import React from 'react';
import { PaginationStateless } from '@atlaskit/pagination';

export default () => (
  <PaginationStateless
    current={4}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
  `}

  In version 4:

  ${code`
import React from 'react';
import Pagination from '@atlaskit/pagination';

export default () => (
  <Pagination
    current={4}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
  `}
`;
