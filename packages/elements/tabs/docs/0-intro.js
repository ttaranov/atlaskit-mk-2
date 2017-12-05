// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Use lozenges to highlight an item's status for quick recognition. Use
  subtle lozenges by default and in instances where they may dominate the
  screen, such as in long tables.

  ## Stateful Tabs

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Tabs')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ## Stateless Tabs

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TabsStateless')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/1-stateless').default}
      title="Basic"
      source={require('!!raw-loader!../examples/1-stateless')}
    />
  )}
`;
