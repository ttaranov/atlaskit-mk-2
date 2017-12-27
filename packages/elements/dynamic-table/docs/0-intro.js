// @flow

import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default (
  <div>
    {md`
      The Dynamic Table component is a table component with pagination and sorting functionality.

      ## Examples

      ${(
        <Example
          Component={require('../examples/0-stateful').default}
          title="Stateful"
          source={require('!!raw-loader!../examples/0-stateful')}
        />
      )}

      ${(
        <Example
          Component={require('../examples/1-stateless').default}
          title="Stateless"
          source={require('!!raw-loader!../examples/1-stateless')}
        />
      )}

      ${(
        <Props
          heading={'Stateful Dynamic Table Component Props'}
          props={require('!!extract-react-types-loader!../src/components/Stateful')}
        />
      )}

      ${(
        <Props
          heading={'Stateless Dynamic Table Component Props'}
          props={require('!!extract-react-types-loader!../src/components/Stateless')}
        />
      )}
    `}
  </div>
);
