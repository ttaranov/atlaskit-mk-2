// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  This package provides component used for pagination. It truncates the total
  number of pages and shows ellipsis when needed.

  Depending on whether the \`defaultValue\` or \`value\` prop are specified,
  the current page value will be uncontrolled or controlled.

  In the example below, the \`defaultValue\` prop is passed to \`Pagination\`.
  This means that \`Pagination\` keeps track of the current page and notifies the
  consumer when the page changes through the \`onChange\` prop. When \`defaultValue\`
  is specified, the current page value is uncontrolled.

  ${(
    <Example
      packageName="@atlaskit/pagination"
      Component={require('../examples/01-uncontrolled').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/01-uncontrolled')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Pagination')}
    />
  )}


  ## Migrating to version 4

  In version 4 we have simplified the package to export a single component.
  This section describes the changes and how to migrate to version 4.

  ### Removal of Stateless component

  This export has been removed from the package. The value of the current page
  value can be controlled by using the \`value\` prop from the default import.

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
    value={4}
    total={10}
    onChange={page => console.log(page)}
  />
);
  `}

  ### Naming changes

  Version 4 renames props to follow more standard React naming conventions.
  Below is a table of the changes.

  #### Prop name changes

  ${(
    <table>
      <thead>
        <tr>
          <th>Before</th>
          <th>In version 4</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{md`
\`current\`
          `}</td>
          <td>{md`
\`value\`
          `}</td>
        </tr>
        <tr>
          <td>{md`
\`defaultCurrent\`
          `}</td>
          <td>{md`
\`defaultValue\`
          `}</td>
        </tr>
        <tr>
          <td>{md`
\`onSetPage\`
          `}</td>
          <td>{md`
\`onChange\`
          `}</td>
        </tr>
      </tbody>
    </table>
  )}
`;
