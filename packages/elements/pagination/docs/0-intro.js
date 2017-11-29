// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package provides both a stateful (default) and stateless component. The
  stateful version is the default export, while the stateless version is exported
  as \`PaginationStateless\`.

  ## Stateful Pagination

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Stateful')}
    />
  )}

  ### Example

  ${(
    <Example
      Component={require('../examples/stateful-overview').default}
      title="Basic"
      source={require('!!raw-loader!../examples/stateful-overview')}
    />
  )}

  ## Stateless Pagination

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Stateless')}
    />
  )}

  ### Example

  ${(
    <Example
      Component={require('../examples/stateless-overview').default}
      title="Basic"
      source={require('!!raw-loader!../examples/stateless-overview')}
    />
  )}
`;
